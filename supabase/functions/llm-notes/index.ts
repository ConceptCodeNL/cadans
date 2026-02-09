// Supabase Edge Function: llm-notes
// This function receives a chat history from the frontend and calls Groq's
// OpenAI-compatible chat completions API to help generate general notes.
//
// Environment:
// - Configure your Groq API key as a Supabase secret:
//     supabase secrets set GROQ_API_KEY=your_groq_key_here
//
// Frontend:
// - Point VITE_LLM_NOTES_ENDPOINT to this function URL, e.g.:
//     VITE_LLM_NOTES_ENDPOINT="https://<project>.functions.supabase.co/llm-notes"

import { serve } from "https://deno.land/std@0.224.0/http/server.ts"

const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY")

serve(async (req: Request): Promise<Response> => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 })
  }

  if (!GROQ_API_KEY) {
    return jsonResponse(
      { error: "GROQ_API_KEY is not configured on the server." },
      500,
    )
  }

  try {
    const body = await req.json()
    const messages = body?.messages

    if (!Array.isArray(messages) || messages.length === 0) {
      return jsonResponse(
        { error: "Missing or invalid 'messages' array in request body." },
        400,
      )
    }

    const groqRes = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile", // choose the Groq model you prefer
          messages,
          temperature: 0.3,
        }),
      },
    )

    if (!groqRes.ok) {
      const text = await groqRes.text()
      console.error("Groq API error:", groqRes.status, text)
      return jsonResponse(
        { error: "Groq request failed", details: text },
        500,
      )
    }

    const data = await groqRes.json()
    const choice = data?.choices?.[0]
    const msg = choice?.message

    if (!msg || !msg.content) {
      return jsonResponse(
        { error: "Groq response did not contain a valid message." },
        500,
      )
    }

    // Match the format the frontend expects: { message: { role, content } }
    return jsonResponse({ message: msg })
  } catch (e) {
    console.error("llm-notes error:", e)
    return jsonResponse(
      { error: "Unexpected error in llm-notes function", details: String(e) },
      500,
    )
  }
})

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  })
}



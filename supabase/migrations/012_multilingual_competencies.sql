-- Add multilingual columns to competency_templates
ALTER TABLE competency_templates ADD COLUMN IF NOT EXISTS name_en TEXT;
ALTER TABLE competency_templates ADD COLUMN IF NOT EXISTS name_nl TEXT;
ALTER TABLE competency_templates ADD COLUMN IF NOT EXISTS description_en TEXT;
ALTER TABLE competency_templates ADD COLUMN IF NOT EXISTS description_nl TEXT;

-- Populate multilingual columns for system defaults
-- Current `name` is English, current `description` is Dutch

UPDATE competency_templates SET
  name_en = name,
  name_nl = 'Planmatig werken',
  description_nl = description,
  description_en = 'WHAT & WHY
• Student describes the context of the assignment, clearly outlining the problem and/or cause, goal, stakeholders and scope
• Student describes the intended deliverables (products, actions) of the assignment
• Student considers both school and company (such as stakeholders, deliverables) in the right balance.

HOW
• Student determines phases and activities for the assignment, processes these into a realistic planning, and identifies relevant risks and appropriate measures
• Student justifies the chosen approach (methods & techniques), which fits the goal and context of the assignment
• Student works according to the project plan and deviates from it in consultation where necessary.

LEVEL OF INDEPENDENCE
• Student(s) independently arrive(s) at a usable (coherent, complete and of sufficient quality) Project Plan.'
WHERE name = 'Working according a plan' AND is_system_default = TRUE;

UPDATE competency_templates SET
  name_en = name,
  name_nl = 'Probleemoplossing en software bouwen',
  description_nl = description,
  description_en = 'WHAT & WHY
• Student thoroughly analyzes the problem and identifies the core issues
• Student designs and builds an appropriate software solution

HOW
• Student applies suitable methods, techniques and tools when developing software
• Student systematically tests and validates the solution
• Student documents technical choices and solutions

LEVEL OF INDEPENDENCE
• Student independently solves technical problems and seeks help when needed.'
WHERE name = 'Problem solving and building software' AND is_system_default = TRUE;

UPDATE competency_templates SET
  name_en = name,
  name_nl = 'Onderzoek',
  description_nl = description,
  description_en = 'WHAT & WHY
• Student identifies relevant research questions
• Student collects and analyzes information from reliable sources

HOW
• Student applies appropriate research methods
• Student draws substantiated conclusions from the research
• Student translates research results into practical applications

LEVEL OF INDEPENDENCE
• Student independently conducts research and integrates findings into the work.'
WHERE name = 'Research' AND is_system_default = TRUE;

UPDATE competency_templates SET
  name_en = name,
  name_nl = 'Samenwerking en communicatie',
  description_nl = description,
  description_en = 'WHAT & WHY
• Student communicates effectively with stakeholders (colleagues, client, supervisors)
• Student collaborates constructively in a team

HOW
• Student aligns expectations and keeps stakeholders informed
• Student gives and receives feedback in a professional manner
• Student adapts communication style to the audience

LEVEL OF INDEPENDENCE
• Student takes initiative in communication and collaboration.'
WHERE name = 'Collaboration and communication' AND is_system_default = TRUE;

UPDATE competency_templates SET
  name_en = name,
  name_nl = 'Professionele houding',
  description_nl = description,
  description_en = 'WHAT & WHY
• Student demonstrates a professional work attitude
• Student reflects on own actions and development

HOW
• Student is reliable, punctual and takes responsibility
• Student is open to feedback and adapts behavior accordingly
• Student shows motivation and engagement in the work

LEVEL OF INDEPENDENCE
• Student acts independently and professionally and proactively asks for feedback.'
WHERE name = 'Professional attitude' AND is_system_default = TRUE;


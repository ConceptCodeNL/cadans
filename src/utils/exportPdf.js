import jsPDF from 'jspdf'

function loc(value, locale = 'nl') {
  if (!value) return ''
  if (typeof value === 'string') return value
  return value[locale] || value.nl || value.en || ''
}

function overallGradeLabel(grade, locale) {
  const nl = { bad: 'Onvoldoende', go_but_needs_attention: 'Aandacht nodig', all_good: 'Alles goed' }
  const en = { bad: 'Bad', go_but_needs_attention: 'Needs attention', all_good: 'All good' }
  return (locale === 'nl' ? nl : en)[grade] || ''
}

function scoreLabel(score, locale) {
  const nl = { 1: 'Onvoldoende', 2: 'Aandacht nodig', 3: 'Neutraal', 4: 'Goed', 5: 'Uitstekend' }
  const en = { 1: 'Bad', 2: 'Needs attention', 3: 'Neutral', 4: 'Good', 5: 'Perfect' }
  return (locale === 'nl' ? nl : en)[score] || ''
}

function computeAdvice(competencies, scores, locale) {
  const t = locale === 'nl'
  if (!scores) return { label: '', numericAvg: null, weightedAvg: null }

  let totalWeighted = 0
  let totalWeight = 0

  for (const comp of competencies) {
    const score = scores[comp.id]
    if (score != null) {
      const weight = comp.weight || 1
      totalWeighted += score * weight
      totalWeight += weight
    }
  }

  if (totalWeight === 0) return { label: '', numericAvg: null, weightedAvg: null }

  const avg = totalWeighted / totalWeight
  const rounded = Math.round(avg * 10) / 10

  let label
  if (avg <= 1.5) label = t ? 'Onvoldoende' : 'Bad'
  else if (avg <= 2.5) label = t ? 'Aandacht nodig' : 'Needs attention'
  else if (avg <= 3.5) label = t ? 'Neutraal' : 'Neutral'
  else if (avg < 4.5) label = t ? 'Goed' : 'Good'
  else label = t ? 'Uitstekend' : 'Perfect'

  return { label, numericAvg: rounded, weightedAvg: rounded }
}

function roleLabel(role, locale) {
  const t = locale === 'nl'
  if (role === 'teacher') return t ? 'Docent' : 'Teacher'
  if (role === 'reviewer') return t ? 'Bedrijfsbegeleider' : 'Company Supervisor'
  if (role === 'student') return t ? 'Student' : 'Student'
  return role
}

function meetingTitle(meeting, locale) {
  const t = locale === 'nl'
  if (meeting.is_end_grade) {
    return t ? 'Eindbeoordeling' : 'End Grade'
  }
  const base = t ? 'Gesprek' : 'Meeting'
  return `${base} ${meeting.meeting_number}`
}

function getRoleData(meeting, role) {
  if (role === 'reviewer') {
    return {
      date: meeting.reviewer_meeting_date,
      overallGrade: meeting.reviewer_overall_grade,
      scores: meeting.reviewer_competency_scores || {},
      grades: meeting.reviewer_competency_grades || {},
      notesPerComp: meeting.reviewer_competency_notes || {},
      generalNotes: meeting.reviewer_general_notes || '',
    }
  }
  if (role === 'student') {
    return {
      date: meeting.student_meeting_date,
      overallGrade: meeting.student_overall_grade,
      scores: meeting.student_competency_scores || {},
      grades: {}, // students do not see numeric grades
      notesPerComp: meeting.student_competency_notes || {},
      generalNotes: meeting.student_general_notes || '',
    }
  }
  // teacher
  return {
    date: meeting.meeting_date,
    overallGrade: meeting.overall_grade,
    scores: meeting.competency_scores || {},
    grades: meeting.competency_grades || {},
    notesPerComp: meeting.competency_notes || {},
    generalNotes: meeting.general_notes || '',
  }
}

function addWrappedText(doc, text, x, y, maxWidth, lineHeight, fontSize = 11) {
  if (!text) return y
  doc.setFontSize(fontSize)
  const lines = doc.splitTextToSize(text, maxWidth)
  lines.forEach(line => {
    doc.text(line, x, y)
    y += lineHeight
  })
  return y
}

export function exportSessionToPdf(session, meetings, locale = 'nl') {
  if (!session || !Array.isArray(meetings) || meetings.length === 0) return

  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const marginLeft = 56
  const marginTop = 56
  const contentWidth = 483 // ~ 595 - 2*56
  const lineHeight = 16

  const competencies = session.competencies || []
  const regularMeetings = meetings
    .slice()
    .sort((a, b) => (a.is_end_grade === b.is_end_grade ? a.meeting_number - b.meeting_number : a.is_end_grade ? 1 : -1))

  const roles = ['teacher', 'reviewer', 'student']

  let firstPage = true

  for (const meeting of regularMeetings) {
    const visibleComps = competencies.filter(c => meeting.is_end_grade ? true : !c.endGradeOnly)

    for (const role of roles) {
      if (!firstPage) {
        doc.addPage()
      }
      firstPage = false

      let y = marginTop

      const title = `${meetingTitle(meeting, locale)} — ${roleLabel(role, locale)}`
      doc.setFontSize(18)
      doc.setFont('helvetica', 'bold')
      doc.text(title, marginLeft, y)
      y += 24

      const roleData = getRoleData(meeting, role)

      // Date & overall grade (skip overall grade for end grade, same as inzage)
      doc.setFontSize(11)
      doc.setFont('helvetica', 'normal')
      const dateLabel = locale === 'nl' ? 'Beoordelingsdatum' : 'Assessment Date'
      const overallLabel = locale === 'nl' ? 'Voortgang' : 'Overall Grade'
      const formattedDate = roleData.date ? new Date(roleData.date).toLocaleDateString(locale === 'nl' ? 'nl-NL' : 'en-GB') : '—'

      doc.text(`${dateLabel}: ${formattedDate}`, marginLeft, y)
      y += lineHeight

      if (!meeting.is_end_grade) {
        const overallText = roleData.overallGrade ? overallGradeLabel(roleData.overallGrade, locale) : '—'
        doc.text(`${overallLabel}: ${overallText}`, marginLeft, y)
        y += lineHeight
      }

      // Advice banner equivalent
      const advice = computeAdvice(visibleComps, roleData.scores, locale)
      y += 8
      const adviceLabel = locale === 'nl' ? 'Advies op basis van scores' : 'Advice based on scores'
      const adviceText = advice.numericAvg != null
        ? `${advice.label} (${advice.numericAvg})`
        : locale === 'nl'
          ? 'Nog geen scores ingevuld'
          : 'No scores yet'

      doc.setFont('helvetica', 'bold')
      doc.text(adviceLabel, marginLeft, y)
      doc.setFont('helvetica', 'normal')
      y += lineHeight
      y = addWrappedText(doc, adviceText, marginLeft, y, contentWidth, lineHeight)
      y += lineHeight / 2

      // Competency table (simple text layout)
      const compHeader = locale === 'nl'
        ? ['Competentie', 'Score', meeting.is_end_grade && role !== 'student' ? 'Cijfer' : '', 'Weging']
        : ['Competency', 'Score', meeting.is_end_grade && role !== 'student' ? 'Grade' : '', 'Weight']

      doc.setFont('helvetica', 'bold')
      doc.text(compHeader.filter(Boolean).join('  |  '), marginLeft, y)
      doc.setFont('helvetica', 'normal')
      y += lineHeight

      visibleComps.forEach(comp => {
        if (y > 760) {
          doc.addPage()
          y = marginTop
        }

        const name = loc(comp.name, locale)
        const score = roleData.scores[comp.id]
        const scoreText = score ? `${scoreLabel(score, locale)} (${score}/5)` : '—'
        const grade = meeting.is_end_grade && role !== 'student' ? roleData.grades[comp.id] : null
        const gradeText = grade != null ? String(grade) : ''
        const weightText = comp.weight ? `${comp.weight}x` : '1x'

        const parts = [name, scoreText]
        if (meeting.is_end_grade && role !== 'student') {
          parts.push(gradeText)
        }
        parts.push(weightText)

        y = addWrappedText(doc, parts.join('  |  '), marginLeft, y, contentWidth, lineHeight)
      })

      y += lineHeight

      // Tips & Tops per competency
      const ttTitle = locale === 'nl' ? 'Tips & Tops per competentie' : 'Tips & Tops per competency'
      doc.setFont('helvetica', 'bold')
      doc.text(ttTitle, marginLeft, y)
      doc.setFont('helvetica', 'normal')
      y += lineHeight

      visibleComps.forEach(comp => {
        if (y > 760) {
          doc.addPage()
          y = marginTop
        }

        const compName = loc(comp.name, locale)
        const items = roleData.notesPerComp[comp.id] || []

        doc.setFont('helvetica', 'bold')
        y = addWrappedText(doc, compName, marginLeft, y, contentWidth, lineHeight)
        doc.setFont('helvetica', 'normal')

        if (!items.length) {
          const noText = locale === 'nl'
            ? '(geen tips/tops)'
            : '(no tips/tops)'
          y = addWrappedText(doc, noText, marginLeft + 12, y, contentWidth - 12, lineHeight)
        } else {
          items.forEach(item => {
            if (y > 760) {
              doc.addPage()
              y = marginTop
            }
            const label = item.type === 'tip'
              ? (locale === 'nl' ? 'TIP' : 'TIP')
              : (locale === 'nl' ? 'TOP' : 'TOP')
            const text = `[${label}] ${item.text}`
            y = addWrappedText(doc, text, marginLeft + 12, y, contentWidth - 12, lineHeight)
          })
        }
        y += lineHeight / 2
      })

      // General notes
      if (y > 720) {
        doc.addPage()
        y = marginTop
      }

      const notesLabel = locale === 'nl' ? 'Algemene notities' : 'General notes'
      doc.setFont('helvetica', 'bold')
      doc.text(notesLabel, marginLeft, y)
      doc.setFont('helvetica', 'normal')
      y += lineHeight
      const notesText = roleData.generalNotes || (locale === 'nl' ? '(geen notities)' : '(no notes)')
      addWrappedText(doc, notesText, marginLeft, y, contentWidth, lineHeight)
    }
  }

  const code = session.code || 'export'
  const ref = session.own_reference ? `_${session.own_reference.replace(/[^a-zA-Z0-9]/g, '_')}` : ''
  doc.save(`CADANS_${code}${ref}.pdf`)
}


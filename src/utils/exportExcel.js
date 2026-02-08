import * as XLSX from 'xlsx'

/**
 * Localize a competency name/description object to a string.
 */
function loc(value, locale = 'nl') {
  if (!value) return ''
  if (typeof value === 'string') return value
  return value[locale] || value.nl || value.en || ''
}

function overallGradeLabel(grade, locale) {
  const nl = { bad: 'Onvoldoende', goButNeedsAttention: 'Aandacht nodig', allGood: 'Alles goed' }
  const en = { bad: 'Bad', goButNeedsAttention: 'Needs attention', allGood: 'All good' }
  return (locale === 'nl' ? nl : en)[grade] || ''
}

function scoreLabel(score, locale) {
  const nl = { 1: 'Onvoldoende', 2: 'Aandacht nodig', 3: 'Neutraal', 4: 'Goed', 5: 'Uitstekend' }
  const en = { 1: 'Bad', 2: 'Needs attention', 3: 'Neutral', 4: 'Good', 5: 'Perfect' }
  return (locale === 'nl' ? nl : en)[score] || ''
}

function formatTipsTops(tipsTops) {
  if (!tipsTops || !Array.isArray(tipsTops) || tipsTops.length === 0) return ''
  return tipsTops.map(item => {
    const label = item.type === 'tip' ? 'TIP' : 'TOP'
    return `[${label}] ${item.text}`
  }).join('\n')
}

function fmtDate(dateStr) {
  if (!dateStr) return ''
  try { return new Date(dateStr).toLocaleDateString('nl-NL') } catch { return dateStr }
}

function typeName(type, locale) {
  const nl = { standard_intern: 'Stage', graduation: 'Afstuderen' }
  const en = { standard_intern: 'Internship', graduation: 'Graduation' }
  return (locale === 'nl' ? nl : en)[type] || type || ''
}

function cw(chars) { return { wch: chars } }

/**
 * Export session data as an Excel file for archival.
 */
export function exportSessionToExcel(session, meetings, locale = 'nl') {
  const wb = XLSX.utils.book_new()
  const t = locale === 'nl'
  const competencies = session.competencies || []
  const regularMeetings = meetings.filter(m => !m.is_end_grade).sort((a, b) => a.meeting_number - b.meeting_number)
  const endGradeMeeting = meetings.find(m => m.is_end_grade)

  // ===== Sheet 1: Sessie Gegevens =====
  buildSessionSheet(wb, session, t, locale)

  // ===== Sheet 2+: One sheet per Gesprek =====
  for (const m of regularMeetings) {
    buildMeetingSheet(wb, session, m, competencies, t, locale)
  }

  // ===== Last sheet: Eindbeoordeling =====
  if (endGradeMeeting) {
    buildEndGradeSheet(wb, session, endGradeMeeting, competencies, t, locale)
  }

  const code = session.code || 'export'
  const ref = session.own_reference ? `_${session.own_reference.replace(/[^a-zA-Z0-9]/g, '_')}` : ''
  XLSX.writeFile(wb, `CADANS_${code}${ref}.xlsx`)
}

// ========================================================
// Sheet 1: Sessie Gegevens
// ========================================================
function buildSessionSheet(wb, session, t, locale) {
  const rows = []

  rows.push([t ? 'SESSIE GEGEVENS' : 'SESSION DATA'])
  rows.push([])

  // Session info from DB
  rows.push([t ? 'Sessiecode' : 'Session Code', session.code || ''])
  rows.push([t ? 'Type' : 'Type', typeName(session.type, locale)])
  rows.push([t ? 'Bedrijf' : 'Company', session.company || ''])
  rows.push([t ? 'Eigen Referentie' : 'Own Reference', session.own_reference || ''])
  rows.push([t ? 'Startdatum' : 'Start Date', fmtDate(session.start_date)])
  rows.push([t ? 'Einddatum' : 'End Date', fmtDate(session.end_date)])
  rows.push([t ? 'Status' : 'Status', session.status || ''])
  rows.push([])

  // Blank fields to fill in
  rows.push([t ? 'IN TE VULLEN' : 'TO BE COMPLETED', t ? '(vul de lege velden hieronder in)' : '(fill in the blank fields below)'])
  rows.push([])
  rows.push([t ? 'Naam Student' : 'Student Name', ''])
  rows.push([t ? 'Studentnummer' : 'Student Number', ''])
  rows.push([t ? 'Naam Student 2' : 'Student 2 Name', '', t ? '(indien van toepassing)' : '(if applicable)'])
  rows.push([t ? 'Studentnummer 2' : 'Student 2 Number', ''])
  rows.push([])
  rows.push([t ? 'Titel Opdracht' : 'Assignment Title', ''])
  rows.push([t ? 'Bedrijfsbegeleider' : 'Company Supervisor', ''])
  rows.push([t ? 'Docent-begeleider' : 'Teacher Supervisor', ''])
  rows.push([t ? '2de Docent' : 'Second Teacher', ''])
  rows.push([t ? 'Extern Gecommitteerde' : 'External Committee Member', ''])
  rows.push([])

  // Competencies overview
  rows.push([t ? 'COMPETENTIES' : 'COMPETENCIES'])
  rows.push([t ? 'Naam' : 'Name', t ? 'Weging' : 'Weight', t ? 'Alleen eindbeoordeling' : 'End grade only'])
  const comps = session.competencies || []
  for (const c of comps) {
    rows.push([loc(c.name, locale), c.weight ? `${c.weight}x` : '1x', c.endGradeOnly ? (t ? 'Ja' : 'Yes') : ''])
  }

  const ws = XLSX.utils.aoa_to_sheet(rows)
  ws['!cols'] = [cw(30), cw(35), cw(30)]
  XLSX.utils.book_append_sheet(wb, ws, t ? 'Sessie Gegevens' : 'Session Data')
}

// ========================================================
// Sheet per regular meeting (Gesprek)
// ========================================================
function buildMeetingSheet(wb, session, meeting, competencies, t, locale) {
  const visibleComps = competencies.filter(c => !c.endGradeOnly)
  const rows = []

  const title = `${t ? 'Gesprek' : 'Meeting'} ${meeting.meeting_number}`
  rows.push([title])
  rows.push([])

  // Meeting info
  rows.push([t ? 'Beoordelingsdatum' : 'Assessment Date', fmtDate(meeting.meeting_date)])
  rows.push([t ? 'Status' : 'Status', meeting.status === 'submitted' ? (t ? 'Afgerond' : 'Finalized') : (t ? 'Concept' : 'Draft')])
  rows.push([t ? 'Voortgang' : 'Overall Grade', overallGradeLabel(meeting.overall_grade, locale)])
  rows.push([])

  // Compute advice from scores
  const adviceResult = computeAdvice(visibleComps, meeting.competency_scores, locale)
  rows.push([t ? 'Advies op basis van scores' : 'Advice based on scores', adviceResult.label, adviceResult.numericAvg != null ? `(${adviceResult.numericAvg})` : ''])
  rows.push([])

  // Competency scores table
  rows.push([
    t ? 'COMPETENTIES' : 'COMPETENCIES',
    '',
    '',
  ])
  rows.push([
    t ? 'Competentie' : 'Competency',
    t ? 'Score' : 'Score',
    t ? 'Weging' : 'Weight',
  ])

  for (const comp of visibleComps) {
    const score = meeting.competency_scores && meeting.competency_scores[comp.id]
    rows.push([
      loc(comp.name, locale),
      score ? `${scoreLabel(score, locale)} (${score}/5)` : '',
      comp.weight ? `${comp.weight}x` : '1x',
    ])
  }
  rows.push([])

  // Tips & Tops per competency
  rows.push([t ? 'TIPS & TOPS PER COMPETENTIE' : 'TIPS & TOPS PER COMPETENCY'])
  rows.push([])

  for (const comp of visibleComps) {
    const compName = loc(comp.name, locale)
    const tipsTops = meeting.competency_notes && meeting.competency_notes[comp.id]
    const formatted = formatTipsTops(tipsTops)

    rows.push([compName])

    if (formatted) {
      // Split each tip/top into its own row for readability
      const items = (tipsTops || [])
      for (const item of items) {
        rows.push(['', item.type === 'tip' ? 'TIP' : 'TOP', item.text])
      }
    } else {
      rows.push(['', t ? '(geen tips/tops)' : '(no tips/tops)'])
    }
    rows.push([])
  }

  // General notes
  rows.push([t ? 'ALGEMENE NOTITIES' : 'GENERAL NOTES'])
  rows.push([meeting.general_notes || ''])

  const ws = XLSX.utils.aoa_to_sheet(rows)
  ws['!cols'] = [cw(35), cw(25), cw(50)]
  XLSX.utils.book_append_sheet(wb, ws, title)
}

// ========================================================
// Eindbeoordeling sheet
// ========================================================
function buildEndGradeSheet(wb, session, meeting, competencies, t, locale) {
  const allComps = competencies // show all competencies for end grade
  const rows = []

  rows.push([t ? 'EINDBEOORDELING' : 'END GRADE'])
  rows.push([])

  // Meeting info
  rows.push([t ? 'Beoordelingsdatum' : 'Assessment Date', fmtDate(meeting.meeting_date)])
  rows.push([t ? 'Status' : 'Status', meeting.status === 'submitted' ? (t ? 'Afgerond' : 'Finalized') : (t ? 'Concept' : 'Draft')])
  rows.push([])

  // Blank fields
  rows.push([t ? 'IN TE VULLEN' : 'TO BE COMPLETED'])
  rows.push([t ? 'Bijzondere omstandigheden' : 'Special circumstances', ''])
  rows.push([t ? 'Gemaakte afspraken' : 'Agreements made', ''])
  rows.push([])

  // Competency grades table
  rows.push([t ? 'BEOORDELING PER COMPETENTIE' : 'ASSESSMENT PER COMPETENCY'])
  rows.push([
    t ? 'Competentie' : 'Competency',
    t ? 'Weging' : 'Weight',
    t ? 'Advies Score (1-5)' : 'Advice Score (1-5)',
    t ? 'Cijfer Bedrijfsbegeleider' : 'Company Supervisor Grade',
    t ? 'Cijfer Docent' : 'Teacher Grade',
    t ? 'Eindcijfer' : 'Final Grade',
    t ? 'Tips & Tops' : 'Tips & Tops',
  ])

  for (const comp of allComps) {
    const compName = loc(comp.name, locale)
    const score = meeting.competency_scores && meeting.competency_scores[comp.id]
    const teacherGrade = meeting.competency_grades && meeting.competency_grades[comp.id]
    const reviewerGrade = meeting.reviewer_competency_grades && meeting.reviewer_competency_grades[comp.id]
    const tipsTops = meeting.competency_notes && meeting.competency_notes[comp.id]

    rows.push([
      compName,
      comp.weight ? `${comp.weight}x` : '1x',
      score ? `${scoreLabel(score, locale)} (${score}/5)` : '',
      reviewerGrade != null ? reviewerGrade : '',
      teacherGrade != null ? teacherGrade : '',
      '', // Final grade - to be filled in or defaults to teacher
      formatTipsTops(tipsTops),
    ])
  }

  rows.push([])

  // Averages
  const { weightedAvg: scoreAvg, label: scoreAdviceLabel } = computeAdvice(allComps, meeting.competency_scores, locale)
  const gradeAvg = computeGradeAverage(allComps, meeting.competency_grades)
  const reviewerGradeAvg = computeGradeAverage(allComps, meeting.reviewer_competency_grades)

  rows.push([
    t ? 'GEMIDDELDEN' : 'AVERAGES',
    '',
    scoreAdviceLabel ? `${scoreAdviceLabel} (${scoreAvg || ''})` : '',
    reviewerGradeAvg != null ? reviewerGradeAvg : '',
    gradeAvg != null ? gradeAvg : '',
    '', // Final average - to be filled in
    '',
  ])

  rows.push([])

  // General notes
  rows.push([t ? 'MOTIVATIE EN TOELICHTING' : 'MOTIVATION AND EXPLANATION'])
  rows.push([t
    ? 'Verplicht indien eindoordeel afwijkt van voorlopige beoordeling of bij onvoldoende.'
    : 'Required if final grade deviates from preliminary assessment or is insufficient.'])
  rows.push([meeting.general_notes || ''])
  rows.push([])

  // Signature section
  rows.push([t ? 'ONDERTEKENING' : 'SIGNATURES'])
  rows.push([])
  rows.push([t ? 'Naam' : 'Name', t ? 'Handtekening' : 'Signature', t ? 'Datum' : 'Date'])
  rows.push([t ? 'Student' : 'Student', '', ''])
  rows.push([t ? 'Bedrijfsbegeleider' : 'Company Supervisor', '', ''])
  rows.push([t ? 'Docent-begeleider' : 'Teacher Supervisor', '', ''])
  rows.push([t ? '2de Docent' : 'Second Teacher', '', ''])
  rows.push([t ? 'Extern Gecommitteerde' : 'External Committee Member', '', ''])

  const ws = XLSX.utils.aoa_to_sheet(rows)
  ws['!cols'] = [cw(35), cw(12), cw(25), cw(25), cw(20), cw(15), cw(50)]
  XLSX.utils.book_append_sheet(wb, ws, t ? 'Eindbeoordeling' : 'End Grade')
}

// ========================================================
// Helpers
// ========================================================

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

function computeGradeAverage(competencies, grades) {
  if (!grades) return null

  let total = 0
  let count = 0

  for (const comp of competencies) {
    const grade = grades[comp.id]
    if (grade != null && grade !== '' && !isNaN(grade)) {
      total += Number(grade)
      count++
    }
  }

  if (count === 0) return null
  return Math.round((total / count) * 2) / 2 // Round to nearest 0.5
}

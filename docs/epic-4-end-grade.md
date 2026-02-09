# Epic 4: End Grade

## Overview
Enable teachers and company graders to set final end grades for grading sessions. The end grade consists of two components: company grader advice (optional) and teacher main grade (required), calculated from weighted competency scores across all meetings.

## User Stories

### US-4.1: Set Teacher End Grade
**As a** teacher  
**I want to** set the main end grade for a grading session  
**So that** the student receives their final evaluation

**Acceptance Criteria:**
- Teacher can access end grade form when all meetings are graded
- System calculates weighted average from all meeting competency scores
- Teacher can see:
  - Calculated average per competency
  - Weighted scores (problem solving counts double by default)
  - Overall calculated grade
- Teacher can override calculated grade with manual grade (0-10 scale)
- Teacher can add notes explaining the grade
- Grade is required before session can be completed
- Responsive form for mobile/tablet use
- Auto-save as draft

**Priority:** High

**Grade Calculation:**
1. Average each competency score across all meetings
2. Apply weights (default: problem solving = 2x, others = 1x)
3. Calculate weighted average
4. Display as 0-10 scale (or letter grade if configured)

---

### US-4.2: Set Company Grader Advice
**As a** company grader  
**I want to** provide an advice grade for the end grade  
**So that** the teacher has input for the final evaluation

**Acceptance Criteria:**
- Company grader can access end grade form (if invited)
- Company grader sees same calculated averages as teacher
- Company grader can set advice grade (0-10 scale, optional)
- Company grader can add notes explaining advice
- Advice grade is advisory only (does not affect final grade)
- Teacher can see company grader advice before setting final grade
- Auto-save as draft

**Priority:** High

---

### US-4.3: View End Grade Summary
**As a** teacher, company grader, or second reviewer  
**I want to** view the end grade summary  
**So that** I can see the final evaluation breakdown

**Acceptance Criteria:**
- Summary shows:
  - Final teacher grade (required)
  - Company grader advice (if provided)
  - Competency breakdown with averages and weights
  - Meeting-by-meeting trend
  - Notes from teacher and company grader
- Visual breakdown chart
- Responsive design for mobile viewing
- Export to PDF option

**Priority:** High

---

### US-4.4: Calculate Final Grade Automatically
**As a** teacher  
**I want to** see the automatically calculated grade based on meeting scores  
**So that** I can use it as a reference for my final grade

**Acceptance Criteria:**
- System calculates grade when all meetings are graded
- Calculation shows:
  - Average score per competency
  - Weighted score per competency (with weight indicators)
  - Overall weighted average
- Calculation is transparent (formula visible)
- Teacher can use calculated grade or override
- Recalculation happens automatically when meetings are edited

**Priority:** High

**Calculation Formula:**
```
For each competency:
  averageScore = sum(all meeting scores for competency) / number of meetings
  weightedScore = averageScore × weight

finalGrade = sum(weightedScores) / sum(weights)
```

**Example:**
- Working according a plan: avg 7.5, weight 1.0 → weighted 7.5
- Problem solving: avg 8.0, weight 2.0 → weighted 16.0
- Research: avg 7.0, weight 1.0 → weighted 7.0
- Collaboration: avg 8.5, weight 1.0 → weighted 8.5
- Professional attitude: avg 8.0, weight 1.0 → weighted 8.0
- Total weighted: 47.0
- Total weights: 6.0
- Final grade: 47.0 / 6.0 = 7.83

---

### US-4.5: Finalize End Grade
**As a** teacher  
**I want to** finalize the end grade  
**So that** the grading session is complete

**Acceptance Criteria:**
- Finalize button available when:
  - All meetings are graded
  - Teacher grade is set
- System warns if company grader advice not yet provided (optional)
- Teacher can finalize without company grader advice
- Finalized grade cannot be edited (only view)
- Session status changes to "completed"
- Confirmation dialog before finalizing
- PDF report can be generated after finalization

**Priority:** High

---

### US-4.6: View Competency Breakdown
**As a** teacher or second reviewer  
**I want to** view detailed competency breakdown  
**So that** I can understand how the final grade was calculated

**Acceptance Criteria:**
- Breakdown shows for each competency:
  - All meeting scores
  - Average score
  - Weight
  - Weighted score
  - Trend chart
- Visual indicators for performance levels
- Comparison between competencies
- Export breakdown to PDF

**Priority:** Medium

---

### US-4.7: Edit End Grade (Before Finalization)
**As a** teacher  
**I want to** edit the end grade before finalizing  
**So that** I can adjust if needed

**Acceptance Criteria:**
- Can edit teacher grade before finalization
- Can edit notes
- Can see calculation update in real-time
- Changes saved as draft
- Cannot edit after finalization

**Priority:** Medium

## Technical Considerations

### Grade Scale
- Default: 0-10 numeric scale
- Configurable: Letter grades (A-F) or percentage (0-100)
- Conversion formulas for different scales

### Weight Configuration
- Default weights: Problem solving = 2.0, others = 1.0
- Customizable per grading session
- Weights can be modified even after meetings are graded (recalculates)

### Data Model
- EndGrade entity with:
  - Grading session reference (one-to-one)
  - Teacher grade (required, 0-10)
  - Company grader advice (optional, 0-10)
  - Teacher notes (optional)
  - Company grader notes (optional)
  - Competency breakdown (JSON, calculated)
  - Final calculated grade (computed)
  - Status (draft, partial, completed)
  - Finalization timestamp

### Responsive Design
- Mobile-first end grade form
- Touch-friendly inputs
- Clear visualization of calculations
- Easy-to-read breakdown charts

## Future Enhancements

- Grade history (track changes)
- Grade justification requirements
- Rubric-based grading
- Grade distribution analytics
- Comparison with other students (anonymized)



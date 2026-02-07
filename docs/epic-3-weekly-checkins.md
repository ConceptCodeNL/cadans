# Epic 3: Meeting Grading

## Overview
Enable teachers and company graders to grade individual meetings with overall grade and competency scores. Each meeting is graded with an overall assessment and detailed competency breakdown.

## User Stories

### US-3.1: Grade a Meeting
**As a** teacher or company grader  
**I want to** grade a meeting with overall grade and competency scores  
**So that** I can track student progress throughout the session

**Acceptance Criteria:**
- Select meeting number from list (1, 2, 3, ...)
- Set meeting date (if not pre-scheduled)
- Select overall meeting grade: "Bad", "Go but needs attention", or "All good"
- Grade each competency (score 1-5 or 1-10, based on configuration)
- Add notes per competency (optional)
- Add general notes (optional)
- Form auto-saves as draft every 30 seconds
- Can save as draft and complete later
- Submit button disabled until overall grade and all competencies graded
- Responsive design critical for mobile/tablet grading
- Confirmation message after submission

**Priority:** High

**Overall Meeting Grades:**
- **Bad**: Student did not meet expectations
- **Go but needs attention**: Student is progressing but needs improvement
- **All good**: Student is meeting or exceeding expectations

---

### US-3.2: View Meeting List
**As a** teacher, company grader, or second reviewer  
**I want to** view all meetings for a grading session  
**So that** I can see progress and access individual meetings

**Acceptance Criteria:**
- List shows all meetings (planned and completed)
- Each meeting shows: number, date, overall grade, status (draft/submitted)
- Visual indicators: completed (green), draft (yellow), not started (gray)
- Click to view/edit meeting details
- Progress indicator: X of Y meetings completed
- Sortable by meeting number or date
- Responsive table/list view

**Priority:** High

---

### US-3.3: Edit Meeting Grade
**As a** teacher or company grader  
**I want to** edit a meeting grade  
**So that** I can update scores if needed

**Acceptance Criteria:**
- Can edit draft meetings
- Can edit submitted meetings (with confirmation)
- Changes tracked (optional audit log)
- Cannot delete meetings (only edit)
- Validation ensures all required fields completed

**Priority:** Medium

---

### US-3.4: View Meeting History and Trends
**As a** teacher or second reviewer  
**I want to** view meeting history with trend visualization  
**So that** I can see student progress over time

**Acceptance Criteria:**
- Timeline view of all meetings
- Line chart showing competency scores over time
- Overall grade trend (visual indicators)
- Comparison between meetings
- Filter by competency
- Export meeting history to PDF/CSV
- Responsive charts for mobile viewing

**Priority:** Medium

---

### US-3.5: Meeting Reminders
**As a** teacher  
**I want to** receive reminders for upcoming meetings  
**So that** I don't miss grading deadlines

**Acceptance Criteria:**
- Email reminder 1 day before scheduled meeting date
- In-app notification badge
- Reminder includes: student code, meeting number, date, link
- No reminder if meeting already graded
- Can configure reminder preferences

**Priority:** Low

## Technical Considerations

### Meeting Grading Flow
1. Teacher/company grader selects meeting
2. Sets meeting date (if not pre-scheduled)
3. Selects overall grade (3 options)
4. Grades each competency (dynamic based on session configuration)
5. Adds notes (optional)
6. Saves as draft or submits

### Responsive Design Priority
- **Mobile-first approach**: Grading must work on phones/tablets
- **Touch-friendly inputs**: Large buttons, sliders, easy selection
- **Offline support**: Save drafts locally, sync when online
- **Fast loading**: Optimize for slow connections
- **Large touch targets**: Minimum 44x44px for buttons

### Data Model
- Meeting entity with:
  - Grading session reference
  - Meeting number (sequential)
  - Meeting date
  - Overall grade (enum)
  - Competency scores (JSON, dynamic)
  - Competency notes (JSON, optional)
  - General notes (optional)
  - Graded by (user reference)
  - Status (draft, submitted)
  - Submission timestamp

### UI Components (Vue.js)
- **Overall grade selector**: 3 large buttons (responsive, keyboard accessible)
- **Competency score input**: Numeric input or slider (touch-friendly, keyboard accessible)
- **Weight indicators**: Show which competencies count double (with ARIA labels)
- **Progress indicator**: Visual progress through competencies (with `aria-live` announcement)
- **Auto-save indicator**: Show when draft is saved (with `aria-live="polite"`)
- **Offline indicator**: Show when offline, sync when back online (with `role="status"`)

### Accessibility Requirements
- **Keyboard navigation**: All form inputs and buttons keyboard accessible
- **Screen reader support**: ARIA labels for all interactive elements
- **Focus management**: Clear focus indicators, logical tab order
- **Error announcements**: Form errors announced via `aria-live="polite"`
- **Reduced motion**: Respect `prefers-reduced-motion` for animations
- **Color contrast**: All text and UI elements meet WCAG AA standards
- **Touch targets**: Minimum 44x44px for all interactive elements

### Scoring
- Competency scores: 1-5 or 1-10 scale (configurable)
- Overall grade: Categorical (bad/go but needs attention/all good)
- Weights applied when calculating end grade
- Problem solving counts double by default (configurable)

## Future Enhancements

- Bulk meeting grading (grade multiple meetings at once)
- Meeting templates (pre-fill common scores)
- Voice notes (audio recording per competency)
- Photo attachments (evidence of work)
- Meeting scheduling calendar integration


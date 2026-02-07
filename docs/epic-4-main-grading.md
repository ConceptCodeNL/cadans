# Epic 4: Main Grading Events (3-4 Evaluations)

## Overview
Implement structured milestone evaluations with comprehensive criteria, multi-reviewer support, and aggregation capabilities.

## User Stories

### US-4.1: Schedule Evaluation Milestones
**As an** HR manager  
**I want to** schedule 3-4 main evaluation milestones (e.g., Week 4, Week 8, Week 12, Final)  
**So that** there are structured assessment points

**Acceptance Criteria:**
- HR manager can configure evaluation schedule for organization
- Default: 3-4 milestones based on internship length
- Each milestone has: name, target week/date, description
- Milestones can be customized per internship if needed
- System calculates due dates based on intern start date
- Milestones appear on supervisor and intern dashboards

**Priority:** High

---

### US-4.2: Evaluation Due Notifications
**As a** supervisor  
**I want to** receive a notification when a main grading event is due  
**So that** I don't miss important evaluations

**Acceptance Criteria:**
- Notification sent 7 days before evaluation due date
- Reminder sent 3 days before due date
- Final reminder on due date
- Notification includes: intern name, evaluation type, due date, link
- In-app notification badge
- Supervisor can mark notification as read

**Priority:** High

---

### US-4.3: Complete Main Evaluation
**As a** supervisor  
**I want to** complete a main evaluation using the 5 main grading criteria with 4 Likert questions each  
**So that** I can comprehensively assess the intern

**Acceptance Criteria:**
- Evaluation form displays 5 main criteria sections
- Each criterion has 4 Likert scale questions (1-5)
- Total of 20 questions per evaluation
- All questions are required
- Form auto-saves as draft
- Progress indicator shows completion status
- Can save as draft and return later

**Priority:** High

---

### 5 Main Grading Criteria

1. **Technical Competence**
2. **Communication & Collaboration**
3. **Initiative & Problem-Solving**
4. **Professionalism & Reliability**
5. **Learning & Adaptability**

---

### Questions per Criterion (Likert 1-5)

Each criterion has 4 questions. Example for Technical Competence:

1. "Demonstrates strong understanding of required technical skills"
2. "Applies technical knowledge effectively to tasks"
3. "Seeks help when needed but tries independently first"
4. "Shows growth in technical abilities over time"

**Note:** Questions should be customizable per organization (see Epic 8).

---

### US-4.4: Add Detailed Notes per Criterion
**As a** supervisor  
**I want to** add detailed notes for each of the 5 grading criteria  
**So that** I can provide specific feedback

**Acceptance Criteria:**
- Each criterion section has a notes field
- Notes are optional but recommended
- Character limit: 1000 characters per criterion
- Notes support basic formatting
- Notes are visible to intern and HR manager
- Notes are included in final report

**Priority:** Medium

---

### US-4.5: Invite External Reviewers
**As a** supervisor  
**I want to** invite external reviewers (other team members) to contribute to a main evaluation  
**So that** I get 360-degree feedback

**Acceptance Criteria:**
- Supervisor can invite reviewers via email
- Invitation includes: intern name, evaluation type, deadline, link
- Reviewer doesn't need existing account (can register via link)
- Reviewer is assigned "external_reviewer" role
- Supervisor can see invitation status (pending, accepted, completed)
- Supervisor can resend invitations
- Maximum number of reviewers configurable (default: 3)

**Priority:** Medium

---

### US-4.6: Reviewer Submit Evaluation
**As an** invited reviewer  
**I want to** fill out the same evaluation form (without seeing others' responses)  
**So that** I can provide unbiased input

**Acceptance Criteria:**
- Reviewer receives invitation email with unique link
- Reviewer can access evaluation form without seeing supervisor's responses
- Form is identical to supervisor's form (5 criteria × 4 questions)
- Reviewer can add notes per criterion
- Reviewer can save as draft
- Reviewer can submit evaluation
- Submission deadline is enforced

**Priority:** Medium

---

### US-4.7: View Aggregated Scores
**As a** supervisor  
**I want to** view aggregated scores from all reviewers before finalizing  
**So that** I can make an informed assessment

**Acceptance Criteria:**
- Aggregation view shows:
  - Supervisor's scores
  - Individual reviewer scores (anonymous or named)
  - Average scores across all reviewers
  - Score distribution (min, max, median)
- Visual comparison charts
- Highlight significant discrepancies
- Can view individual reviewer notes
- Can request clarification from reviewers

**Priority:** Medium

---

### US-4.8: Finalize Main Evaluation
**As a** supervisor  
**I want to** finalize/submit a main evaluation  
**So that** the intern receives their official grade

**Acceptance Criteria:**
- Finalize button available after supervisor completes evaluation
- System warns if reviewers haven't submitted yet
- Supervisor can choose to wait for reviewers or finalize without them
- Finalized evaluation cannot be edited (only add notes)
- Intern receives notification when evaluation is finalized
- Evaluation appears on intern dashboard
- Evaluation is included in final report

**Priority:** High

## Technical Considerations

### Evaluation States
- **Draft**: Supervisor/reviewer working on it
- **Pending Review**: Supervisor submitted, waiting for reviewers
- **Review In Progress**: Reviewers submitting
- **Ready to Finalize**: All submissions received
- **Finalized**: Official evaluation complete

### Scoring Aggregation
- Average of all scores (supervisor + reviewers)
- Weighted average (supervisor 50%, reviewers 50%)
- Median score option
- Configurable aggregation method per organization

### Data Model
- MainEvaluation entity with:
  - Intern reference
  - Supervisor reference
  - Milestone type/name
  - Due date
  - Status
  - 5 criteria scores (each with 4 question scores)
  - 5 criteria notes
  - Finalization timestamp

- ExternalReview entity with:
  - MainEvaluation reference
  - Reviewer reference
  - Same structure as MainEvaluation
  - Submission timestamp

## Future Enhancements

- Reviewer anonymity toggle
- Reviewer feedback on supervisor's evaluation
- Evaluation templates
- Historical comparison (how intern improved)


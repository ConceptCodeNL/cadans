# Epic 5: Self-Reflection for Interns

## Overview
Enable interns to assess their own performance through structured self-reflection forms that can be compared with supervisor evaluations.

## User Stories

### US-5.1: Self-Reflection Prompt
**As an** intern  
**I want to** receive a prompt to complete a self-reflection before each main evaluation  
**So that** I can assess myself

**Acceptance Criteria:**
- Intern receives notification 3-5 days before main evaluation due date
- Notification includes link to self-reflection form
- In-app notification badge
- Reminder sent if not completed 1 day before evaluation
- Self-reflection must be completed before supervisor can view it (optional requirement)

**Priority:** High

---

### US-5.2: Complete Self-Reflection Form
**As an** intern  
**I want to** answer self-reflection questions on a separate form  
**So that** I can think critically about my performance

**Acceptance Criteria:**
- Form displays 4 Likert scale questions (1-5)
- Form displays 4 open-text questions
- Likert questions are required
- Open-text questions are required (minimum character count)
- Form auto-saves as draft
- Progress indicator
- Can navigate between questions

**Priority:** High

---

### Self-Reflection Questions

#### Likert Scale Questions (1-5):
1. "I feel confident in my technical abilities for this role"
2. "I have been proactive in seeking learning opportunities"
3. "I communicate effectively with my team"
4. "I have grown professionally during this internship"

#### Open-Text Questions:
1. "What are my biggest achievements this period?"
2. "What challenges did I face and how did I overcome them?"
3. "What do I want to improve next?"
4. "How well did my expectations match reality?"

**Note:** Questions should be customizable per organization (see Epic 8).

---

### US-5.3: Save Self-Reflection as Draft
**As an** intern  
**I want to** save my self-reflection as a draft  
**So that** I can complete it over multiple sessions

**Acceptance Criteria:**
- "Save Draft" button saves progress without submitting
- Auto-save every 30 seconds
- Draft indicator shows on dashboard
- Can resume from where left off
- Draft expiration after evaluation due date (optional)

**Priority:** Medium

---

### US-5.4: Submit Self-Reflection
**As an** intern  
**I want to** submit my self-reflection  
**So that** my supervisor can compare it with their evaluation

**Acceptance Criteria:**
- "Submit" button finalizes self-reflection
- Validation ensures all questions answered
- Confirmation dialog before submission
- Submitted self-reflection cannot be edited
- Supervisor receives notification when submitted
- Self-reflection is linked to corresponding main evaluation

**Priority:** High

---

### US-5.5: View Self-Reflection Comparison
**As a** supervisor  
**I want to** view the intern's self-reflection alongside my evaluation  
**So that** I can identify perception gaps

**Acceptance Criteria:**
- Side-by-side comparison view
- Shows intern's Likert scores vs supervisor's scores
- Visual indicators for:
  - Alignment (scores match)
  - Overconfidence (intern higher)
  - Underconfidence (intern lower)
- Displays intern's open-text responses
- Supervisor can add notes about perception gaps
- Comparison view available after both are submitted

**Priority:** High

## Additional Features

### Perception Gap Analysis
- Automatic calculation of score differences
- Highlight significant gaps (>2 points)
- Summary report of alignment areas
- Use gaps as discussion points in feedback sessions

### Self-Reflection History
- Intern can view all past self-reflections
- Track growth in self-awareness over time
- Compare self-assessment accuracy across evaluations

## Technical Considerations

### Data Model
- SelfReflection entity with:
  - Intern reference
  - MainEvaluation reference (linked)
  - 4 Likert scores (1-5)
  - 4 open-text responses
  - Submission timestamp
  - Status (draft, submitted)

### Comparison Algorithm
- Calculate difference for each Likert question
- Flag differences > 2 points as significant
- Generate alignment score (percentage match)
- Visual heat map of differences

### Timing
- Self-reflection due 2-3 days before main evaluation
- Supervisor can view after both are submitted
- Optional: require self-reflection before supervisor starts evaluation

## Future Enhancements

- Supervisor can provide feedback on self-reflection
- Intern can revise self-reflection after seeing supervisor's evaluation
- Peer comparison (anonymous, aggregated)
- Self-reflection templates for different scenarios


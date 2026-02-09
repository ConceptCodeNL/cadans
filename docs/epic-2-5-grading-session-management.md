# Epic 2.5: Grading Session Management

## Overview
Enable teachers to create and manage grading sessions with configurable dates, meeting counts, and reviewer invitations.

## User Stories

### US-2.5.1: Create Grading Session
**As a** teacher  
**I want to** create a new grading session with start date, end date, and number of meetings  
**So that** I can structure the evaluation period

**Acceptance Criteria:**
- Teacher selects student code (or creates new one)
- Required fields:
  - Start date
  - End date
  - Number of meetings (integer)
- Date validation: end date must be after start date
- System calculates meeting schedule (evenly distributed or custom)
- Teacher can choose competency set (system defaults or custom)
- Session created with "active" status
- Confirmation message displayed

**Priority:** High

**Meeting Schedule:**
- Meetings evenly distributed between start and end date
- Or teacher can specify individual meeting dates
- Meeting numbers: 1, 2, 3, ..., numberOfMeetings

---

### US-2.5.2: Configure Competencies
**As a** teacher  
**I want to** configure competencies for a grading session  
**So that** I can use standard or custom evaluation criteria

**Acceptance Criteria:**
- Option to use system default competencies
- Option to use organization custom competencies
- Option to start clean (create new competency set)
- Can add/remove competencies
- Can set weights for each competency (default: problem solving = 2x, others = 1x)
- Can reorder competencies
- Preview of competency configuration
- Changes apply to this session only

**Priority:** High

**Default Competencies:**
1. Working according a plan (weight: 1.0)
2. Problem solving and building software (weight: 2.0)
3. Research (weight: 1.0)
4. Collaboration and communication (weight: 1.0)
5. Professional attitude (weight: 1.0)

---

### US-2.5.3: Invite Company Grader
**As a** teacher  
**I want to** invite a company grader via email  
**So that** they can provide advice grade and grade meetings

**Acceptance Criteria:**
- Teacher enters email address
- System sends invitation email with unique token
- Invitation includes: student code, session dates, link to accept
- Company grader can register/login via invitation link
- Company grader gets access to grade meetings and provide advice grade
- Teacher can see invitation status (pending, accepted, expired)
- Teacher can resend invitation
- Maximum one company grader per session

**Priority:** High

---

### US-2.5.4: Invite Second Reviewer
**As a** teacher  
**I want to** invite a second reviewer via email  
**So that** they can view the grading session (read-only)

**Acceptance Criteria:**
- Teacher enters email address
- System sends invitation email with unique token
- Invitation includes: student code, session dates, link to accept
- Second reviewer can register/login via invitation link
- Second reviewer gets read-only access to all session data
- Cannot grade meetings or set end grade
- Teacher can see invitation status
- Teacher can resend invitation
- Multiple second reviewers allowed

**Priority:** Medium

---

### US-2.5.5: View Grading Session Details
**As a** teacher  
**I want to** view grading session details  
**So that** I can track progress and manage the session

**Acceptance Criteria:**
- Session overview shows:
  - Student code
  - Start/end dates
  - Number of meetings (planned vs completed)
  - Competencies and weights
  - Invited reviewers and their status
  - Overall progress
- List of all meetings with status
- End grade status
- Quick actions: grade meeting, set end grade, invite reviewers

**Priority:** High

---

### US-2.5.6: Edit Grading Session
**As a** teacher  
**I want to** edit grading session details  
**So that** I can adjust dates or meeting count if needed

**Acceptance Criteria:**
- Can edit start/end dates (if no meetings graded yet)
- Can add meetings (if session not completed)
- Cannot reduce meeting count below already graded meetings
- Can update competencies (if no meetings graded yet)
- Can update weights (always allowed)
- Changes require confirmation
- System validates changes don't conflict with existing data

**Priority:** Medium

---

### US-2.5.7: Complete/Archive Grading Session
**As a** teacher  
**I want to** mark a grading session as completed  
**So that** I can finalize the evaluation

**Acceptance Criteria:**
- Session can be marked complete when:
  - All meetings are graded
  - End grade is set (teacher grade required)
- Completed sessions are archived
- Archived sessions retain all data
- Can view archived sessions
- Cannot edit completed sessions (read-only)

**Priority:** High

## Technical Notes

### Session States
- **active**: Session in progress, meetings being graded
- **completed**: All meetings graded, end grade set
- **archived**: Session archived for historical reference

### Access Control
- **Teacher**: Full access (create, edit, grade, invite)
- **Company Grader**: Grade meetings, set advice grade (if invited)
- **Second Reviewer**: Read-only access (if invited)
- **Admin**: Full access to all sessions

### Invitation Flow
1. Teacher sends invitation
2. Email sent with unique token
3. User clicks link
4. If new user: Register via Supabase Auth
5. If existing user: Login
6. Token validated, access granted
7. User linked to grading session

## Future Enhancements

- Duplicate session (copy configuration)
- Session templates
- Bulk session creation
- Session analytics dashboard



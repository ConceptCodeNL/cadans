# Epic 2: Intern Management

## Overview
Enable HR managers and supervisors to create, assign, and manage intern profiles throughout their internship lifecycle.

## User Stories

### US-2.1: Create Intern Profile
**As an** HR manager  
**I want to** create a new intern profile with name, email, department, start/end dates  
**So that** I can track their progress

**Acceptance Criteria:**
- HR manager can access "Add Intern" form
- Required fields: name, email, department, start date, end date
- Optional fields: phone number, employee ID, notes
- Email validation ensures unique email per organization
- Date validation ensures end date is after start date
- Intern profile is created with "active" status
- Confirmation message displayed upon successful creation

**Priority:** High

---

### US-2.2: Assign Primary Supervisor
**As an** HR manager  
**I want to** assign a primary supervisor to an intern  
**So that** someone is responsible for their evaluation

**Acceptance Criteria:**
- HR manager can select supervisor from list of organization supervisors
- Assignment can be done during intern creation or later
- Only one primary supervisor per intern at a time
- Supervisor receives notification when assigned
- Supervisor can be reassigned if needed
- Assignment history is tracked

**Priority:** High

---

### US-2.3: View Active Interns List
**As an** HR manager  
**I want to** view a list of all active interns  
**So that** I can monitor the program overview

**Acceptance Criteria:**
- List displays: name, email, department, supervisor, start date, end date, status
- List is sortable by any column
- List is filterable by department, supervisor, status
- Search functionality by name or email
- Pagination for large lists
- Quick actions: view details, edit, archive

**Priority:** High

---

### US-2.4: Archive Completed Internships
**As an** HR manager  
**I want to** archive completed internships  
**So that** the dashboard stays clean

**Acceptance Criteria:**
- HR manager can archive interns whose end date has passed
- Archived interns are moved to separate view
- Archived interns retain all evaluation data
- Archived interns can be unarchived if needed
- Archive action requires confirmation
- Option to bulk archive multiple interns

**Priority:** Medium

---

### US-2.5: View Assigned Interns
**As a** supervisor  
**I want to** view my assigned interns  
**So that** I know who I need to evaluate

**Acceptance Criteria:**
- Supervisor dashboard shows list of assigned interns
- List shows: name, department, days remaining, next evaluation due
- Visual indicators for overdue evaluations
- Quick access to intern profile and evaluations
- Filter by active/completed status

**Priority:** High

## Additional Considerations

### Intern Profile Details
- Profile page should show:
  - Personal information
  - Internship timeline
  - Evaluation history summary
  - Upcoming deadlines
  - Performance trends

### Bulk Operations
- Import interns via CSV
- Bulk assignment of supervisors
- Bulk invitation sending

## Technical Notes

- Intern status: active, completed, archived, terminated
- Soft delete for interns (preserve data)
- Audit log for profile changes
- Consider adding profile photo upload


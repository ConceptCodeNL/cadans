# Epic 2: Student Management

## Overview
Enable teachers to create and manage student codes with minimal personal data. Students are identified only by unique 6-character codes for privacy.

## User Stories

### US-2.1: Generate Student Code
**As a** teacher  
**I want to** generate a unique 6-character code for a student  
**So that** I can create a grading session without storing personal data

**Acceptance Criteria:**
- Teacher can generate a new student code
- Code is exactly 6 characters (alphanumeric)
- Code is automatically generated and guaranteed unique
- Code can be manually entered if teacher prefers
- System validates code format (6 alphanumeric characters)
- Code is displayed clearly for teacher to share with student
- Option to copy code to clipboard

**Priority:** High

**Code Generation:**
- Format: 6 alphanumeric characters (A-Z, 0-9)
- Example: "A3B9X2", "K7M4P1"
- No personal information (name, email, etc.) stored

---

### US-2.2: View Student List
**As a** teacher  
**I want to** view a list of all students I've created  
**So that** I can manage my grading sessions

**Acceptance Criteria:**
- List displays: student code, creation date, active grading sessions count
- List is sortable by creation date
- Search functionality by student code
- Filter by students with active/completed sessions
- Quick actions: create grading session, view sessions, archive

**Priority:** High

---

### US-2.3: Archive Student
**As a** teacher  
**I want to** archive a student  
**So that** my active list stays clean

**Acceptance Criteria:**
- Teacher can archive students
- Archived students retain all grading data
- Archived students moved to separate view
- Can unarchive if needed
- Archive action requires confirmation

**Priority:** Medium

## Privacy Considerations

### Data Minimization
- **NO personal data stored**: No names, emails, phone numbers, addresses
- **Only student code**: 6-character unique identifier
- **Optional metadata**: Creation date, status (active/archived)
- **Grading data**: Linked only to code, not personal information

### GDPR Compliance
- Minimal data collection
- Easy data deletion (delete student = delete all associated data)
- No personal identifiers in reports
- Student codes can be rotated/changed if needed

## Technical Notes

- Student code generation: Use secure random generator
- Code uniqueness: Database constraint ensures uniqueness
- Code format validation: Regex pattern `^[A-Z0-9]{6}$`
- Soft delete: Archive instead of hard delete (preserve data)
- Code sharing: Teacher shares code with student (offline, secure channel)

## Future Enhancements

- Bulk code generation
- Code expiration (optional)
- Code regeneration (if compromised)
- QR code generation for easy sharing



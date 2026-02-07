# Requirements Overview

## Project Purpose

CADANS is a student grading platform that enables teachers, company graders, and reviewers to track and evaluate student performance through structured meeting-based grading, competency assessment, and end grade calculation. Built with privacy in mind - students are identified only by unique 6-character codes with no personal data stored.

## Key Stakeholders

- **Teachers**: Create grading sessions, grade meetings, set final end grades
- **Company Graders**: Provide advice grades and grade meetings (if invited)
- **Second Reviewers**: View grading sessions with read-only access (if invited)
- **Admins**: Configure competencies, settings, and organization preferences

## Core Features

1. **Privacy-First Design** - Students identified only by unique 6-character codes, no personal data stored
2. **Role-based Access Control** - Different permissions for teachers, company graders, reviewers, and admins
3. **Grading Session Management** - Create sessions with start/end dates and number of meetings
4. **Meeting-Based Grading** - Grade each meeting with overall assessment and competency scores
5. **Competency Framework** - 5 default competencies (customizable), with weighted scoring
6. **End Grade System** - Teacher main grade + company grader advice, calculated from weighted competencies
7. **Responsive Mobile Design** - Optimized for grading on tablets and phones
8. **Reviewer Invitations** - Invite company graders and second reviewers via email
9. **Customizable Competencies** - Use system defaults, organization custom, or start clean
10. **Reporting & Export** - PDF reports with competency breakdowns and trends

## Evaluation Structure

### Grading Sessions
- Start date, end date, number of meetings
- Competency configuration (system defaults or custom)
- Invite company grader (can grade meetings and provide advice)
- Invite second reviewer (read-only access)

### Meeting Grading
- Overall grade: "Bad", "Go but needs attention", or "All good"
- Competency scores (1-5 or 1-10 scale, configurable)
- Notes per competency (optional)
- General notes (optional)
- Responsive mobile-first interface

### End Grade
- Calculated from weighted average of all meeting competency scores
- Teacher grade (required, 0-10 scale)
- Company grader advice (optional, 0-10 scale)
- Competency breakdown with weights
- Problem solving counts double by default (configurable)

## Default Competencies

1. **Working according a plan** (weight: 1.0)
2. **Problem solving and building software** (weight: 2.0)
3. **Research** (weight: 1.0)
4. **Collaboration and communication** (weight: 1.0)
5. **Professional attitude** (weight: 1.0)

## Success Metrics

- Completion rate of evaluations
- Timeliness of submissions
- User satisfaction scores
- Program effectiveness tracking


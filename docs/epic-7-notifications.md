# Epic 7: Notifications & Reminders

## Overview
Implement automated email and in-app notification system to ensure timely completion of evaluations and keep all stakeholders informed.

## User Stories

### US-7.1: Supervisor Deadline Notifications
**As a** supervisor  
**I want to** receive email notifications for upcoming deadlines  
**So that** evaluations are completed on time

**Acceptance Criteria:**
- Email sent 7 days before evaluation deadline
- Reminder sent 3 days before deadline
- Final reminder on deadline day
- Overdue notification if not completed after deadline
- Email includes:
  - Intern name
  - Evaluation type and due date
  - Direct link to evaluation form
  - Days remaining
- Supervisor can configure notification preferences
- Unsubscribe option (but critical reminders still sent)

**Priority:** High

**Notification Schedule:**
- **7 days before**: Initial reminder
- **3 days before**: Second reminder
- **1 day before**: Final reminder
- **On due date**: Due today notification
- **1 day after**: Overdue notification
- **3 days after**: Escalation to HR manager

---

### US-7.2: Intern Evaluation Available Notification
**As an** intern  
**I want to** receive a notification when a new evaluation is available  
**So that** I can review feedback promptly

**Acceptance Criteria:**
- Email notification when supervisor finalizes main evaluation
- Email notification when weekly check-in is completed
- Notification includes:
  - Evaluation type
  - Supervisor name
  - Link to view evaluation
  - Summary of scores (optional)
- In-app notification badge
- Notification preferences (email, in-app, both)

**Priority:** Medium

---

### US-7.3: Reminder to Pending Reviewers
**As an** HR manager  
**I want to** send reminder emails to pending reviewers  
**So that** I can ensure completion rates

**Acceptance Criteria:**
- HR manager can see list of pending reviewer invitations
- Bulk reminder action available
- Automatic reminders sent:
  - 3 days after invitation
  - 1 day before deadline
  - On deadline day
- Reminder includes original invitation details
- Track reminder history

**Priority:** Medium

## Additional Notification Types

### Weekly Check-in Reminders
- **Supervisor**: Weekly reminder to complete check-ins
- **Intern**: Notification when check-in is completed

### Self-Reflection Reminders
- **Intern**: 5 days before main evaluation
- **Intern**: 2 days before main evaluation
- **Intern**: 1 day before main evaluation

### System Notifications
- **All users**: Account created, password reset
- **Supervisor**: New intern assigned
- **Intern**: Invitation to join platform
- **HR Manager**: Evaluation completion reports
- **HR Manager**: Low completion rate alerts

### Invitation Notifications
- **Supervisor**: Invitation to join organization
- **Intern**: Invitation to join platform
- **Reviewer**: Invitation to review evaluation

## Technical Considerations

### Email Service
- Use transactional email service (SendGrid, AWS SES, Mailgun, etc.)
- Email templates with branding
- HTML and plain text versions
- Unsubscribe handling
- Bounce/complaint handling

### Notification Preferences
- User settings for:
  - Email frequency (immediate, daily digest, weekly digest)
  - Notification types (which events to notify)
  - Quiet hours (no notifications during certain times)
  - Channel preference (email, in-app, SMS - future)

### In-App Notifications
- Real-time notification center
- Unread count badge
- Mark as read/unread
- Notification history
- Filter by type

### Notification Queue
- Background job processing
- Retry logic for failed sends
- Rate limiting
- Batch processing for efficiency

### Notification Templates
- Template system for all notification types
- Organization branding
- Personalization variables
- Multi-language support (future)

## Data Model

### Notification Entity
- User reference
- Type (email, in-app, SMS)
- Category (reminder, alert, update)
- Title
- Message
- Link/action
- Status (sent, read, failed)
- Timestamp
- Metadata (JSON)

### NotificationPreferences Entity
- User reference
- Email enabled
- In-app enabled
- Frequency settings
- Quiet hours
- Category preferences

## Future Enhancements

- SMS notifications
- Push notifications (mobile app)
- Slack/Teams integration
- Custom notification rules
- Notification analytics (open rates, click rates)
- A/B testing for notification content


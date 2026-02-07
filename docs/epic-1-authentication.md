# Epic 1: Authentication & User Management

## Overview
Establish secure authentication and user management system with role-based access control and invitation workflows.

## User Stories

### US-1.1: Organization Account Creation
**As an** HR manager  
**I want to** create an organization account  
**So that** I can manage multiple internship programs

**Acceptance Criteria:**
- HR manager can register with email, password, and organization name
- Organization is created with unique identifier
- HR manager is assigned admin role for the organization
- Email verification is required before account activation

**Priority:** High

---

### US-1.2: Invite Mentors/Supervisors
**As an** HR manager  
**I want to** invite mentors/supervisors via email  
**So that** they can grade interns

**Acceptance Criteria:**
- HR manager can send invitation emails to supervisors
- Invitation contains unique token and link
- Invitation expires after configurable time (e.g., 7 days)
- Invitation email includes organization name and instructions
- HR manager can view pending invitations and resend if needed

**Priority:** High

---

### US-1.3: Accept Invitation and Create Account
**As a** supervisor/mentor  
**I want to** accept an invitation and create my account  
**So that** I can start grading interns

**Acceptance Criteria:**
- Supervisor can click invitation link to access registration form
- Registration form pre-fills email from invitation
- Supervisor can set password and complete profile
- Account is automatically linked to the organization
- Supervisor role is assigned upon account creation
- Supervisor is redirected to dashboard after registration

**Priority:** High

---

### US-1.4: Intern Invitation Link
**As an** intern  
**I want to** receive an invitation link to join the platform  
**So that** I can access my dashboard

**Acceptance Criteria:**
- HR manager or supervisor can generate invitation link for intern
- Invitation link can be sent via email or shared directly
- Intern can register using the invitation link
- Intern profile is automatically linked to their internship record
- Intern role is assigned upon account creation

**Priority:** High

---

### US-1.5: Secure Login
**As any** user  
**I want to** log in securely  
**So that** my data remains protected

**Acceptance Criteria:**
- Users can log in with email and password
- Passwords are hashed using industry-standard encryption (bcrypt/argon2)
- Session management with secure tokens (JWT or session-based)
- Support for "Remember Me" functionality
- Rate limiting on login attempts to prevent brute force
- Account lockout after multiple failed attempts
- HTTPS enforced for all authentication endpoints

**Priority:** Critical

---

### US-1.6: Password Reset
**As any** user  
**I want to** reset my password via email  
**So that** I can regain access if forgotten

**Acceptance Criteria:**
- Users can request password reset from login page
- Reset link is sent to registered email address
- Reset link contains secure, time-limited token
- Token expires after 1 hour
- Users can set new password via reset link
- Old password cannot be reused
- Confirmation email sent after successful reset

**Priority:** High

## Technical Notes (Supabase)

- **Authentication**: Supabase Auth handles all authentication
  - Email/password authentication
  - Magic links (passwordless)
  - OAuth providers (Google, GitHub, etc.)
  - JWT tokens with automatic refresh
- **User Profiles**: Additional profile table stores role and organization
- **Invitations**: Invitation tokens stored in database, validated via Supabase Edge Functions
- **Email**: Supabase Edge Functions + email service (SendGrid, Resend, etc.)
- **Security**: Row Level Security (RLS) policies enforce access control
- **Rate Limiting**: Handled by Supabase

## Dependencies

- Supabase Auth
- Supabase Edge Functions (for email)
- Email service (SendGrid, Resend, or similar)
- Secure token generation (Supabase handles)


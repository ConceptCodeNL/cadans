# Technical Specifications

## Technology Stack

### Backend & Database
- **Platform**: Supabase (PostgreSQL database + Backend-as-a-Service)
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth (email/password, OAuth, magic links)
- **Real-time**: Supabase Realtime subscriptions
- **Storage**: Supabase Storage (for documents, if needed)
- **Email**: Brevo (formerly Sendinblue) - transactional emails via Supabase Edge Functions
- **PDF Generation**: Client-side with print CSS (no server-side generation needed)

### Frontend
- **Framework**: Vue.js 3 (Composition API)
- **UI Library**: shadcn-vue (Vue port of shadcn/ui) + Tailwind CSS
- **Typography**: 
  - **Headings**: Anton (Google Fonts)
  - **Body Text**: Manrope (Google Fonts)
- **Theming**: Light and dark theme support with CSS variables
- **Charts**: Chart.js (vue-chartjs) or ApexCharts (vue3-apexcharts)
- **State Management**: Pinia (Vue 3 state management)
- **Forms**: VeeValidate
- **HTTP Client**: Supabase JS Client
- **Routing**: Vue Router
- **Animations**: Vue transitions + CSS animations for microinteractions
- **Internationalization**: Vue I18n (English and Dutch)

### Infrastructure
- **Hosting**: Vercel (frontend)
- **Database/Backend**: Supabase Cloud
- **Version Control**: GitHub
- **CI/CD**: GitHub Actions + Vercel automatic deployments
- **Monitoring**: None (as per requirements)
- **Analytics**: None (as per requirements)

## Data Models

### Organization
```typescript
{
  id: UUID
  name: string
  domain?: string
  logo?: string
  settings: JSON (OrganizationSettings)
  createdAt: timestamp
  updatedAt: timestamp
}
```

### User (Supabase Auth + Profile)
```typescript
// Supabase Auth handles: id, email, password, emailVerified
// Additional profile table:
{
  id: UUID (FK -> auth.users)
  firstName?: string
  lastName?: string
  role: enum ['teacher', 'company_grader', 'second_reviewer', 'admin']
  organizationId?: UUID (FK)
  createdAt: timestamp
  updatedAt: timestamp
}
```

**Note**: Minimal personal data stored. Students are identified by unique codes only.

### Student
```typescript
{
  id: UUID
  code: string (unique, 6 characters, alphanumeric)
  // NO personal data stored (name, email, etc.)
  createdAt: timestamp
  updatedAt: timestamp
}
```

### GradingSession
```typescript
{
  id: UUID
  studentCode: string (FK -> Student.code)
  teacherId: UUID (FK -> User, role='teacher')
  companyGraderId?: UUID (FK -> User, role='company_grader')
  secondReviewerId?: UUID (FK -> User, role='second_reviewer', read-only)
  startDate: date
  endDate: date
  numberOfMeetings: integer
  status: enum ['active', 'completed', 'archived']
  
  // Competency configuration for this session
  competencies: JSON [{
    id: string,
    name: string,
    weight: number (default 1.0, problem solving default 2.0)
  }]
  
  // End grade components
  endGradeCompanyAdvice?: number (0-10 or letter grade)
  endGradeTeacher?: number (0-10 or letter grade)
  endGradeFinal?: number (calculated)
  
  createdAt: timestamp
  updatedAt: timestamp
}
```

### Meeting
```typescript
{
  id: UUID
  gradingSessionId: UUID (FK)
  meetingNumber: integer (1, 2, 3, ...)
  meetingDate: date
  
  // Overall meeting grade
  overallGrade: enum ['bad', 'go_but_needs_attention', 'all_good']
  
  // Competency scores (dynamic based on session competencies)
  competencyScores: JSON {
    [competencyId: string]: number // Score 1-5 or 1-10
  }
  
  // Notes per competency
  competencyNotes: JSON {
    [competencyId: string]?: string
  }
  
  // General notes
  generalNotes?: string
  
  gradedBy: UUID (FK -> User, teacher or company_grader)
  status: enum ['draft', 'submitted']
  submittedAt?: timestamp
  createdAt: timestamp
  updatedAt: timestamp
}
```

### CompetencyTemplate
```typescript
{
  id: UUID
  organizationId?: UUID (FK, null for system defaults)
  name: string
  description?: string
  defaultWeight: number (default 1.0)
  isSystemDefault: boolean
  order: integer
  createdAt: timestamp
  updatedAt: timestamp
}
```

**Default Competencies (System):**
1. Working according a plan (weight: 1.0)
2. Problem solving and building software (weight: 2.0)
3. Research (weight: 1.0)
4. Collaboration and communication (weight: 1.0)
5. Professional attitude (weight: 1.0)

### EndGrade
```typescript
{
  id: UUID
  gradingSessionId: UUID (FK, unique)
  
  // Company grader advice (optional)
  companyGraderAdvice?: number (0-10 scale)
  companyGraderNotes?: string
  companyGraderSubmittedAt?: timestamp
  
  // Teacher main grade
  teacherGrade: number (0-10 scale, required)
  teacherNotes?: string
  teacherSubmittedAt: timestamp
  
  // Calculated final grade (weighted average of competencies from all meetings)
  finalGrade?: number (calculated)
  
  // Competency breakdown for final grade
  competencyFinalScores: JSON {
    [competencyId: string]: {
      averageScore: number,
      weightedScore: number,
      weight: number
    }
  }
  
  status: enum ['draft', 'partial', 'completed']
  finalizedAt?: timestamp
  createdAt: timestamp
  updatedAt: timestamp
}
```

### Invitation
```typescript
{
  id: UUID
  gradingSessionId: UUID (FK)
  email: string
  role: enum ['company_grader', 'second_reviewer']
  token: string (unique)
  invitedBy: UUID (FK -> User)
  status: enum ['pending', 'accepted', 'expired']
  expiresAt: timestamp
  acceptedAt?: timestamp
  createdAt: timestamp
}
```

**Note**: Self-reflection feature removed per new requirements. Focus is on meeting-based grading and end grade.

### Notification
```typescript
{
  id: UUID
  userId: UUID (FK)
  type: enum ['email', 'in_app', 'sms']
  category: enum ['reminder', 'alert', 'update', 'invitation']
  title: string
  message: string
  link?: string
  status: enum ['pending', 'sent', 'read', 'failed']
  metadata: JSON
  sentAt?: timestamp
  readAt?: timestamp
  createdAt: timestamp
}
```

### Invitation
```typescript
{
  id: UUID
  organizationId: UUID (FK)
  email: string
  role: enum ['supervisor', 'intern', 'external_reviewer']
  token: string (unique)
  invitedBy: UUID (FK -> User)
  status: enum ['pending', 'accepted', 'expired']
  expiresAt: timestamp
  acceptedAt?: timestamp
  createdAt: timestamp
}
```

### OrganizationSettings
```typescript
{
  id: UUID
  organizationId: UUID (FK, unique)
  
  // Custom competencies (can add/remove/modify)
  customCompetencies: JSON [{
    id: string,
    name: string,
    defaultWeight: number
  }]
  
  // Use system defaults or custom
  useSystemCompetencies: boolean (default: true)
  
  // Grade scale configuration
  gradeScale: enum ['numeric_0_10', 'letter', 'percentage']
  
  // Meeting overall grade labels
  meetingGradeLabels: JSON {
    bad: string (default: "Bad"),
    go_but_needs_attention: string (default: "Go but needs attention"),
    all_good: string (default: "All good")
  }
  
  // Branding
  branding: JSON {
    logo?: string,
    primaryColor: string,
    secondaryColor: string
  }
  
  updatedAt: timestamp
}
```

## Key Features Implementation

### Role-Based Access Control (RBAC)

**Roles:**
- **teacher**: Main grader, creates grading sessions, grades meetings, sets final grade
- **company_grader**: Provides advice grade, can grade meetings
- **second_reviewer**: Read-only access to grading session
- **admin**: Full access to organization settings

**Permissions Matrix:**
| Action | Teacher | Company Grader | Second Reviewer | Admin |
|--------|---------|----------------|-----------------|-------|
| Create student code | ✅ | ❌ | ❌ | ✅ |
| Create grading session | ✅ | ❌ | ❌ | ✅ |
| Grade meetings | ✅ | ✅ (if invited) | ❌ | ❌ |
| Set end grade (teacher) | ✅ | ❌ | ❌ | ❌ |
| Set end grade (company advice) | ❌ | ✅ (if invited) | ❌ | ❌ |
| View grading session | ✅ | ✅ (if invited) | ✅ (if invited, read-only) | ✅ |
| Invite reviewers | ✅ | ❌ | ❌ | ✅ |
| Configure competencies | ❌ | ❌ | ❌ | ✅ |
| Export reports | ✅ | ✅ (own sessions) | ❌ | ✅ |

### Email Invitation System (Supabase + Brevo)

**Flow:**
1. Teacher/Admin generates invitation for company grader or second reviewer
2. System creates Invitation record with unique token
3. Email sent via Supabase Edge Function + Brevo API
4. User clicks link, token validated
5. If new user: Completes registration via Supabase Auth
6. If existing user: Links to grading session
7. Invitation marked as accepted
8. User gets appropriate access (read-only for second reviewer)

**Email Service (Brevo):**
- Transactional emails via Brevo API
- Email templates in Brevo dashboard
- Multilingual email templates (English/Dutch)
- Supabase Edge Function calls Brevo API
- Brevo API key stored in Supabase secrets

**Security:**
- Tokens expire after 7 days (configurable)
- One-time use tokens
- Supabase RLS (Row Level Security) enforces access
- Email verification via Supabase Auth

### Grading UI Components (Vue.js + shadcn-vue)

**Design Principles:**
- **Large buttons**: Minimum 48px height, generous padding (16px-20px)
- **Rounded corners**: Border radius 12px-16px for cards, 8px-12px for buttons
- **Microanimations**: Smooth transitions on all interactions
- **Question transitions**: New questions slide in smoothly (slide-left animation, 300ms ease-in-out)
- **Touch-friendly**: All interactive elements minimum 44x44px
- **Visual feedback**: Hover states, active states, loading states with smooth transitions
- **User-friendly**: Clear visual hierarchy, large touch targets, intuitive navigation

**Animation Specifications:**
- **Question slide-in**: `transform: translateX(-20px) → translateX(0)`, opacity fade
- **Button interactions**: Scale down on click (0.95), smooth bounce back
- **Form transitions**: Smooth height transitions for expanding sections
- **Loading states**: Skeleton loaders with pulse animation
- **Success feedback**: Checkmark animation, color transitions
- **Error states**: Shake animation, color transitions to red
- **Respect prefers-reduced-motion**: Disable or reduce animations for users who prefer reduced motion

### Accessibility (WCAG 2.1 AA Compliance)

**Standards:**
- **WCAG 2.1 Level AA** compliance required
- All interactive elements must be keyboard accessible
- Screen reader support for all content
- Sufficient color contrast ratios
- Focus management and visible focus indicators

**Keyboard Navigation:**
- **Tab order**: Logical, sequential tab order through all interactive elements
- **Focus indicators**: Clear, visible focus outlines (2px solid, high contrast)
- **Keyboard shortcuts**: 
  - `Tab` / `Shift+Tab`: Navigate forward/backward
  - `Enter` / `Space`: Activate buttons and links
  - `Escape`: Close modals, dismiss notifications
  - `Arrow keys`: Navigate within components (radio groups, dropdowns)
- **Skip links**: Skip to main content link at top of page
- **Focus trap**: Modals and dialogs trap focus within them
- **Focus restoration**: Return focus to trigger element when closing modals

**Screen Reader Support:**
- **Semantic HTML**: Use proper HTML5 semantic elements (`<nav>`, `<main>`, `<article>`, `<button>`, etc.)
- **ARIA labels**: Descriptive labels for all interactive elements
- **ARIA roles**: Proper roles for custom components
- **ARIA states**: `aria-expanded`, `aria-selected`, `aria-checked`, `aria-disabled`
- **ARIA live regions**: Announce dynamic content changes (form errors, success messages)
- **Alt text**: Descriptive alt text for all images and icons
- **Form labels**: All form inputs have associated `<label>` elements
- **Error announcements**: Form errors announced immediately via `aria-live="polite"`

**Color and Contrast:**
- **Text contrast**: Minimum 4.5:1 for normal text, 3:1 for large text (18pt+)
- **UI components**: Minimum 3:1 contrast for interactive elements
- **Color not sole indicator**: Don't rely solely on color to convey information
- **Focus indicators**: High contrast (at least 3:1 against background)
- **Error states**: Use both color and text/icons to indicate errors

**Visual Accessibility:**
- **Text scaling**: Support up to 200% zoom without horizontal scrolling
- **Responsive design**: Works on all screen sizes
- **Font size**: Minimum 16px for body text (or user-adjustable)
- **Line height**: Minimum 1.5 for readability
- **Spacing**: Adequate spacing between interactive elements (minimum 8px)

**Animation and Motion:**
- **Respect prefers-reduced-motion**: 
  - Check `@media (prefers-reduced-motion: reduce)`
  - Disable or significantly reduce animations for users who prefer reduced motion
  - Still maintain functional transitions (e.g., fade instead of slide)
- **Animation duration**: Keep animations under 5 seconds
- **No flashing content**: No content that flashes more than 3 times per second

**Form Accessibility:**
- **Labels**: All inputs have visible, associated labels
- **Error messages**: Clear, specific error messages near the relevant field
- **Required fields**: Indicated with `aria-required="true"` and visual indicator (asterisk)
- **Field descriptions**: Use `aria-describedby` for help text and error messages
- **Validation**: Real-time validation with clear error announcements
- **Success states**: Confirm successful form submission

**Component Accessibility:**
- **Buttons**: Use `<button>` element, not `<div>` or `<span>`
- **Links**: Use `<a>` with proper `href` attributes
- **Modals**: Proper `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
- **Dropdowns**: Proper ARIA combobox or listbox patterns
- **Radio groups**: Use `<fieldset>` and `<legend>` for grouping
- **Checkboxes**: Proper `aria-checked` states
- **Loading states**: `aria-busy="true"` and `aria-live="polite"` for loading indicators

**Testing:**
- **Automated testing**: Use tools like axe DevTools, WAVE, Lighthouse
- **Manual testing**: Test with keyboard only (no mouse)
- **Screen reader testing**: Test with NVDA (Windows), JAWS (Windows), VoiceOver (macOS/iOS)
- **Browser testing**: Test in Chrome, Firefox, Safari, Edge
- **Mobile testing**: Test on iOS and Android with screen readers

**Accessibility Statement:**
- Provide accessibility statement page
- Document known accessibility issues
- Provide contact method for accessibility concerns

**Meeting Overall Grade:**
- Three large button selection: "Bad", "Go but needs attention", "All good"
- Visual indicators (red/yellow/green) with smooth color transitions
- Button animations on click (scale down/up)
- Responsive design critical for mobile grading

**Competency Scoring:**
- Large numeric input or slider component
- Smooth slide-in animation when new competency question appears
- Weight indicators shown (e.g., "Problem Solving (2x)") with subtle badge
- Progress indicator with smooth transitions

**Animation Library:**
- Vue transitions for component enter/leave
- CSS animations for microinteractions
- Framer Motion principles (but with Vue/CSS)
- Smooth easing functions (ease-in-out, cubic-bezier)

### End Grade Calculation

**Formula:**
1. Calculate average score per competency across all meetings
2. Apply weights (default: problem solving = 2x, others = 1x)
3. Calculate weighted average
4. Teacher grade is main (required)
5. Company grader advice is optional input
6. Final grade = Teacher grade (company advice is advisory only)

**Display:**
- Visual breakdown by competency
- Weight indicators
- Meeting-by-meeting trend
- Final grade prominently displayed

### Trend Charts (Vue.js + Chart.js)

**Meeting Progress:**
- Line chart showing meeting-by-meeting scores
- X-axis: Meeting number (1, 2, 3, ...)
- Y-axis: Average competency score
- Multiple lines per competency
- Hover tooltip: Individual competency scores

**Competency Breakdown:**
- Bar chart comparing final competency scores
- X-axis: Competencies
- Y-axis: Weighted average score
- Color coding by performance level
- Weight indicators on bars

### PDF Export Functionality

**Implementation:**
- **Client-side only**: Print CSS for PDF generation
- Use browser's print-to-PDF functionality
- No external libraries needed (jsPDF, Puppeteer, etc.)

**Content:**
1. Cover page with branding
2. Executive summary
3. Meeting grades table + chart
4. Competency breakdown (detailed)
5. End grade summary
6. Overall assessment

**Features:**
- Print-optimized CSS stylesheet
- Professional formatting via CSS
- Organization branding
- Page breaks and page numbers
- Table of contents (optional)
- Responsive print layout

## Database Schema Considerations

### Indexes
- `User.email` (unique)
- `User.organizationId`
- `Internship.internId`
- `Internship.supervisorId`
- `WeeklyCheckIn.internshipId, weekStartDate` (composite)
- `MainEvaluation.internshipId, dueDate`
- `Invitation.token` (unique)
- `Invitation.email, status`

### Relationships
- Organization → Users (one-to-many)
- Student → GradingSessions (one-to-many)
- GradingSession → Meetings (one-to-many)
- GradingSession → EndGrade (one-to-one)
- GradingSession → Invitations (one-to-many)
- User → GradingSessions as Teacher (one-to-many)
- User → GradingSessions as CompanyGrader (one-to-many, optional)
- User → GradingSessions as SecondReviewer (one-to-many, optional, read-only)
- CompetencyTemplate → GradingSession.competencies (many-to-many via JSON)

### Constraints
- Student code must be unique (6 characters, alphanumeric)
- One active grading session per student at a time (optional)
- Meeting numbers must be sequential (1, 2, 3, ...)
- Number of meetings cannot exceed session numberOfMeetings
- Invitation tokens must be unique
- End grade requires teacher grade (company grader advice optional)

## API Design (Supabase)

### Supabase Client Usage
All API calls use Supabase JS Client. Supabase provides:
- Auto-generated REST API from database schema
- Real-time subscriptions
- Row Level Security (RLS) for authorization
- Edge Functions for serverless operations

### Key Supabase Tables & Operations

```typescript
// Students
supabase.from('students').select('*')
supabase.from('students').insert({ code: 'ABC123' })

// Grading Sessions
supabase.from('grading_sessions').select('*, meetings(*), end_grade(*)')
supabase.from('grading_sessions').insert({ ... })
supabase.from('grading_sessions').update({ ... }).eq('id', sessionId)

// Meetings
supabase.from('meetings').select('*').eq('grading_session_id', sessionId)
supabase.from('meetings').insert({ ... })
supabase.from('meetings').update({ ... }).eq('id', meetingId)

// End Grades
supabase.from('end_grades').select('*').eq('grading_session_id', sessionId)
supabase.from('end_grades').upsert({ ... })

// Competencies
supabase.from('competency_templates').select('*')
supabase.from('competency_templates').insert({ ... })

// Invitations
supabase.from('invitations').insert({ ... })
supabase.from('invitations').update({ status: 'accepted' }).eq('token', token)
```

### Supabase Edge Functions
- `/invite-reviewer`: Send invitation emails
- `/generate-pdf`: Generate PDF reports
- `/calculate-end-grade`: Calculate final grades
- `/send-notifications`: Email notifications

## Security Considerations (Supabase)

1. **Authentication**
   - Supabase Auth handles all authentication
   - JWT tokens with automatic refresh
   - Secure password hashing (handled by Supabase)
   - Email verification
   - Magic links support

2. **Authorization**
   - Row Level Security (RLS) policies on all tables
   - Role-based access via RLS
   - Supabase handles API rate limiting
   - Policies enforce:
     - Teachers can only access their own grading sessions
     - Company graders can only access invited sessions
     - Second reviewers have read-only access
     - Admins have full access

3. **Data Protection**
   - HTTPS enforced by Supabase
   - Input validation via Supabase client
   - SQL injection prevention (Supabase uses parameterized queries)
   - XSS protection (Vue.js auto-escaping)

4. **Privacy**
   - Minimal personal data (only student codes, no names/emails)
   - GDPR compliance (Supabase is GDPR compliant)
   - Data encryption at rest (Supabase default)
   - Audit logging via Supabase audit logs
   - Data retention policies configurable

## Performance Considerations (Supabase + Vue.js)

1. **Caching**
   - Supabase client-side caching
   - Vue.js Pinia store for state management
   - LocalStorage for offline data
   - Service Worker for offline support

2. **Database Optimization**
   - Proper indexing on all foreign keys
   - Index on student.code (unique)
   - Index on grading_session_id for meetings
   - Supabase connection pooling (automatic)
   - Query optimization via Supabase query builder

3. **Frontend Optimization (Vue.js)**
   - Code splitting with Vue Router lazy loading
   - Component lazy loading
   - Image optimization (WebP, lazy loading)
   - Vite build optimization
   - Tree shaking for smaller bundles

4. **Background Jobs**
   - Supabase Edge Functions for async tasks
   - Cron jobs via Supabase pg_cron or external service
   - Email queue via Edge Functions
   - PDF generation via Edge Functions

## Deployment Considerations (Supabase + Vue.js + Vercel)

1. **Environment Variables**
   - Supabase URL and anon key (public, Vercel env vars)
   - Supabase service role key (server-side only, Edge Functions, Supabase secrets)
   - Brevo API key (Supabase Edge Functions, Supabase secrets)
   - No monitoring/tracking keys needed

2. **Version Control**
   - GitHub repository
   - Main branch for production
   - Feature branches for development
   - Pull request workflow

3. **CI/CD**
   - GitHub Actions (optional, for tests)
   - Vercel automatic deployments from GitHub
   - Preview deployments for pull requests
   - Production deployments on main branch merge

4. **Monitoring**
   - None (as per requirements)
   - No error tracking
   - No analytics
   - Supabase dashboard for database metrics only

5. **Backup & Recovery**
   - Supabase automatic daily backups
   - Point-in-time recovery (Supabase Pro)
   - Manual backup exports via Supabase dashboard
   - GitHub for code versioning

6. **Scaling**
   - Supabase handles database scaling automatically
   - Frontend scales via Vercel CDN
   - Edge Functions auto-scale
   - No manual load balancing needed


# Epic 8: Settings & Configuration

## Overview
Enable admins to customize competencies, grade scales, and system settings. Competencies can be customized at organization level or per grading session.

## User Stories

### US-8.1: Manage System Default Competencies
**As an** admin  
**I want to** view and manage system default competencies  
**So that** I can provide standard evaluation criteria

**Acceptance Criteria:**
- Admin can view system default competencies
- Default competencies:
  1. Working according a plan (weight: 1.0)
  2. Problem solving and building software (weight: 2.0)
  3. Research (weight: 1.0)
  4. Collaboration and communication (weight: 1.0)
  5. Professional attitude (weight: 1.0)
- Can edit names and default weights
- Can add/remove system competencies
- Can reorder competencies
- Changes affect all new sessions using system defaults
- Existing sessions retain their competency configuration

**Priority:** Medium

---

### US-8.2: Create Custom Competency Set
**As an** admin  
**I want to** create a custom competency set for my organization  
**So that** teachers can use it when creating grading sessions

**Acceptance Criteria:**
- Admin can create custom competency set
- Can add competencies with:
  - Name
  - Description (optional)
  - Default weight
- Can remove competencies
- Can reorder competencies
- Can set as organization default
- Teachers can choose custom set when creating session
- Can start from system defaults and customize
- Can start completely clean (no competencies)

**Priority:** High

---

### US-8.3: Configure Competency Weights
**As an** admin  
**I want to** configure default weights for competencies  
**So that** problem solving (or other competencies) can count double or more

**Acceptance Criteria:**
- Can set weight for each competency (default: 1.0)
- Problem solving default weight: 2.0 (counts double)
- Weights can be decimal (e.g., 1.5, 0.5)
- Weight indicators shown in UI
- Weights can be modified per grading session
- Default weights apply to new sessions

**Priority:** High

---

### US-8.4: Customize Meeting Overall Grade Labels
**As an** admin  
**I want to** customize the labels for meeting overall grades  
**So that** the language fits our organization

**Acceptance Criteria:**
- Can customize three labels:
  - "Bad" (default)
  - "Go but needs attention" (default)
  - "All good" (default)
- Can change to custom text
- Preview shows how labels will appear
- Changes apply to all new grading sessions
- Existing sessions retain original labels

**Priority:** Low

---

### US-8.5: Configure Grade Scale
**As an** admin  
**I want to** configure the grade scale (numeric, letter, percentage)  
**So that** it matches our grading system

**Acceptance Criteria:**
- Can choose grade scale:
  - Numeric (0-10) - default
  - Letter (A-F)
  - Percentage (0-100)
- Scale applies to competency scores and end grades
- Conversion formulas for different scales
- Preview shows how grades will appear
- Changes apply to all new sessions

**Priority:** Medium

---

### US-8.6: Configure Competency Score Scale
**As an** admin  
**I want to** configure the scale for competency scores (1-5 or 1-10)  
**So that** it matches our evaluation framework

**Acceptance Criteria:**
- Can choose competency score scale:
  - 1-5 scale (default)
  - 1-10 scale
- Scale applies to all competency scoring
- Preview shows how scores will appear
- Changes apply to all new sessions

**Priority:** Medium

---

### US-8.7: Organization Branding
**As an** admin  
**I want to** customize organization branding  
**So that** reports and UI match our brand

**Acceptance Criteria:**
- Can upload organization logo
- Can set primary and secondary colors
- Preview of branded UI
- Branding applies to:
  - PDF reports
  - Email templates
  - UI theme (optional)
- Changes apply immediately

**Priority:** Low

## Additional Settings

### Organization Settings
- Organization name and logo
- Branding colors
- Email signature
- Time zone
- Date format
- Language (future)

### User Management Settings
- Default invitation message templates
- Invitation expiration time (default: 7 days)
- Password requirements (via Supabase Auth)
- Session timeout

### Notification Settings
- Default reminder schedules
- Email templates
- Notification frequency defaults

### Data & Privacy Settings
- Data retention policies
- Export formats
- GDPR compliance options
- Student code format (if custom needed)

## Technical Considerations

### Settings Storage (Supabase)
- Organization-level settings (applies to all users in org)
- System-level settings (default competencies, etc.)
- Settings stored in `organization_settings` table
- Competency templates in `competency_templates` table

### Settings UI (Vue.js)
- Tabbed interface for different setting categories
- Drag-and-drop for reordering competencies
- Preview panels for visual changes
- Reset to defaults option
- Real-time validation

### Validation
- Ensure required fields are not empty
- Validate weights (must be > 0)
- Validate grade scales
- Character limits for custom text
- Unique competency names

### Migration
- Handle settings changes for existing data
- Preserve historical data with original settings
- Competency changes don't affect existing sessions
- Settings versioning (optional)

## Data Model

### OrganizationSettings Entity
```typescript
{
  id: UUID
  organizationId: UUID (FK, unique)
  useSystemCompetencies: boolean (default: true)
  customCompetencySetId?: UUID (FK -> CompetencyTemplate)
  gradeScale: enum ['numeric_0_10', 'letter', 'percentage']
  competencyScoreScale: enum ['1_5', '1_10']
  meetingGradeLabels: JSON {
    bad: string,
    go_but_needs_attention: string,
    all_good: string
  }
  branding: JSON {
    logo?: string,
    primaryColor: string,
    secondaryColor: string
  }
  updatedAt: timestamp
}
```

### CompetencyTemplate Entity
```typescript
{
  id: UUID
  organizationId?: UUID (FK, null for system defaults)
  name: string
  description?: string
  defaultWeight: number (default: 1.0)
  isSystemDefault: boolean
  order: integer
  createdAt: timestamp
  updatedAt: timestamp
}
```

## Future Enhancements

- Settings templates (pre-configured for different industries)
- Settings import/export
- Competency library (pre-defined competencies to choose from)
- Multi-language competency names
- Competency descriptions with examples


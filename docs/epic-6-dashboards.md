# Epic 6: Dashboards & Reporting

## Overview
Provide comprehensive dashboards for all user types with progress tracking, visualizations, and export capabilities.

## User Stories

### US-6.1: Intern Dashboard
**As an** intern  
**I want to** see a dashboard with my overall progress, weekly trend chart, and upcoming evaluations  
**So that** I stay motivated

**Acceptance Criteria:**
- Dashboard displays:
  - Overall average score (all evaluations)
  - Weekly check-in trend chart (line graph)
  - Upcoming evaluation deadlines
  - Recent feedback summary
  - Performance badges/achievements (optional)
- Charts are interactive (hover for details)
- Responsive design for mobile
- Quick links to view detailed evaluations

**Priority:** High

**Dashboard Components:**
- **Progress Overview Card**: Overall score, completion percentage
- **Weekly Trend Chart**: Line graph showing weekly check-in scores over time
- **Upcoming Deadlines**: Calendar/list of next evaluations
- **Recent Activity**: Latest check-ins and evaluations
- **Performance Summary**: Strengths and areas for improvement

---

### US-6.2: Supervisor Dashboard
**As a** supervisor  
**I want to** see a dashboard of all my interns with their current average scores and upcoming deadlines  
**So that** I can prioritize my work

**Acceptance Criteria:**
- Dashboard displays:
  - List of assigned interns with key metrics
  - Current average score per intern
  - Days until next evaluation
  - Overdue evaluations highlighted
  - Completion status (check-ins, evaluations)
- Sortable and filterable list
- Quick actions: start evaluation, view profile
- Summary statistics: total interns, completion rates

**Priority:** High

**Dashboard Components:**
- **Interns Overview Table**: Name, department, avg score, next deadline, status
- **Priority Alerts**: Overdue evaluations, pending check-ins
- **Completion Stats**: Percentage of evaluations/check-ins completed
- **Quick Actions**: Start evaluation, send reminder, view profile
- **Performance Trends**: Aggregate view of all interns' progress

---

### US-6.3: HR Manager Dashboard
**As an** HR manager  
**I want to** see an organization-wide dashboard with completion rates and average scores  
**So that** I can measure program success

**Acceptance Criteria:**
- Dashboard displays:
  - Total active interns
  - Overall completion rates (check-ins, evaluations)
  - Average scores across all interns
  - Department breakdown
  - Supervisor performance metrics
  - Program health indicators
- Filterable by department, supervisor, date range
- Exportable reports
- Visual charts and graphs

**Priority:** High

**Dashboard Components:**
- **Program Overview**: Total interns, active, completed, archived
- **Completion Metrics**: Check-in completion %, evaluation completion %
- **Average Scores**: Overall, by department, by supervisor
- **Department Comparison**: Side-by-side metrics
- **Supervisor Performance**: Completion rates, average scores given
- **Timeline View**: Program milestones and deadlines
- **Alerts**: Low completion rates, overdue evaluations

---

### US-6.4: Export PDF Report
**As any** user  
**I want to** export a PDF report of an intern's complete journey  
**So that** I have documentation for HR files

**Acceptance Criteria:**
- PDF includes:
  - Intern profile information
  - All weekly check-ins with scores and notes
  - All main evaluations with detailed scores
  - Self-reflections
  - Comparison views (supervisor vs intern)
  - Overall summary and trends
- Professional formatting
- Organization branding (logo, colors)
- Downloadable from intern profile page
- Can be generated on-demand or scheduled

**Priority:** Medium

**PDF Report Sections:**
1. Cover page with intern info
2. Executive summary
3. Weekly check-ins (table + chart)
4. Main evaluations (detailed breakdown)
5. Self-reflections
6. Comparison analysis
7. Overall assessment
8. Recommendations

---

### US-6.5: Compare Cohorts/Departments
**As an** HR manager  
**I want to** compare cohorts or departments  
**So that** I can identify best practices

**Acceptance Criteria:**
- Comparison view shows:
  - Average scores by cohort/department
  - Completion rates
  - Score distributions
  - Trend comparisons
- Side-by-side visualizations
- Statistical significance indicators
- Export comparison to PDF/Excel
- Filter by date range, evaluation type

**Priority:** Low

**Comparison Features:**
- Cohort comparison (e.g., Summer 2024 vs Summer 2023)
- Department comparison (Engineering vs Marketing)
- Supervisor comparison (aggregated intern scores)
- Time period comparison (Q1 vs Q2)

## Technical Considerations

### Dashboard Performance
- Cache aggregated data
- Lazy load charts
- Pagination for large datasets
- Real-time updates (WebSocket or polling)

### Chart Libraries
- Consider: Chart.js, D3.js, Recharts, or similar
- Responsive charts
- Export chart images
- Interactive tooltips

### PDF Generation
- Use library: Puppeteer, jsPDF, or server-side (Python reportlab, etc.)
- Template-based generation
- Include charts as images
- Branding customization

### Data Aggregation
- Pre-calculate metrics for performance
- Store aggregated data in cache/separate table
- Refresh on data updates
- Background jobs for heavy calculations

## Future Enhancements

- Customizable dashboard widgets
- Scheduled email reports
- Real-time notifications on dashboard
- Mobile app dashboards
- Advanced analytics (predictive insights)



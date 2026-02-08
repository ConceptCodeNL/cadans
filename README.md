# CADANS - Student Grading Platform

A privacy-focused student grading platform built with Supabase and Vue.js. Track and evaluate student performance through structured meeting-based grading, competency assessment, and end grade calculation. Students are identified only by unique 6-character codes - no personal data stored.

## Tech Stack

- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Frontend**: Vue.js 3 (Composition API) + Tailwind CSS
- **State Management**: Pinia
- **Internationalization**: Vue I18n (English/Dutch)
- **Email**: Brevo (transactional emails)
- **PDF**: Client-side with print CSS
- **Hosting**: Vercel (frontend), Supabase Cloud (backend)
- **Version Control**: GitHub
- **CI/CD**: GitHub Actions + Vercel automatic deployments
- **Accessibility**: WCAG 2.1 AA compliant

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Supabase account and project
- Brevo account (for email)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd cadans
```

2. Install dependencies
```bash
npm install
```

3. Set up Supabase
   - Create a Supabase project at https://supabase.com
   - Get your credentials from Settings → API
   - Run the SQL migrations in `supabase/migrations/` (see `supabase/SETUP.md` for details)

4. Set up environment variables
```bash
# Your .env file should have:
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. Run the development server
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready to deploy to Vercel.

## Project Structure

```
cadans/
├── public/          # Static assets (logos, etc.)
├── src/
│   ├── assets/      # CSS, images
│   ├── composables/ # Vue composables (useTheme, etc.)
│   ├── i18n/        # Internationalization
│   ├── lib/         # Libraries (Supabase client)
│   ├── router/      # Vue Router configuration
│   ├── stores/      # Pinia stores
│   ├── views/       # Page components
│   ├── App.vue      # Root component
│   └── main.js      # Application entry point
├── docs/            # Documentation
└── package.json
```

## Environment Variables

Required environment variables:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `BREVO_API_KEY` - Brevo API key (for Edge Functions, optional for now)

## Supabase Setup

**Important**: You need to set up your Supabase database before the app will work fully.

1. See `supabase/SETUP.md` for detailed setup instructions
2. Run the SQL migrations in `supabase/migrations/`:
   - `001_initial_schema.sql` - Creates all tables
   - `002_row_level_security.sql` - Sets up security policies
3. Configure authentication in Supabase dashboard
4. Test by creating a user account

The migrations will:
- Create all necessary tables
- Set up Row Level Security (RLS) policies
- Insert default competency templates
- Create triggers for automatic profile creation

## Typography

- **Headings**: Anton (Google Fonts) - Bold, impactful, modern
- **Body Text**: Manrope (Google Fonts) - Clean, readable, professional

## Theming

- **Light Theme**: Clean, professional light interface with pastel green accents
- **Dark Theme**: Comfortable dark mode with pastel green highlights
- **Color Palette**: Pastel green (#86efac light, #6ee7b7 dark) as primary brand color
- **Theme Toggle**: User preference with system detection
- **Accessibility**: WCAG AA compliant contrast in both themes

## Documentation

All project documentation is available in the [`docs/`](./docs/) directory:

- **[Documentation Index](./docs/README.md)** - Start here for an overview
- **[Requirements Overview](./docs/requirements-overview.md)** - Project scope and key features
- **[Technical Specifications](./docs/technical-specifications.md)** - Data models, architecture, and implementation details
- **[Typography](./docs/typography.md)** - Font guidelines
- **[Theme Design System](./docs/theme-design.md)** - Color palettes and theming
- **[Accessibility Requirements](./docs/accessibility-requirements.md)** - WCAG compliance guidelines

**Tagline**: "Check-ins That Matter" - Used in all logo variations

## License

[Add your license here]

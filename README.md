# Instama Creative Templates

A modern web application for managing creative templates and designs for social media channels. Built with Next.js, TypeScript, Supabase, and Tailwind CSS.

## Overview

This application provides a complete solution for managing creative templates and designs across multiple social media channels (Facebook, Instagram, LinkedIn, Display Ads). It demonstrates:

### Core Features (Mapping to Requirements)

1. **Templates List & Management** (`/templates`)
   - Browse all templates with filtering by channel and status
   - Create new templates with metadata (name, channel, status)
   - Edit existing templates
   - Visual status badges (draft, active, archived)

2. **Canvas Editor** (`/templates/[id]`, `/designs/[id]`)
   - Interactive drag-and-drop canvas with layers
   - Support for text and image layers
   - Layer properties panel (position, size, rotation, opacity, colors, fonts)
   - Layer reordering (z-index management)
   - Keyboard controls (arrow keys for nudging, Shift for 10px increments)
   - Snap-to-edge functionality
   - Real-time visual feedback

3. **AI Copy Helper** (Template detail page)
   - Stubbed AI copy generation from product descriptions
   - Insert generated copy directly into selected text layers
   - Easily replaceable with real LLM integration

4. **Create Design from Template** (`/templates/[id]` → `/designs/[id]`)
   - One-click design creation from any template
   - Clones template canvas and metadata
   - Navigate directly to design editor

5. **Designs Management** (`/designs`)
   - List all designs with metadata
   - Edit designs with full canvas editor
   - Save designs back to database
   - Convert designs to templates ("Save as Template")

6. **Persistence**
   - All templates and designs persist to Supabase (PostgreSQL)
   - Canvas state stored as JSONB for efficient querying
   - Full state preservation on reload

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, React Server Components)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL with JSONB)
- **Canvas Interactions**: [react-rnd](https://github.com/bokuweb/react-rnd) (drag & resize)
- **Testing**: [Vitest 4](https://vitest.dev/) + [React Testing Library](https://testing-library.com/react)
- **Linting**: [ESLint 9](https://eslint.org/) with Next.js config
- **CI/CD**: [GitHub Actions](https://github.com/features/actions) (automated testing and linting)
- **Package Manager**: npm

## How to Run Locally

### Prerequisites

- Node.js 18+ and npm
- A Supabase account (free tier works fine)

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd instama-creative-templates
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Set Up Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Open `.env.local` and fill in your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

   **Where to find these values:**
   - Go to [Supabase Dashboard](https://app.supabase.com/)
   - Select your project (or create a new one - see Database Setup below)
   - Navigate to **Settings** → **API**
   - Copy the **Project URL** and **anon/public key**

### Step 4: Set Up the Database

See the [Database Setup](#database-setup) section below for detailed instructions.

### Step 5: Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Step 6: Run Tests (Optional)

```bash
# Run tests in watch mode
npm test

# Run tests once
npm run test:run

# Run tests with UI
npm run test:ui
```

### Step 7: Lint the Code (Optional)

```bash
npm run lint
```

## Database Setup

### Creating a Supabase Project

1. Go to [https://app.supabase.com/](https://app.supabase.com/)
2. Sign in or create a free account
3. Click **"New Project"**
4. Fill in:
   - **Name**: `instama-creative-templates` (or any name you prefer)
   - **Database Password**: Choose a strong password (save it securely)
   - **Region**: Choose the closest region to you
5. Click **"Create new project"** and wait ~2 minutes for provisioning

### Running the Database Migration

1. In your Supabase project dashboard, navigate to **SQL Editor** (left sidebar)
2. Click **"New query"**
3. Open the file `supabase/migrations/001_init_schema.sql` in this repository
4. Copy the entire contents and paste into the SQL Editor
5. Click **"Run"** (or press `Ctrl+Enter` / `Cmd+Enter`)
6. You should see a success message

This creates:
- `templates` table with columns: `id`, `name`, `channel`, `status`, `canvas` (JSONB), `created_at`, `updated_at`
- `designs` table with columns: `id`, `template_id`, `name`, `channel`, `status`, `canvas` (JSONB), `created_at`, `updated_at`
- Appropriate indexes for performance
- Automatic timestamp triggers

### Authentication & Security Note

**For simplicity, this demo app does NOT implement authentication or Row Level Security (RLS).**

- The app assumes **open access** to all tables
- In production, you would:
  - Enable Supabase Auth (email/password, OAuth, etc.)
  - Configure RLS policies to restrict access by user
  - Add user_id columns to templates and designs tables
  - Implement proper authorization checks

This is intentional for the demo to focus on the core functionality.

## Project Structure

```
instama-creative-templates/
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── api/                  # API routes
│   │   │   ├── templates/        # Template CRUD endpoints
│   │   │   └── designs/          # Design CRUD endpoints
│   │   ├── templates/            # Template pages
│   │   │   ├── [id]/             # Template detail/edit page
│   │   │   ├── new/              # Create template page
│   │   │   └── page.tsx          # Templates list page
│   │   ├── designs/              # Design pages
│   │   │   ├── [id]/             # Design detail/edit page
│   │   │   └── page.tsx          # Designs list page
│   │   └── page.tsx              # Home page
│   ├── components/               # Shared UI components
│   │   ├── layout/               # Layout components (NavBar, etc.)
│   │   └── ui/                   # Reusable UI primitives (Button, Card, etc.)
│   ├── features/                 # Feature-based modules
│   │   ├── templates/            # Template domain logic
│   │   │   ├── api.ts            # Client-side API functions
│   │   │   ├── types.ts          # TypeScript types
│   │   │   └── components/       # Template-specific components
│   │   ├── designs/              # Design domain logic
│   │   ├── canvas/               # Canvas editor logic
│   │   │   ├── canvasTypes.ts    # Canvas data model
│   │   │   ├── canvasState.ts    # Pure state management functions
│   │   │   └── components/       # Canvas UI components
│   │   └── ai-copy-helper/       # AI copy generation feature
│   ├── lib/                      # Shared utilities
│   │   └── supabase/             # Supabase client setup
│   └── test/                     # Test setup and utilities
├── supabase/
│   └── migrations/               # Database migrations
│       └── 001_init_schema.sql   # Initial schema
├── vitest.config.ts              # Vitest configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies and scripts
```

## Known Limitations & Future Improvements

This is a demo application built within time constraints. Here are known limitations and what I would improve with more time:

### Current Limitations

1. **No Authentication / Multi-User Isolation**
   - No user login or signup
   - All users see the same templates and designs
   - No Row Level Security (RLS) in Supabase
   - **Future**: Implement Supabase Auth + RLS policies

2. **Canvas Editor Limitations**
   - **No Undo/Redo**: Changes are immediate and cannot be undone
   - **Basic Snapping**: Only snaps to canvas edges, not to other layers
   - **Simple Rotation**: Rotation is numeric input only, no visual rotation handle
   - **No Grouping**: Cannot group multiple layers together
   - **No Copy/Paste**: Cannot duplicate layers
   - **Future**: Implement command pattern for undo/redo, advanced snapping grid, visual rotation handles

3. **AI Copy Helper is Stubbed**
   - Uses template strings instead of real AI
   - No integration with OpenAI, Anthropic, or other LLM providers
   - **Future**: Integrate with OpenAI GPT-4 or Anthropic Claude API

4. **No Image Upload**
   - Image layers use placeholder URLs only
   - No file upload functionality
   - **Future**: Implement Supabase Storage integration for image uploads

5. **No Export Functionality**
   - Cannot export canvas to PNG, JPG, or PDF
   - **Future**: Implement server-side rendering with Puppeteer or html2canvas

6. **Limited Canvas Features**
   - No text formatting (bold, italic, underline)
   - No custom fonts beyond basic web fonts
   - No gradients or advanced styling
   - No shapes (rectangles, circles, lines)
   - **Future**: Add rich text editor, font library integration, shape tools

7. **No Collaboration Features**
   - No real-time collaboration
   - No comments or feedback system
   - **Future**: Implement WebSocket-based real-time editing with Supabase Realtime

8. **Basic Error Handling**
   - Error messages are simple text
   - No retry logic for failed API calls
   - **Future**: Implement toast notifications, retry mechanisms, offline support

9. **No Performance Optimizations**
   - No image optimization
   - No lazy loading of designs/templates
   - No pagination on list pages
   - **Future**: Implement Next.js Image component, virtual scrolling, pagination

10. **No CI/CD Pipeline**
    - No automated testing in CI
    - No automated deployments
    - **Future**: Set up GitHub Actions for testing, linting, and deployment

### What I Would Do With More Time

- **Enhanced Canvas Editor**: Undo/redo, layer grouping, alignment guides, smart snapping
- **Real AI Integration**: Connect to OpenAI or Anthropic for actual copy generation
- **Image Management**: Upload, crop, resize, and manage images with Supabase Storage
- **Export to PNG/PDF**: Server-side rendering for high-quality exports
- **User Authentication**: Full auth flow with Supabase Auth + RLS
- **Collaboration**: Real-time editing, comments, version history
- **Templates Library**: Pre-built templates for common use cases
- **Analytics**: Track template usage, design performance
- **Mobile Responsive Canvas**: Touch-friendly canvas editor for tablets
- **Accessibility**: Full keyboard navigation, screen reader support, ARIA labels

## AI Tooling Usage

**Transparency Note**: I used an AI coding assistant (Augment Agent with Claude Sonnet 4.5) to scaffold parts of this codebase and architecture. The AI helped with:

- Generating boilerplate code for API routes and components
- Suggesting TypeScript types and interfaces
- Writing initial test cases
- Structuring the feature-based architecture
- Creating the canvas state management functions

However, I **reviewed, tested, and curated** all generated code to ensure:

- Code quality and consistency
- Proper error handling
- Type safety
- Best practices for Next.js and React
- Alignment with project requirements

The final solution represents a thoughtful combination of AI-assisted scaffolding and human oversight to deliver a production-quality demo application.

## Testing

The project uses **Vitest** for unit and integration testing.

### Running Tests

```bash
# Run tests in watch mode (recommended during development)
npm test

# Run tests once (useful for CI)
npm run test:run

# Run tests with UI (visual test runner)
npm run test:ui
```

### Test Coverage

Current test coverage focuses on:

- **Canvas State Management**: 22 tests covering all pure functions
  - Adding layers (text, image)
  - Updating layer properties (position, size, rotation, opacity)
  - Deleting layers
  - Selecting layers
  - Reordering layers (z-index)
  - Nudging layers
  - Snapping to edges

Tests are located in `src/features/canvas/canvasState.test.ts`.

### Future Testing Improvements

- Component tests for UI components
- Integration tests for API routes
- E2E tests with Playwright
- Visual regression tests

## Continuous Integration (CI)

The project includes a GitHub Actions workflow that automatically runs on every push and pull request.

### CI Workflow

**Location**: `.github/workflows/ci.yml`

**Triggers**:
- Push to any branch
- Pull requests to any branch

**Jobs**:
1. **Checkout code** - Uses `actions/checkout@v4`
2. **Set up Node.js 20.x** - Uses `actions/setup-node@v4` with npm caching
3. **Install dependencies** - Runs `npm ci` for fast, reliable installs
4. **Run linting** - Executes `npm run lint` to check code quality
5. **Run tests** - Executes `npm run test:run` to run all tests

### CI Requirements

- **No environment variables needed** - Tests run without Supabase connection
- **No network access required** - All tests use jsdom and mock data
- **No secrets required** - Workflow is self-contained and simple

### Local CI Simulation

To run the same checks locally before pushing:

```bash
# Run linting
npm run lint

# Run tests
npm run test:run
```

Both commands must pass for CI to succeed.


**Built with ❤️ using Next.js, TypeScript, Supabase, and Tailwind CSS**

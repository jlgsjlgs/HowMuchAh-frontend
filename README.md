# HowMuchAh - Frontend

A React TypeScript application for group expense tracking and settlement, with real-time notifications and mobile-first design.

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about">About</a></li>
    <li><a href="#built-with">Built With</a></li>
    <li><a href="#getting-started">Getting Started</a></li>
    <li><a href="#deployment">Deployment</a></li>
  </ol>
</details>

## About

HowMuchAh is a Splitwise-inspired expense splitting application. The frontend provides an intuitive mobile-first interface for managing groups, tracking expenses, and settling debts.

**Key Features:**
- Google OAuth authentication via Supabase
- Group creation and member management with invitations
- Expense tracking with flexible split options (equal/custom amounts)
- Real-time invitation notifications via WebSocket
- Automated settlement calculations
- Responsive mobile-first design with dark mode support
- Form validation with Zod schemas

## Built With

- **React 19** with TypeScript
- **Vite** - Build tool and dev server
- **React Router v6** - Client-side routing
- **TailwindCSS v4** - Utility-first styling
- **shadcn/ui** - Accessible component library built on Radix UI
- **Tanstack Query** - Server state management and caching
- **React Hook Form** - Form state management
- **Zod** - Schema validation
- **Supabase** - Authentication and database
- **Axios** - HTTP client
- **STOMP.js** - WebSocket communication
- **Sonner** - Toast notifications

## Getting Started

### Prerequisites

- Node.js 18 or higher
- pnpm (recommended) or npm

### Installation

1. Clone the repository
   ```bash
   git clone git@github.com:jlgsjlgs/HowMuchAh-frontend.git
   cd howmuchah-frontend
   ```

2. Install dependencies
   ```bash
   pnpm install
   # or
   npm install
   ```

3. Configure environment variables

   Create a `.env` file in the root directory:

   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   VITE_SPRINGBOOT_ENDPOINT=http://localhost:8080
   ```

   Variable | Purpose | How to obtain
   :-- | :-- | :--
   VITE_SUPABASE_URL | Supabase project URL | Supabase project dashboard
   VITE_SUPABASE_ANON_KEY | Supabase anonymous key | Supabase project dashboard → API settings
   VITE_SPRINGBOOT_ENDPOINT | Backend API endpoint | Local: `http://localhost:8080`, Production: Railway URL

4. Run the development server
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

   The app will be available at `http://localhost:3000`

## Deployment

The application is deployed on **Vercel** with automatic deployments from the main branch.

**Vercel deployment steps:**
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Vercel auto-deploys on push to main branch
4. Access via Vercel-provided domain

**Build for production** (manual):
```bash
pnpm build
# or
npm run build
```

---
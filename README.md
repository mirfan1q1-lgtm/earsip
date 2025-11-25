# Premium Portfolio Website

A modern, full-featured portfolio website built with React, Vite, Tailwind CSS, DaisyUI, and Supabase.

## Features

### Public Portfolio
- **Hero Section** - Name, role, description, and profile image
- **About Me** - Biography and downloadable CV
- **Experience Timeline** - Work history and organizational experience
- **Skills Section** - Technical and soft skills with proficiency levels
- **Projects Showcase** - Portfolio projects with images, descriptions, and links
- **Contact Form** - Message submission (stored in Supabase)
- **Dark/Light Mode** - Theme toggle with persistent preference
- **Smooth Animations** - Powered by Framer Motion
- **Fully Responsive** - Mobile-first design

### Admin Panel (CMS)
- **Authentication** - Secure login with Supabase Auth
- **Hero Section Editor** - Update name, role, description, and profile image
- **About Me Editor** - Update biography and upload CV (PDF)
- **Experience Manager** - CRUD operations for work experience
- **Skills Manager** - CRUD operations for skills with categories and levels
- **Projects Manager** - CRUD operations for projects with image uploads
- **Messages Inbox** - View and manage contact form submissions
- **Protected Routes** - Admin-only access with authentication

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + DaisyUI
- **Animations**: Framer Motion
- **Backend**: Supabase (Database, Auth, Storage)
- **Routing**: React Router v6
- **Icons**: Lucide React

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- Supabase account and project

### 1. Clone and Install

```bash
npm install
```

### 2. Configure Supabase

1. Create a Supabase project at https://supabase.com
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Add your Supabase credentials to `.env`:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### 3. Database Setup

The database migrations have already been applied automatically. The schema includes:
- `hero_section` - Hero content (single row)
- `about_me` - About content (single row)
- `experiences` - Work experience timeline
- `skills` - Skills with categories and levels
- `projects` - Portfolio projects
- `messages` - Contact form submissions

Storage buckets:
- `images` - Profile and project images
- `documents` - CV/resume PDFs

### 4. Create Admin User

Create an admin user in Supabase:
1. Go to Authentication > Users in your Supabase dashboard
2. Click "Add user" > "Create new user"
3. Enter email and password
4. Confirm the user

### 5. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 6. Build for Production

```bash
npm run build
```

## Usage

### Public Site
- Visit the homepage to view the portfolio
- Navigate through sections using the navbar
- Toggle dark/light mode
- Submit messages via the contact form

### Admin Panel
1. Go to `/login`
2. Sign in with your admin credentials
3. Access the dashboard at `/admin`
4. Manage all content through the admin interface

### Admin Routes
- `/admin` - Dashboard overview
- `/admin/hero` - Edit hero section
- `/admin/about` - Edit about section and upload CV
- `/admin/experiences` - Manage experiences
- `/admin/skills` - Manage skills
- `/admin/projects` - Manage projects
- `/admin/messages` - View contact messages

## Project Structure

```
src/
├── components/
│   ├── admin/          # Admin panel components
│   └── public/         # Public portfolio components
├── contexts/           # React contexts (Auth, Theme)
├── lib/                # Supabase client
├── pages/              # Route pages
│   ├── admin/          # Admin pages
│   ├── Home.tsx        # Public homepage
│   └── Login.tsx       # Login page
├── types/              # TypeScript types
├── App.tsx             # Main app with routing
└── main.tsx            # Entry point
```

## Security

- All admin routes are protected with authentication
- Row Level Security (RLS) enabled on all tables
- Public can only read portfolio content
- Only authenticated users can write/update content
- Storage buckets have appropriate access policies

## License

MIT
# porto2
# porto2
# porto2
# earsip

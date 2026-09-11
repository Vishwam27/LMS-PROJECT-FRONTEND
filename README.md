# CourseMaster LMS — Frontend

A Next.js frontend for a full Learning Management System, with distinct experiences for Students, Instructors, and Admins — course browsing and enrollment, an instructor course/lesson builder, and an admin approval and management panel.

> Backend repository: [LMS-PROJECT-BACKEND](https://github.com/Vishwam27/LMS-PROJECT-BACKEND)

![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-7-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Media | Cloudinary (via `next-cloudinary`) |
| Icons | `lucide-react` |
| Data fetching | `fetch` + React state |
| Forms | Controlled inputs + manual validation |
| Auth | JWT, Google OAuth, via a custom `AuthContext` |
| Google Auth | `@react-oauth/google` + Google OAuth Client ID |

## Features

**Authentication**
- Login and registration with client-side password strength validation
- JWT + user profile persisted across page refreshes
- Role-aware routing — Students, Instructors, and Admins land on different areas of the app
- New users signing in with Google are assigned the Student role

**Students (Learner)**
- Course catalog with live search, category filters, level filters, and sorting
- Course detail pages with enrollment
- "My Courses" view for tracking enrolled courses
- Responsive sidebar navigation

**Instructors**
- Dashboard with course, lesson, and enrollment stats
- Create, edit, publish, and delete courses
- Add lessons to a course

**Admins**
- Platform-wide stats dashboard (users, courses, enrollments)
- Approve or reject pending instructor applications
- Manage users, courses, and instructors

## Design System

A custom navy-and-violet brand palette, defined as CSS custom properties in `globals.css`.

| Token | Hex |
|---|---|
| Navy 950 | `#080c1e` |
| Navy 900 | `#0f1428` |
| Navy 800 | `#161d3a` |
| Violet 600 | `#6c3bff` |
| Violet 400 | `#a880ff` |
| Slate 50 | `#f8fafc` |

**Fonts:** [Outfit](https://fonts.google.com/specimen/Outfit) for headings, [Inter](https://fonts.google.com/specimen/Inter) for body text — both loaded via Google Fonts.

## Project Structure

```
app/
├── layout.tsx                  # Root layout — wraps the app in AuthProvider
├── page.tsx                    # Root route — login / register switcher
├── not-found.tsx                # 404 page
├── globals.css                  # Tailwind import + design tokens
├── context/
│   └── AuthContent.tsx          # AuthProvider + useAuth() hook
├── pages/
│   ├── LoginPage.tsx
│   └── RegisterPage.tsx
├── components/
│   ├── AuthPanel.tsx             # Shared split-screen layout for auth pages
│   └── learner/
│       └── SideBar.tsx
├── Learner/
│   ├── Explore/                  # Course catalog
│   │   ├── page.tsx
│   │   ├── bannerHeader.tsx
│   │   ├── exploreHeader.tsx
│   │   └── courseGrid.tsx
│   ├── Courses/[id]/
│   │   └── page.tsx              # Course details + enrollment
│   └── My-Courses/
│       ├── page.tsx
│       └── topbar.tsx
├── Instructor/
│   ├── Dashboard/
│   │   └── page.tsx
│   └── Courses/
│       ├── page.tsx              # Instructor's own courses
│       └── [id]/...              # Course detail, add-lesson flow
└── AdminMaster/
    ├── page.tsx                  # Admin dashboard
    ├── Users/
    ├── Courses/
    └── Instructors/
```

## Getting Started

### Prerequisites
- Node.js 20+
- The [backend API](https://github.com/Vishwam27/LMS-PROJECT-BACKEND) running locally or deployed
- A Cloudinary account (for serving course/lesson images)

### Installation

```bash
git clone <this-repository-url>
cd <project-directory>
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

| Variable | Description | Example |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the backend API | `http://localhost:5000` |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name, used by `next-cloudinary` to resolve image URLs | `your-cloud-name` |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth Web Client ID used for Google sign-in | `123456789-example.apps.googleusercontent.com` |

### Running the App

```bash
npm run dev     # start the dev server
npm run build   # production build
npm start       # run the production build
npm run lint    # lint the project
```

The app runs at `http://localhost:3000`.

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the Next.js dev server |
| `npm run build` | Create a production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |

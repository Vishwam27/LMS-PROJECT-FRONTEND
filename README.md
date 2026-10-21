# CourseMaster LMS — Frontend

A learning management system frontend built with **Next.js, React, TypeScript, and Tailwind CSS**. CourseMaster provides a public home page and separate experiences for learners, instructors, and administrators, with REST API integration for authentication, courses, enrollment, and learning progress.

[Live Demo](https://coursemasterlms.vercel.app/) · [Frontend Repository](https://github.com/Vishwam27/LMS-PROJECT-FRONTEND) · [Backend Repository](https://github.com/Vishwam27/LMS-PROJECT-BACKEND)

## Features

### Public site

- Home page with a hero section, feature highlights, a "how it works" section, and registration calls to action.
- Live course catalog preview loaded from the backend: course count, instructor count, and up to five course cards (four on small screens) with image, category, level, duration, instructor, and price. Each card leads to registration.
- Hero preview card showing the first courses, a live course count, and a backend connection badge (connecting, connected, or failed).
- Loading skeletons while the catalog loads, and an empty state when no courses are returned or the backend is unreachable.
- Header shortcuts for the source code on GitHub and a downloadable resume (PDF).
- Search metadata (title, description, canonical URL, Open Graph, and Twitter card) on the registration page.

### Learners

- Register with email and password in a two-step form, or sign in with Google.
- After registering, arrive at the login page with the email already filled in.
- Browse courses; filter by category, level, and search text; sort by name or price.
- View course details and enroll in courses.
- View enrolled courses in grid or list layouts.
- Watch lesson videos and save lesson completion through the backend.
- Resume at the next lesson returned by the progress API.
- View enrollment totals, course progress, recommendations, and weekly activity.
- Update profile name and bio, change password, or delete an account.

### Instructors

- Register as an instructor and wait for administrator approval.
- View course, lesson, and student statistics.
- Create, edit, and delete courses.
- Add and delete lessons.
- Supply course image URLs and lesson video URLs.
- Change account password.

### Administrators

- View platform statistics.
- Search and filter users, change their roles, and delete users.
- Review pending instructor applications and approve or reject them.
- Browse and filter courses, inspect course lessons, and delete courses or lessons.
- Change account password.

### Shared interface

- Responsive layouts with mobile navigation and a collapsible learner sidebar.
- Shared authentication panel and Google sign-in button.
- Loading indicators, empty states, error messages, and confirmation dialogs.
- Password validation and a registration strength indicator.
- Backend availability indicator on the login page, checking `/api/health` every 30 seconds.
- Custom not-found page.

## Tech Stack

| Area | Implementation |
| --- | --- |
| Framework | Next.js 16 with the App Router |
| UI | React 19 |
| Language | TypeScript 6 with strict checking |
| Styling | Tailwind CSS 4 and PostCSS |
| Rendering | Server Components for the home and registration pages; Client Components for interactive and authenticated screens |
| Icons | Lucide React |
| Authentication UI | React Context and `@react-oauth/google` |
| Session state | Browser localStorage and `useSyncExternalStore` |
| API requests | Native Fetch API |
| Forms | React state and client-side validation |
| Images | `next-cloudinary` for course images; `next/image` for avatars and the auth panel photo |
| Lesson playback | Native HTML video player |
| Code checks | ESLint and TypeScript |

The frontend connects to a separate backend. Database operations, password handling, token verification, and permission enforcement belong to that backend.

## Getting Started

### Prerequisites

- Node.js **20.9.0 or newer** and npm.
- A running, compatible CourseMaster backend.
- A Google OAuth client ID.
- A Cloudinary cloud name for Cloudinary-backed course images.

### 1. Clone and install

```bash
git clone https://github.com/Vishwam27/LMS-PROJECT-FRONTEND.git
cd LMS-PROJECT-FRONTEND
npm ci
```

### 2. Configure the environment

Create `.env.local` in the project root:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
```

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Backend origin, without a trailing slash. The frontend appends paths such as `/api/auth/login`. The browser calls this URL directly, so it must be reachable from the visitor's browser. |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google sign-in client ID. The current root layout requires this value, including during production builds. |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud used by course image components. |

These `NEXT_PUBLIC_` values are browser-visible configuration and are inlined at build time, so rebuild or redeploy after changing them. Do not put a Google client secret, Cloudinary API secret, database password, or JWT signing secret in them.

The backend must allow requests from the frontend origin, including the public home page, which calls `GET /api/courses` from the browser. Google sign-in must also be configured for the origin where the frontend runs.

The live demo is hosted on Vercel. Add the same three variables in the Vercel project settings before deploying.

### 3. Start development

```bash
npm run dev
```

Open [localhost:3000](http://localhost:3000).

### 4. Run checks and build

```bash
npm run lint
npm run typecheck
npm run build
npm start
```

Set the required environment values before building. `npm start` serves an existing production build.

## Available Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Check TypeScript without emitting JavaScript |

The repository currently has no automated unit or end-to-end test suite. Lint and type checking do not verify backend behavior or complete user journeys.

## Project Structure

```text
app/
├── layout.tsx                  # Root layout: Google OAuth and auth providers
├── page.tsx                    # Public home page (Server Component)
├── globals.css                 # Global styles
├── not-found.tsx               # Not-found screen
├── Login/                      # Sign in; reads ?email= to pre-fill the email field
├── Register/                   # Registration page (Server Component with SEO metadata)
├── context/
│   └── AuthContent.tsx         # Authentication and session store
├── components/
│   ├── AuthPanel.tsx           # Shared split-screen layout for auth pages
│   ├── BackendStatus.tsx       # Backend health indicator
│   ├── GitHubLink.tsx          # Source-code link button
│   ├── GoogleAuthButton.tsx    # Google sign-in / sign-up button
│   ├── RegisterForm.tsx        # Two-step registration form (Client Component)
│   ├── home/                   # Home page building blocks
│   │   ├── CourseDataProvider.tsx  # Fetches /api/courses once and shares it via context
│   │   ├── CoursePreview.tsx       # Hero preview with backend connection badge
│   │   ├── CourseCards.tsx         # Catalog cards, skeletons, and empty state
│   │   ├── CourseStats.tsx         # Course and instructor counts
│   │   └── HomeIcons.tsx
│   └── learner/SideBar.tsx
├── Learner/
│   ├── Dashboard/
│   ├── Explore/
│   ├── My-Courses/
│   ├── My-Account/
│   └── Courses/[id]/
│       └── Learn/
├── Instructor/
│   ├── Dashboard/
│   └── Courses/
│       ├── Create/
│       └── [id]/
│           └── Lessons/Create/
└── AdminMaster/
    ├── page.tsx                # Admin dashboard
    ├── Users/
    ├── Instructors/
    └── Courses/
        └── [id]/
public/
└── Vishwam_Patel_Resume.pdf    # Resume download linked from the home page header
```

### Routes

Route names follow the directory casing shown above.

| Area | Route | Page |
| --- | --- | --- |
| Public | `/` | Home page with live catalog preview |
| | `/Login` | Sign in with email and password or Google |
| | `/Register` | Two-step registration |
| Learner | `/Learner/Dashboard` | Progress overview, recommendations, and weekly activity |
| | `/Learner/Explore` | Course catalog with search, filters, and sorting |
| | `/Learner/Courses/[id]` | Course details and enrollment |
| | `/Learner/Courses/[id]/Learn` | Lesson player |
| | `/Learner/My-Courses` | Enrolled courses |
| | `/Learner/My-Account` | Profile, password, and account deletion |
| Instructor | `/Instructor/Dashboard` | Course, lesson, and student statistics |
| | `/Instructor/Courses` | The instructor's courses |
| | `/Instructor/Courses/Create` | Create a course |
| | `/Instructor/Courses/[id]` | Course details, editing, and lessons |
| | `/Instructor/Courses/[id]/Lessons/Create` | Add a lesson |
| Admin | `/AdminMaster` | Platform statistics |
| | `/AdminMaster/Users` | Manage users and roles |
| | `/AdminMaster/Instructors` | Review instructor applications |
| | `/AdminMaster/Courses` | Browse and manage courses |
| | `/AdminMaster/Courses/[id]` | Course details and lessons |

## Authentication and Access

Email/password and Google sign-in send authentication requests to the backend. Successful responses provide a token and user record, stored in localStorage. Protected requests include the token in an `Authorization: Bearer <token>` header.

The auth provider restores saved sessions, clears malformed JSON session data, and subscribes to storage changes across tabs. Its own session helpers also notify subscribers in the current tab.

### Registration and login flow

1. **Details:** choose Learner or Instructor, then enter first name, last name, and email. The Admin option shows a notice that administrator accounts cannot be created from this page.
2. **Password:** choose a password with at least 8 characters, an uppercase letter, a lowercase letter, a number, and a special character, then agree to the terms. A strength meter shows Weak, Fair, Good, or Strong.
3. **Success:** the backend's confirmation message is shown, and after about two seconds the app redirects to `/Login?email=<address>`. The login page reads the `email` query parameter, fills in the email field, and focuses the password field.

Google sign-up from the registration page is for learner accounts and opens the Learner dashboard.

### Role-based redirects

Login redirects users according to their role:

| Role | Destination or behavior |
| --- | --- |
| Student | Learner dashboard |
| Approved instructor | Instructor dashboard |
| Pending or rejected instructor | Login shows an explanatory message and clears the session |
| Admin | Admin dashboard |

Public registration supports learner and instructor accounts. The registration interface indicates that administrator accounts cannot be created there. The backend must enforce account creation rules and permissions; client-side role checks only control the interface.

## Learning Flow

```text
Register / Sign in
        ↓
Explore courses → View course details → Enroll
                                         ↓
                                    My Courses
                                         ↓
                              Open the lesson player
                                         ↓
                           Save completion and continue
                                         ↓
                            View updated course progress
```

The lesson player requests course lessons and progress from the backend, then selects the next lesson returned by that API. The Next Lesson or Complete Course action marks the current lesson complete before advancing or returning to My Courses.

Enrollment and completion depend on backend responses. The current player resumes by lesson, not by a saved playback timestamp. Its “through course” indicator reflects the selected lesson's position; completion percentages on the dashboard and My Courses come from the backend.

## API Integration

| API area | Frontend usage |
| --- | --- |
| `/api/auth` | Registration, login, Google authentication, profile, password, and account operations |
| `/api/health` | Backend availability check |
| `/api/courses` | Public course catalog (home page preview and course browsing), course details, and protected lessons |
| `/api/categories` | Categories for instructor course forms |
| `/api/enrollment` | Enrollment, enrolled courses, and lesson/course progress |
| `/api/dashboard` | Learner dashboard |
| `/api/instructor` | Instructor dashboard, courses, and lessons |
| `/api/admin` | Platform statistics, user roles, instructor approvals, courses, and lessons |

See the [backend repository](https://github.com/Vishwam27/LMS-PROJECT-BACKEND) for the server implementation and setup.

## Author

**Vishwam Patel** — Computer Engineering Graduate and Full-Stack Developer.

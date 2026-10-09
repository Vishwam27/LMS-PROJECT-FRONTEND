# CourseMaster LMS — Frontend

A learning management system frontend built with **Next.js, React, TypeScript, and Tailwind CSS**. CourseMaster provides separate experiences for learners, instructors, and administrators, with REST API integration for authentication, courses, enrollment, and learning progress.

[Live Demo](https://coursemasterlms.vercel.app/) · [Frontend Repository](https://github.com/Vishwam27/LMS-PROJECT-FRONTEND) · [Backend Repository](https://github.com/Vishwam27/LMS-PROJECT-BACKEND)

## Features

### Learners

- Register with email and password or sign in with Google.
- Browse courses and filter by category, level, and search text.
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
- Backend availability indicator on the login page.
- Custom not-found page.

## Tech Stack

| Area | Implementation |
| --- | --- |
| Framework | Next.js 16 with the App Router |
| UI | React 19 |
| Language | TypeScript 6 with strict checking |
| Styling | Tailwind CSS 4 and PostCSS |
| Icons | Lucide React |
| Authentication UI | React Context and `@react-oauth/google` |
| Session state | Browser localStorage and `useSyncExternalStore` |
| API requests | Native Fetch API |
| Forms | React state and client-side validation |
| Images | `next-cloudinary` and `next/image` |
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
| `NEXT_PUBLIC_API_URL` | Backend origin, without a trailing slash. The frontend appends paths such as `/api/auth/login`. |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google sign-in client ID. The current root layout requires this value, including during production builds. |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud used by course image components. |

These `NEXT_PUBLIC_` values are browser-visible configuration. Do not put a Google client secret, Cloudinary API secret, database password, or JWT signing secret in them.

The backend must allow requests from the frontend origin. Google sign-in must also be configured for the origin where the frontend runs.

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
├── layout.tsx                  # Root layout and authentication providers
├── page.tsx                    # Public homepage and course catalog preview
├── globals.css                 # Global styles
├── not-found.tsx               # Not-found screen
├── Login/
├── Register/
├── context/
│   └── AuthContent.tsx          # Authentication and session store
├── components/
│   ├── AuthPanel.tsx
│   ├── BackendStatus.tsx
│   ├── GoogleAuthButton.tsx
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
```

Route names follow the directory casing shown above, for example `/Login`, `/Learner/Dashboard`, and `/Instructor/Courses`.

## Authentication and Access

Email/password and Google sign-in send authentication requests to the backend. Successful responses provide a token and user record, stored in localStorage. Protected requests include the token in an `Authorization: Bearer <token>` header.

The auth provider restores saved sessions, clears malformed JSON session data, and subscribes to storage changes across tabs. Its own session helpers also notify subscribers in the current tab.

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
| `/api/courses` | Public course catalog, course details, and protected lessons |
| `/api/categories` | Categories for instructor course forms |
| `/api/enrollment` | Enrollment, enrolled courses, and lesson/course progress |
| `/api/dashboard` | Learner dashboard |
| `/api/instructor` | Instructor dashboard, courses, and lessons |
| `/api/admin` | Platform statistics, user roles, instructor approvals, courses, and lessons |

See the [backend repository](https://github.com/Vishwam27/LMS-PROJECT-BACKEND) for the server implementation and setup.
## Author

**Vishwam Patel** — Computer Engineering Graduate and Full-Stack Developer.

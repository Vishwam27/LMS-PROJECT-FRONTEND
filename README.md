# 🎓 CourseMaster LMS — Frontend

A modern, full-stack **Learning Management System (LMS)** frontend built with **Next.js, React, TypeScript, and Tailwind CSS**.

CourseMaster provides separate experiences for **Students, Instructors, and Administrators**, with real backend integration for authentication, course management, enrollment, lesson delivery, and learning-progress tracking.

> **Backend Repository:** [LMS-PROJECT-BACKEND](https://github.com/Vishwam27/LMS-PROJECT-BACKEND)

---

## 🚀 Live Demo

**Frontend:** https://coursemasterlms.vercel.app/

---

## ✨ Features

- 🔐 JWT authentication
- 🔑 Google OAuth authentication
- 👥 Role-based access control
- 🎓 Student dashboard
- 👨‍🏫 Instructor dashboard
- 🛡️ Admin dashboard
- 📚 Course discovery and filtering
- 🔎 Course search
- 📖 Course details
- 📝 Course enrollment
- 🎥 Lesson/video learning
- ✅ Lesson completion tracking
- 📈 Course progress tracking
- 👨‍🏫 Instructor course management
- 📚 Lesson management
- 🧑‍💼 Instructor approval workflow
- 👤 User management
- ☁️ Cloudinary media integration
- 📱 Responsive design
- 🌐 Production deployment with Vercel

---

# 👤 User Roles

## 🎓 Student / Learner

Students can:

- Register an account
- Login with email and password
- Login with Google
- Explore available courses
- Search courses
- Filter courses
- View course details
- Enroll in courses
- View enrolled courses
- Open course lessons
- Watch course videos
- Mark lessons as completed
- Track course progress
- Manage their profile and settings

---

## 👨‍🏫 Instructor

Approved instructors can:

- Access an instructor dashboard
- View course statistics
- Create courses
- Edit courses
- Delete courses
- Publish/unpublish courses
- Add lessons
- Edit lessons
- Delete lessons
- Manage course content
- View course-related statistics

Instructor registration follows an approval workflow controlled by administrators.

---

## 🛡️ Administrator

Administrators can:

- View platform statistics
- Manage users
- Manage courses
- Manage instructors
- View pending instructor applications
- Approve instructors
- Reject instructors
- Manage courses and lessons

---

# 📚 Main Learning Flow

```text
Register / Login
       ↓
Explore Courses
       ↓
Course Details
       ↓
     Enroll
       ↓
  My Courses
       ↓
   Learn Course
       ↓
Watch Lessons
       ↓
Complete Lesson
       ↓
Track Progress
```

The frontend communicates with the backend through REST APIs while authentication and application state are handled by the frontend.

---

# 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 16 |
| UI Library | React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Authentication | JWT + Google OAuth |
| API | REST API |
| Data Fetching | TanStack React Query |
| Forms | React Hook Form |
| Media | Cloudinary |
| Cloudinary Integration | next-cloudinary |
| Icons | Lucide React |
| Backend | Node.js + Express |
| Database | PostgreSQL |
| ORM | Prisma |
| Frontend Deployment | Vercel |

---

# 🏗️ Application Architecture

CourseMaster uses a separated frontend and backend architecture.

```text
                        ┌──────────────────────┐
                        │    Next.js Frontend  │
                        │                      │
                        │  Student             │
                        │  Instructor          │
                        │  Admin               │
                        └──────────┬───────────┘
                                   │
                                   │ REST API
                                   ▼
                        ┌──────────────────────┐
                        │    Express Backend   │
                        │                      │
                        │ Authentication       │
                        │ Courses              │
                        │ Enrollment           │
                        │ Lessons              │
                        │ Progress             │
                        │ Instructor           │
                        │ Admin                │
                        └──────────┬───────────┘
                                   │
                                   ▼
                        ┌──────────────────────┐
                        │ PostgreSQL + Prisma  │
                        └──────────────────────┘

                                   │
                                   ▼

                        ┌──────────────────────┐
                        │      Cloudinary      │
                        │   Images / Videos    │
                        └──────────────────────┘
```

---

# 📁 Project Structure

```text
LMS-PROJECT-FRONTEND/
│
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── not-found.tsx
│   │
│   ├── context/
│   │   └── AuthContent.tsx
│   │
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   └── RegisterPage.tsx
│   │
│   ├── components/
│   │   ├── AuthPanel.tsx
│   │   └── learner/
│   │       └── SideBar.tsx
│   │
│   ├── Learner/
│   │   ├── Explore/
│   │   ├── Courses/
│   │   └── My-Courses/
│   │
│   ├── Instructor/
│   │   ├── Dashboard/
│   │   └── Courses/
│   │
│   └── AdminMaster/
│       ├── Users/
│       ├── Courses/
│       └── Instructors/
│
├── public/
├── package.json
├── next.config.ts
├── postcss.config.mjs
├── tsconfig.json
└── README.md
```

---

# 🔐 Authentication

CourseMaster supports both traditional authentication and Google OAuth.

## Email / Password

```text
Register
   ↓
Backend validates user information
   ↓
Password is securely processed
   ↓
User account created
   ↓
Login
   ↓
JWT generated
   ↓
Frontend stores authentication state
```

## Google OAuth

```text
Google Sign-In
      ↓
Google OAuth
      ↓
Backend verifies identity
      ↓
User created / authenticated
      ↓
JWT generated
      ↓
Authenticated application
```

Google-authenticated users can enter the platform without creating a separate local password.

---

# 📡 Backend API Integration

The frontend consumes the CourseMaster Express REST API.

Main API areas include:

| Endpoint Area | Purpose |
|---|---|
| `/api/auth` | Registration, login, authentication and profile |
| `/api/courses` | Course listing and course details |
| `/api/categories` | Course categories |
| `/api/enrollment` | Enrollment and learning progress |
| `/api/dashboard` | Dashboard information |
| `/api/instructor` | Instructor operations |
| `/api/admin` | Administrative operations |

Protected requests use JWT authentication:

```http
Authorization: Bearer <JWT_TOKEN>
```

The backend contains the complete business logic, database operations, authorization, and validation.

---

# 📈 Learning Progress

CourseMaster uses backend-persisted learning progress rather than relying only on frontend state.

Example workflow:

```text
Student opens course
        ↓
Frontend requests lessons
        ↓
Student watches lesson
        ↓
Student clicks "Complete Lesson"
        ↓
Frontend sends progress request
        ↓
Backend updates LessonProgress
        ↓
Course progress recalculated
        ↓
Updated progress shown in UI
```

This allows learning progress to persist between sessions.

---

# 📝 Course Enrollment

The enrollment process works through the backend database.

```text
Student
   ↓
Select Course
   ↓
Click "Enroll Now"
   ↓
Enrollment API
   ↓
Enrollment stored in PostgreSQL
   ↓
Course appears in My Courses
```

This creates a real relationship between the authenticated user and the selected course.

---

# 🎥 Video & Media

CourseMaster uses **Cloudinary** for media management.

Cloudinary is used for:

- Course images
- Instructor images
- Lesson videos
- Other uploaded media

The application uses `next-cloudinary` where appropriate for optimized media rendering.

---

# 🎨 UI Design

The application uses a modern LMS/SaaS-style interface with a custom navy and violet design system.

### Brand Colors

```text
Navy 950   #080c1e
Navy 900   #0f1428
Navy 800   #161d3a
Violet 600 #6c3bff
Violet 400 #a880ff
Slate 50   #f8fafc
```

The UI focuses on:

- Clean layouts
- Consistent spacing
- Responsive components
- Clear navigation
- Dashboard-style interfaces
- Modern course cards
- Responsive sidebar navigation
- Mobile-friendly interactions

---

# 📱 Responsive Design

CourseMaster is designed for:

- 💻 Desktop
- 💻 Laptop
- 📱 Tablet
- 📱 Mobile

Responsive behavior includes:

- Mobile sidebar
- Responsive navigation
- Adaptive course grids
- Mobile-friendly dashboards
- Responsive course-learning pages

---

# 🔒 Security

The project follows several application-level security practices:

- JWT-based authentication
- Backend role-based authorization
- Password hashing with bcrypt
- Protected API endpoints
- Google OAuth verification
- API rate limiting on the backend
- Environment variables for sensitive configuration
- No secrets committed to the repository

> Never commit `.env.local`, database credentials, JWT secrets, API keys, or private OAuth credentials.

---

# ⚙️ Getting Started

## Prerequisites

Before running the project, make sure you have:

- Node.js 20+
- npm
- CourseMaster backend running locally or deployed
- PostgreSQL configured through the backend
- Cloudinary account
- Google OAuth credentials if Google login is enabled

---

## 1. Clone the Repository

```bash
git clone https://github.com/Vishwam27/LMS-PROJECT-FRONTEND.git
```

Go to the project:

```bash
cd LMS-PROJECT-FRONTEND
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Configure Environment Variables

Create:

```text
.env.local
```

Example:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

For production, replace the local backend URL with the deployed backend URL.

---

## 4. Run the Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

---

# 🔗 Backend Repository

## CourseMaster LMS — Backend

https://github.com/Vishwam27/LMS-PROJECT-BACKEND

The backend handles:

- Express REST APIs
- Prisma ORM
- PostgreSQL
- JWT authentication
- Google OAuth
- Role-based access control
- User management
- Course management
- Lesson management
- Enrollment
- Learning progress
- Instructor approval
- Admin operations
- Cloudinary integration

---

# 🗄️ Database

The backend uses **PostgreSQL** with **Prisma ORM**.

The LMS includes relationships between:

```text
User
 │
 ├── Enrollment
 │        │
 │        └── Course
 │               │
 │               └── Lesson
 │
 └── LessonProgress
```

This allows the system to represent real learning relationships instead of relying on hard-coded frontend data.

---

# 🎯 Project Goals

CourseMaster was built as a practical full-stack portfolio project to demonstrate experience with:

- Next.js application development
- React component architecture
- TypeScript
- REST API integration
- Authentication
- Authorization
- Role-based systems
- PostgreSQL
- Prisma
- CRUD operations
- Course enrollment workflows
- Learning progress tracking
- Cloud media integration
- Responsive UI
- Frontend/backend separation
- Production deployment

---

# 👨‍💻 Author

## Vishwam Patel

**Computer Engineering Graduate | Full-Stack Developer**

### Technologies

```text
Next.js
React
TypeScript
Node.js
Express
PostgreSQL
Prisma
Cloudinary
```

import type { Metadata } from "next";
import AuthPanel from "../components/AuthPanel";
import GitHubLink from "../components/GitHubLink";
import RegisterForm from "../components/RegisterForm";

const title = "Create Your Account | CourseMaster";
const description =
  "Create your CourseMaster account to explore online courses, learn practical skills, track your progress, or apply to become an instructor.";
const registerUrl = "https://coursemasterlms.vercel.app/Register";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: registerUrl,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title,
    description,
    url: registerUrl,
    siteName: "CourseMaster",
    type: "website",
  },
  twitter: {
    card: "summary",
    title,
    description,
  },
};

export default function RegisterPage() {
  return (
    <AuthPanel>
      <RegisterForm />
      <div className="mt-6 flex justify-center">
        <GitHubLink href="https://github.com/Vishwam27/LMS-PROJECT-FRONTEND.git" />
      </div>
    </AuthPanel>
  );
}

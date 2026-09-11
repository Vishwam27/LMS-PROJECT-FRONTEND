import "./globals.css";
import { AuthProvider } from "./context/AuthContent";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const googleClientId =
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!googleClientId) {
    throw new Error(
      "NEXT_PUBLIC_GOOGLE_CLIENT_ID is missing in .env.local"
    );
  }

  return (
    <html lang="en">
      <body className="antialiased">
        <GoogleOAuthProvider clientId={googleClientId}>
          <AuthProvider>
            {children}
          </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { BalanceProvider } from "@/context/BalanceContext";
import { GoogleOAuthProvider } from '@react-oauth/google';

import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Smart Finance Manager",
  description: "Advanced full-stack financial management PWA",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.png",
    apple: "/icons/icon-192x192.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Finance Manager",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen antialiased`}>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
          <ThemeProvider>
            <AuthProvider>
              <BalanceProvider>
                <Toaster
                  position="bottom-right"
                  toastOptions={{
                    style: { background: '#1e293b', color: '#fff', borderRadius: '12px' }
                  }}
                />
                {children}
              </BalanceProvider>
            </AuthProvider>
          </ThemeProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}

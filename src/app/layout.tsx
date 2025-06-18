import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Course Scheduler",
  description: "A mobile-responsive course scheduler application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider defaultTheme="light" forcedTheme="light">
          {children}
          <Toaster 
            position="top-right" 
            gutter={8}
            toastOptions={{
              duration: 3000,
              style: {
                background: '#F9FAFB',
                color: '#4B5563',
                border: '1px solid #E5E7EB',
                fontSize: '0.875rem',
              },
              success: {
                style: {
                  background: '#ECFDF5',
                  color: '#065F46',
                  border: '1px solid #D1FAE5',
                },
              },
              error: {
                style: {
                  background: '#FEF2F2',
                  color: '#B91C1C',
                  border: '1px solid #FEE2E2',
                },
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}

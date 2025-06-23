import type { Metadata } from "next";
// Use local font optimization with next/font
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
  title: "Termwise | Carleton Course Scheduler",
  description: "Termwise is a course scheduler built for Carleton students that automatically creates your perfect timetable based on your preferences. Just input your courses and time constraints, and let Termwise handle the rest.",  
  icons: {
    icon: './favicon.ico',
  },  openGraph: {
    title: "Termwise | Carleton Course Scheduler",
    description: "Termwise is a course scheduler built for Carleton students that automatically creates your perfect timetable based on your preferences. Just input your courses and time constraints, and let Termwise handle the rest.",
    images: [{ url: '/og-termwise.png', width: 256, height: 256, alt: "Yellow rubber duck" }],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Termwise | Carleton Course Scheduler",
    description: "Termwise is a course scheduler built for Carleton students that automatically creates your perfect timetable based on your preferences. Just input your courses and time constraints, and let Termwise handle the rest.",
    images: ['/og-termwise.png'],
  },
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
        <ThemeProvider>
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

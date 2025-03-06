import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from 'next/headers';
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { ToastProvider } from '@/components/ui/toast-provider';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Curiosity Manager - Embrace Your ADHD Superpowers",
  description: "A flexible, guilt-free productivity tool that embraces curiosity-driven workflows for ADHD/neurodivergent adults.",
  keywords: ["ADHD", "productivity", "task management", "neurodivergent", "time management"],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get the current pathname from headers - properly awaited
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';
  
  // More robust path detection - check for dashboard path segments
  const isDashboardPath = 
    pathname.startsWith('/dashboard') || 
    pathname.includes('/dashboard/') || 
    pathname === '/dashboard';

  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen bg-neutral-50 font-sans antialiased">
        <ToastProvider>
          {/* Only show Navbar on non-dashboard pages */}
          {!isDashboardPath && <Navbar />}
          <main className={`flex min-h-screen flex-col ${isDashboardPath ? 'p-0' : 'items-center justify-between'}`}>
            {children}
          </main>
        </ToastProvider>
        
        {/* Add client-side script to ensure dashboard pages don't show the navbar */}
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              // Check if we're on a dashboard page
              if (window.location.pathname.startsWith('/dashboard')) {
                // Find and hide any navbar that might have been rendered
                const navbar = document.querySelector('header.fixed');
                if (navbar) navbar.style.display = 'none';
              }
            })();
          `
        }} />
      </body>
    </html>
  );
}

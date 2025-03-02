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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get the current pathname from headers
  const headersList = headers();
  const pathname = headersList.get('x-pathname') || '';
  const isDashboardPath = pathname.startsWith('/dashboard');

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
      </body>
    </html>
  );
}

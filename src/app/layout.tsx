
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { BottomNav } from '@/components/bottom-nav';
import { AuthProvider } from '@/hooks/use-auth';

export const metadata: Metadata = {
  title: 'Swalath Tracker',
  description: 'Track your daily swalaths (Islamic prayers).',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head suppressHydrationWarning>
        <link rel="icon" href="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3e%3cpath fill='%231f2937' d='M50 90 A40 40 0 0 1 10 50 L10 50 L15 50 A35 35 0 0 0 50 85 A35 35 0 0 0 85 50 L90 50 A40 40 0 0 1 50 90 Z M50 10 L60 25 L75 25 L65 40 L75 55 L60 55 L50 70 L40 55 L25 55 L35 40 L25 25 L40 25 Z' stroke='%231f2937' stroke-width='3'/%3e%3c/svg%3e" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:wght@400;700&family=PT+Sans:wght@400;700&family=Noto+Naskh+Arabic:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        <AuthProvider>
          <div className="pb-20">
            {children}
          </div>
          <BottomNav />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}

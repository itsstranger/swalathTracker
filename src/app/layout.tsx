
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
    <html lang="en" suppressHydrationWarning className="dark">
      <head suppressHydrationWarning>
        <link rel="icon" href="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3e%3cg fill='hsl(221 83% 53%)'%3e%3cpath fill-rule='evenodd' clip-rule='evenodd' d='M50 38.79l-4.2-4.2a1.5 1.5 0 00-2.12 0L32.8 45.47a1.5 1.5 0 000 2.12l10.88 10.88a1.5 1.5 0 002.12 0l10.88-10.88a1.5 1.5 0 000-2.12L50 38.79z' fill='hsl(221 83% 63%)'/%3e%3cpath d='M50 5.86a4.5 4.5 0 00-3.18 1.32L29.1 24.9a4.5 4.5 0 00-1.32 3.18V50a4.5 4.5 0 001.32 3.18l17.72 17.72a4.5 4.5 0 003.18 1.32H50a4.5 4.5 0 003.18-1.32L70.9 53.18a4.5 4.5 0 001.32-3.18V28.08a4.5 4.5 0 00-1.32-3.18L53.18 7.18A4.5 4.5 0 0050 5.86zm16.7 22.22V50a.5.5 0 01-.15.35L52.07 64.83a.5.5 0 01-.35.15H50a.5.5 0 01-.35-.15L33.42 50.35a.5.5 0 01-.15-.35V28.08a.5.5 0 01.15-.35L47.9 13.25a.5.5 0 01.35-.15H50a.5.5 0 01.35.15l16.22 14.48a.5.5 0 01.15.35z'/%3e%3cpath fill-rule='evenodd' clip-rule='evenodd' d='M32.8 20.33a4.5 4.5 0 00-3.18-1.32H28.08a4.5 4.5 0 00-3.18 1.32L7.18 38.05a4.5 4.5 0 00-1.32 3.18V50a4.5 4.5 0 001.32 3.18l17.72 17.72a4.5 4.5 0 003.18 1.32h1.54a4.5 4.5 0 003.18-1.32l17.72-17.72a4.5 4.5 0 001.32-3.18v-1.54a4.5 4.5 0 00-1.32-3.18L32.8 20.33zm-4.72 4.04l-14.48 16.2a.5.5 0 00-.15.36V50a.5.5 0 00.15.35l14.48 16.22a.5.5 0 00.35.15h1.54a.5.5 0 00.35-.15l16.22-14.48a.5.5 0 00.15-.35v-1.54a.5.5 0 00-.15-.35L28.43 24.52a.5.5 0 00-.35-.15zM79.67 32.8a4.5 4.5 0 00-1.32-3.18L60.63 20.33a4.5 4.5 0 00-3.18-1.32h-1.54a4.5 4.5 0 00-3.18 1.32L35.01 38.05a4.5 4.5 0 00-1.32 3.18V50a4.5 4.5 0 001.32 3.18l17.72 17.72a4.5 4.5 0 003.18 1.32h1.54a4.5 4.5 0 003.18-1.32L79.67 53.18A4.5 4.5 0 0081 50V41.23a4.5 4.5 0 00-1.33-3.18v-5.25zm-3.89 4.04l-16.22 14.48a.5.5 0 01-.35.15h-1.54a.5.5 0 01-.35-.15L40.9 52.07a.5.5 0 01-.15-.35V41.23c0-.13.05-.25.15-.35l14.48-16.22a.5.5 0 01.35-.15h1.54c.13 0 .25.05.35.15l16.2 14.48a.5.5 0 01.15.35V50a.5.5 0 01-.15.35l-14.48 16.2a.5.5 0 01-.35-.15z' fill='hsl(221 83% 43%)'/%3e%3c/g%3e%3c/svg%3e" />
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

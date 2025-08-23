
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
        <link rel="icon" href="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3e%3ccircle cx='50' cy='50' r='50' fill='hsl(221 83% 53%)'/%3e%3cpath fill='white' d='M50 39.3a1.9 1.9 0 00-1.2.5l-1.9 1.9-1.9-1.9a1.9 1.9 0 00-2.4 0l-1.9 1.9-1.9-1.9a1.9 1.9 0 00-2.4 0l-1.9 1.9-1.9-1.9a1.9 1.9 0 00-2.4 0l-1.9 1.9-1.9-1.9a1.9 1.9 0 00-2.4 0L50 60.7a1.9 1.9 0 002.4 0l1.9-1.9 1.9 1.9a1.9 1.9 0 002.4 0l1.9-1.9 1.9 1.9a1.9 1.9 0 002.4 0l1.9-1.9 1.9 1.9a1.9 1.9 0 002.4 0l1.9-1.9 1.9 1.9a1.9 1.9 0 002.4 0l1.9-1.9-1.9 1.9-1.9-1.9a1.9 1.9 0 00-2.4 0l-1.9 1.9-1.9-1.9a1.9 1.9 0 00-2.4 0l-1.9 1.9-1.9-1.9a1.9 1.9 0 00-2.4 0l-1.9 1.9-1.9-1.9a1.9 1.9 0 00-2.4 0L50 60.7a1.9 1.9 0 002.4 0l1.9-1.9 1.9 1.9a1.9 1.9 0 002.4 0l1.9-1.9 1.9 1.9a1.9 1.9 0 002.4 0l1.9-1.9 1.9 1.9a1.9 1.9 0 002.4 0l1.9-1.9-1.9 1.9a1.9 1.9 0 002.4 0l1.9-1.9-1.9 1.9a1.9 1.9 0 002.4 0l1.9-1.9 1.9 1.9a1.9 1.9 0 002.4 0l1.9-1.9-1.9 1.9a1.9 1.9 0 002.4 0l1.9-1.9 1.9 1.9a1.9 1.9 0 002.4 0L50 39.3a1.9 1.9 0 00-1.2-.5zm14.5 2.1c.3 0 .6.1.8.3l3.5 3.5c.5.5.5 1.2 0 1.7l-3.5 3.5c-.5.5-1.2.5-1.7 0l-3.5-3.5c-.5-.5-.5-1.2 0-1.7l3.5-3.5c.2-.2.5-.3.9-.3zm-29 0c.3 0 .6.1.8.3l3.5 3.5c.5.5.5 1.2 0 1.7l-3.5 3.5c-.5.5-1.2.5-1.7 0l-3.5-3.5c-.5-.5-.5-1.2 0-1.7l3.5-3.5c.2-.2.5-.3.9-.3zM50 20.3c-2.3 0-4.5.9-6.2 2.6l-8.8 8.8c-3.4 3.4-3.4 9 0 12.4l8.8 8.8c1.7 1.7 3.9 2.6 6.2 2.6s4.5-.9 6.2-2.6l8.8-8.8c3.4-3.4 3.4-9 0-12.4l-8.8-8.8c-1.7-1.7-3.9-2.6-6.2-2.6zm0 4.6c1.2 0 2.4.5 3.3 1.4l8.8 8.8c1.8 1.8 1.8 4.8 0 6.6l-8.8 8.8c-1.8 1.8-4.8 1.8-6.6 0l-8.8-8.8c-1.8-1.8-1.8-4.8 0-6.6l8.8-8.8c.9-.9 2.1-1.4 3.3-1.4z'/%3e%3c/svg%3e" />
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

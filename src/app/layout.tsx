
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
        <link rel="icon" href="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3e%3cpath fill='%235A9216' d='M50 10 C 27.9 10 10 27.9 10 50 L 10 90 L 50 90 Z'/%3e%3c/svg%3e" />
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


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
        <link rel="icon" href="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3e%3cpath fill='%232162e3' d='M50 0l12 12-20 20 8 8 20-20 12 12V0H50zm0 100l12-12-20-20 8-8 20 20 12-12V100H50zM0 50l12-12 20 20-8 8-20-20-12 12H0zm100 50l-12-12 20-20-8-8-20 20-12-12h28v28z'/%3e%3c/svg%3e" />
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

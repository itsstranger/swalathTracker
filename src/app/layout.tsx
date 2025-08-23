
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
        <link rel="icon" href="data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3e%3cpath fill='%232162e3' d='M50 0L58.78 18.27L78.53 21.47L64.27 35.73L67.56 55.45L50 46.22L32.44 55.45L35.73 35.73L21.47 21.47L41.22 18.27L50 0ZM50 100L41.22 81.73L21.47 78.53L35.73 64.27L32.44 44.55L50 53.78L67.56 44.55L64.27 64.27L78.53 78.53L58.78 81.73L50 100ZM18.27 41.22L0 50L18.27 58.78L21.47 78.53L35.73 64.27L55.45 67.56L46.22 50L55.45 32.44L35.73 35.73L21.47 21.47L18.27 41.22ZM81.73 58.78L100 50L81.73 41.22L78.53 21.47L64.27 35.73L44.55 32.44L53.78 50L44.55 67.56L64.27 64.27L78.53 78.53L81.73 58.78Z'/%3e%3c/svg%3e" />
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

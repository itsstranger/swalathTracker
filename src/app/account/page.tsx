// src/app/account/page.tsx
'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/header';

export default function AccountPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <p>Loading...</p>
        </div>
    );
  }

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <main className="min-h-screen bg-background text-foreground font-body">
        <div className="container mx-auto p-4 md:p-6">
            <Header />
            <div className="mt-6 flex justify-center">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">My Account</CardTitle>
                        <CardDescription>Manage your account information.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex flex-col items-center space-y-4">
                            <Avatar className="w-24 h-24">
                                <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                                <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
                            </Avatar>
                            <div className="text-center">
                                <p className="text-xl font-semibold">{user.displayName || 'Anonymous User'}</p>
                                <p className="text-muted-foreground">{user.email}</p>
                            </div>
                        </div>
                        <Button onClick={logout} variant="destructive" className="w-full">
                            Logout
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    </main>
  );
}

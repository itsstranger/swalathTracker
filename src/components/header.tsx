// src/components/header.tsx
'use client';

import type { FC } from 'react';
import { Bell, Cog, LogIn, LogOut, User } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Skeleton } from './ui/skeleton';

export const Header: FC = () => {
  const { user, loading, logout } = useAuth();

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <header className="flex justify-between items-center">
      <Link href="/" passHref>
        <h1 className="text-3xl md:text-4xl font-bold font-headline text-foreground cursor-pointer">
          Swalath
        </h1>
      </Link>
      
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-6 w-6" />
          <span className="sr-only">Notifications</span>
        </Button>

        {loading ? (
          <Skeleton className="h-10 w-10 rounded-full" />
        ) : user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar>
                  <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                  <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href="/account" passHref>
                <DropdownMenuItem>
                  <User className="mr-2" />
                  Profile
                </DropdownMenuItem>
              </Link>
               <Link href="/settings" passHref>
                <DropdownMenuItem>
                  <Cog className="mr-2" />
                  Settings
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/login" passHref>
            <Button>
              <LogIn className="mr-2" />
              Login
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
};

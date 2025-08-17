import { Bell } from 'lucide-react';
import type { FC } from 'react';
import { Button } from '@/components/ui/button';

export const Header: FC = () => {
  return (
    <header className="flex justify-between items-center">
      <h1 className="text-3xl md:text-4xl font-bold font-headline text-foreground">
        Swalath
      </h1>
      <Button variant="ghost" size="icon" className="rounded-full">
        <Bell className="h-6 w-6" />
        <span className="sr-only">Notifications</span>
      </Button>
    </header>
  );
};

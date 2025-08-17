import { MoonStar } from 'lucide-react';
import type { FC } from 'react';

export const Header: FC = () => {
  return (
    <header className="text-center">
      <div className="inline-flex items-center gap-3">
        <MoonStar className="h-8 w-8 text-primary" />
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">
          Swalath Tracker
        </h1>
      </div>
      <p className="mt-2 text-lg text-muted-foreground">
        A simple way to track your daily prayers and reflections.
      </p>
    </header>
  );
};

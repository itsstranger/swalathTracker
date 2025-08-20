// src/app/settings/page.tsx
import { Header } from '@/components/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Cog } from 'lucide-react';

export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground font-body">
      <div className="container mx-auto p-4 md:p-6">
        <Header />
        <div className="mt-6 flex justify-center">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                        <Cog />
                        Settings
                    </CardTitle>
                    <CardDescription>
                        Manage your application settings.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        More settings will be available here in the future.
                    </p>
                </CardContent>
            </Card>
        </div>
      </div>
    </main>
  );
}

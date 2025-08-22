// src/app/page.tsx
'use client';

import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BookOpen, Bot, Moon, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { DailyInsight } from '@/components/daily-insight';
import { useSwalathStore } from '@/hooks/use-swalath-store';

export default function Home() {
  const { entries } = useSwalathStore();
  const today = new Date().toISOString().split('T')[0];
  const todaysEntry = entries.find(e => e.id === today) || null;

  const dashboardItems = [
    {
      title: 'Prayers',
      description: 'Track your daily obligatory and voluntary prayers.',
      icon: <ShieldCheck className="w-8 h-8 text-primary" />,
      link: '/prayers'
    },
    {
      title: 'Quran',
      description: 'Log your daily Quran recitation and special Surahs.',
      icon: <BookOpen className="w-8 h-8 text-primary" />,
      link: '/quran'
    },
    {
      title: 'Duas',
      description: 'Mark your daily Duas and supplications.',
      icon: <Moon className="w-8 h-8 text-primary" />,
      link: '/duas'
    },
    {
      title: 'Swalath Counter',
      description: 'A simple counter to track total Swalaths for the day.',
      icon: <Bot className="w-8 h-8 text-primary" />,
      link: '/swalath'
    }
  ];

  return (
    <main className="min-h-screen bg-background text-foreground font-body">
      <div className="container mx-auto p-4 md:p-6">
        <Header />
        <div className="mt-6 space-y-6">
          <Card className="bg-primary/5">
            <CardHeader>
              <CardTitle className="text-2xl font-bold font-headline">Dashboard</CardTitle>
              <CardDescription>Your central hub for daily worship tracking.</CardDescription>
            </CardHeader>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dashboardItems.map((item) => (
              <Link href={item.link} key={item.title} passHref>
                <Card className="hover:bg-muted/50 transition-colors h-full">
                  <CardHeader className="flex flex-row items-center gap-4">
                    {item.icon}
                    <div>
                      <CardTitle>{item.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <DailyInsight entry={todaysEntry} />

        </div>
      </div>
    </main>
  );
}

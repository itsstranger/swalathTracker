// src/app/signup/page.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/header';

const formSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
    email: z.string().email({ message: 'Invalid email address.' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

export default function SignupPage() {
  const { signup, user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await signup(values.email, values.password, values.name);
      router.push('/');
    } catch (error: any) {
      toast({
        title: 'Signup Failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground font-body">
        <div className="container mx-auto p-4 md:p-6">
            <Header />
            <div className="flex justify-center items-center mt-6">
              <Card className="w-full max-w-sm">
                <CardHeader>
                  <CardTitle className="text-2xl">Sign Up</CardTitle>
                  <CardDescription>
                    Create an account to save and sync your data.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                <Input placeholder="Your Name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                <Input placeholder="m@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                      />
                      <Button type="submit" className="w-full">
                        Create Account
                      </Button>
                    </form>
                  </Form>
                </CardContent>
                <CardFooter className="text-sm">
                  <p>
                    Already have an account?{' '}
                    <Link href="/login" className="underline">
                      Login
                    </Link>
                  </p>
                </CardFooter>
              </Card>
            </div>
        </div>
    </main>
  );
}

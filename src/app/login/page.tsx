// src/app/login/page.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

export default function LoginPage() {
  const { login, loginWithGoogle, user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  if (user) {
    router.push('/');
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await login(values.email, values.password);
      router.push('/');
    } catch (error: any) {
      toast({
        title: 'Login Failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await loginWithGoogle();
      router.push('/');
    } catch (error: any) {
      toast({
        title: 'Google Sign-In Failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground font-body">
        <div className="container mx-auto p-4 md:p-6">
            <Header />
            <div className="flex justify-center items-center mt-6">
              <Card className="w-full max-w-sm">
                <CardHeader>
                  <CardTitle className="text-2xl">Login</CardTitle>
                  <CardDescription>
                    Enter your email below to login to your account.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                        Login
                      </Button>
                    </form>
                  </Form>
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
                    Google
                  </Button>
                </CardContent>
                <CardFooter className="text-sm">
                  <p>
                    Don&apos;t have an account?{' '}
                    <Link href="/signup" className="underline">
                      Sign up
                    </Link>
                  </p>
                </CardFooter>
              </Card>
            </div>
        </div>
    </main>
  );
}

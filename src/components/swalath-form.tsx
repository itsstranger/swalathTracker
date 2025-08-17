'use client';

import type { FC } from 'react';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Bed,
  Moon,
  NotebookText,
  Save,
  Sigma,
  Sun,
  Sunrise,
  Sunset,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import type { SwalathEntry } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  fajrDuhr: z.number().min(0).default(0),
  duhrAsr: z.number().min(0).default(0),
  asrMaghrib: z.number().min(0).default(0),
  maghribIsha: z.number().min(0).default(0),
  ishaFajr: z.number().min(0).default(0),
  notes: z.string().optional().default(''),
});

type FormData = z.infer<typeof formSchema>;

interface SwalathFormProps {
  entry: SwalathEntry | null;
  onSave: (entry: SwalathEntry) => void;
}

const formFields: {
  name: keyof FormData;
  label: string;
  icon: React.ElementType;
}[] = [
  { name: 'fajrDuhr', label: 'Fajr - Duhr', icon: Sunrise },
  { name: 'duhrAsr', label: 'Duhr - Asr', icon: Sun },
  { name: 'asrMaghrib', label: 'Asr - Maghrib', icon: Sunset },
  { name: 'maghribIsha', label: 'Maghrib - Isha', icon: Moon },
  { name: 'ishaFajr', label: 'Isha - Fajr', icon: Bed },
];

export const SwalathForm: FC<SwalathFormProps> = ({ entry, onSave }) => {
  const { toast } = useToast();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: entry || formSchema.parse({}),
  });

  useEffect(() => {
    form.reset(entry || formSchema.parse({}));
  }, [entry, form]);

  const watchedValues = form.watch();
  const totalSwalaths = useMemo(() => {
    return Object.values(watchedValues).reduce(
      (acc, val) => (typeof val === 'number' ? acc + val : acc),
      0
    );
  }, [watchedValues]);

  const onSubmit = (values: FormData) => {
    const today = new Date().toISOString().split('T')[0];
    const newEntry: SwalathEntry = {
      id: today,
      ...values,
      total: totalSwalaths,
    };
    onSave(newEntry);
    toast({
      title: 'Entry Saved',
      description: `Your swalath count for today has been saved.`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Today's Entry</CardTitle>
        <CardDescription>
          Record the number of swalaths performed today.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              {formFields.map(({ name, label, icon: Icon }) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name as keyof FormData}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <span>{label}</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                           type="number"
                           min="0"
                           {...field}
                           value={field.value || ''}
                           onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <NotebookText className="h-4 w-4 text-muted-foreground" />
                    Notes/Reflections
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any thoughts or reflections for the day..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex items-center justify-between rounded-lg border bg-muted p-4">
                <div className="flex items-center gap-2 font-medium">
                    <Sigma className="h-5 w-5 text-primary" />
                    <span>Total Today</span>
                </div>
                <span className="text-2xl font-bold text-primary">{totalSwalaths}</span>
            </div>

          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              <Save className="mr-2 h-4 w-4" />
              Save Today's Entry
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

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
  X,
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
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import type { SwalathEntry } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

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
  onCancel: () => void;
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

export const SwalathForm: FC<SwalathFormProps> = ({ entry, onSave, onCancel }) => {
  const { toast } = useToast();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: entry || formSchema.parse({}),
  });

  const isEditing = !!entry;
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    form.reset(entry || formSchema.parse({}));
  }, [entry, form]);

  const watchedValues = form.watch();
  const totalSwalaths = useMemo(() => {
    const { notes, ...counts } = watchedValues;
    return Object.values(counts).reduce(
      (acc, val) => (typeof val === 'number' ? acc + val : acc),
      0
    );
  }, [watchedValues]);

  const onSubmit = (values: FormData) => {
    const entryId = entry?.id || today;
    const newEntry: SwalathEntry = {
      id: entryId,
      ...values,
      total: totalSwalaths,
    };
    onSave(newEntry);
    toast({
      title: 'Entry Saved',
      description: `Your swalath count for ${format(new Date(entryId), 'MMM d, yyyy')} has been saved.`,
    });
  };
  
  const handleCancel = () => {
    onCancel();
    form.reset(formSchema.parse({}));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="font-headline">{isEditing ? 'Edit Entry' : "Today's Entry"}</CardTitle>
            <CardDescription>
              {isEditing ? `Editing entry for ${format(new Date(entry.id), 'MMM d, yyyy')}` : 'Record the number of swalaths performed today.'}
            </CardDescription>
          </div>
          {isEditing && (
            <Button variant="ghost" size="icon" onClick={handleCancel}>
              <X />
              <span className="sr-only">Cancel Edit</span>
            </Button>
          )}
        </div>
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
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex items-center justify-between rounded-lg border bg-muted p-4">
                <div className="flex items-center gap-2 font-medium">
                    <Sigma className="h-5 w-5 text-primary" />
                    <span>Total</span>
                </div>
                <span className="text-2xl font-bold text-primary">{totalSwalaths}</span>
            </div>

          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              <Save className="mr-2 h-4 w-4" />
              {isEditing ? 'Update Entry' : "Save Today's Entry"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

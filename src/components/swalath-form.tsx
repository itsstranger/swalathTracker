
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

const getInitialValues = (entry: SwalathEntry | null): FormData => {
  return {
    fajrDuhr: entry?.fajrDuhr ?? 0,
    duhrAsr: entry?.duhrAsr ?? 0,
    asrMaghrib: entry?.asrMaghrib ?? 0,
    maghribIsha: entry?.maghribIsha ?? 0,
    ishaFajr: entry?.ishaFajr ?? 0,
    notes: entry?.notes ?? '',
  };
};

export const SwalathForm: FC<SwalathFormProps> = ({ entry, onSave, onCancel }) => {
  const { toast } = useToast();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: getInitialValues(entry),
  });

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    form.reset(getInitialValues(entry));
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full">
        <div className="space-y-6 pb-4">
          <div className="grid grid-cols-1 gap-4">
            {formFields.map(({ name, label, icon: Icon }) => (
              <FormField
                key={name}
                control={form.control}
                name={name as keyof FormData}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-muted-foreground">
                      <Icon className="h-4 w-4" />
                      <span>{label}</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        className="text-lg"
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value === '' ? 0 : parseInt(value, 10));
                        }}
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
                <FormLabel className="flex items-center gap-2 text-muted-foreground">
                  <NotebookText className="h-4 w-4" />
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
          
          <div className="flex items-center justify-between rounded-lg bg-muted p-4">
              <div className="flex items-center gap-2 font-medium">
                  <Sigma className="h-5 w-5 text-primary" />
                  <span>Total</span>
              </div>
              <span className="text-2xl font-bold text-primary">{totalSwalaths}</span>
          </div>
        </div>
        <div className="sticky bottom-0 bg-background py-6 flex gap-4">
            <Button type="button" variant="outline" className="w-full" onClick={onCancel}>
                Cancel
            </Button>
            <Button type="submit" className="w-full">
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
        </div>
      </form>
    </Form>
  );
};

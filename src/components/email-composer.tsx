
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { Loader2, Send, Paperclip, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { app, db } from '@/lib/firebase';
import type { Customer } from '@/lib/types';
import { Separator } from './ui/separator';
import { Textarea } from './ui/textarea';

const fileSchema = z.object({
    filename: z.string(),
    content: z.string(), // Base64 encoded content
});

const emailListSchema = z.string().refine(
  (value) => {
    if (!value) return true;
    const emails = value.split(',').map((email) => email.trim());
    return emails.every((email) => z.string().email().safeParse(email).success);
  },
  {
    message: 'Contiene al menos un email inválido. Separa los correos con comas.',
  }
).optional();

const formSchema = z.object({
  to: z.string().email({ message: 'Debe ser un email válido.' }),
  cc: emailListSchema,
  bcc: emailListSchema,
  subject: z.string().min(3, { message: 'El asunto debe tener al menos 3 caracteres.' }),
  body: z.string().min(10, { message: 'El cuerpo debe tener al menos 10 caracteres.' }),
  attachments: z.array(fileSchema).optional(),
});

type FormData = z.infer<typeof formSchema>;

const MAX_TOTAL_SIZE_MB = 10;
const MAX_TOTAL_SIZE_BYTES = MAX_TOTAL_SIZE_MB * 1024 * 1024;

export function EmailComposer() {
  const { t } = useTranslation('communications');
  const [isLoading, setIsLoading] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [showCcBcc, setShowCcBcc] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      to: '',
      cc: '',
      bcc: '',
      subject: '',
      body: '',
    },
  });

  useEffect(() => {
    const q = query(collection(db, "customers"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const customersData = querySnapshot.docs.map(doc => ({ ...doc.data(), customerId: doc.id })) as Customer[];
      setCustomers(customersData);
    });
    return () => unsubscribe();
  }, []);

  const handleCustomerSelect = (customerId: string) => {
    const customer = customers.find(c => c.customerId === customerId);
    if (customer) {
      form.setValue('to', customer.contactEmail);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
        const newFiles = Array.from(event.target.files);
        const allFiles = [...files, ...newFiles];

        const totalSize = allFiles.reduce((acc, file) => acc + file.size, 0);
        if (totalSize > MAX_TOTAL_SIZE_BYTES) {
            toast({
                variant: 'destructive',
                title: t('composer.toast.sizeLimit.title'),
                description: t('composer.toast.sizeLimit.description', { maxSize: MAX_TOTAL_SIZE_MB }),
            });
            return;
        }
        
        setFiles(allFiles);
    }
  };
  
  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };
  
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = (reader.result as string).split(',')[1];
            resolve(result);
        };
        reader.onerror = error => reject(error);
    });
  };

  async function onSubmit(values: FormData) {
    setIsLoading(true);
    try {
      const functions = getFunctions(app, 'europe-west1');
      const sendEmail = httpsCallable(functions, 'sendEmail');

      const attachmentPayloads = await Promise.all(
          files.map(async (file) => {
              const content = await fileToBase64(file);
              return { filename: file.name, content };
          })
      );
      
      const payload = {
          ...values,
          attachments: attachmentPayloads,
      };
      
      await sendEmail(payload);

      toast({
        title: t('composer.toast.sent.title'),
        description: t('composer.toast.sent.description', { to: values.to }),
      });
      form.reset();
      setFiles([]);
      setShowCcBcc(false);
    } catch (error: any) {
      console.error("Error sending email:", error);
      toast({
        variant: 'destructive',
        title: t('composer.toast.error.title'),
        description: error.message || t('composer.toast.error.description'),
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div>
            <FormLabel>{t('composer.customerSelectLabel')}</FormLabel>
            <Select onValueChange={handleCustomerSelect}>
                <SelectTrigger className="mt-2">
                    <SelectValue placeholder={t('composer.customerSelectPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                    {customers.map(customer => (
                        <SelectItem key={customer.customerId} value={customer.customerId}>
                            {customer.name} ({customer.contactEmail})
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
        
        <Separator />

        <FormField
          control={form.control}
          name="to"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>{t('composer.toLabel')}</FormLabel>
                <button 
                    type="button" 
                    onClick={() => setShowCcBcc(!showCcBcc)}
                    className="text-xs text-primary hover:underline"
                >
                    {showCcBcc ? t('composer.hideCcBcc') : t('composer.showCcBcc')}
                </button>
              </div>
              <FormControl>
                <Input placeholder={t('composer.toPlaceholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {showCcBcc && (
            <>
                <FormField
                control={form.control}
                name="cc"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>{t('composer.ccLabel')}</FormLabel>
                    <FormControl>
                        <Input placeholder={t('composer.ccPlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="bcc"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>{t('composer.bccLabel')}</FormLabel>
                    <FormControl>
                        <Input placeholder={t('composer.bccPlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </>
        )}

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('composer.subjectLabel')}</FormLabel>
              <FormControl>
                <Input placeholder={t('composer.subjectPlaceholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('composer.bodyLabel')}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t('composer.bodyPlaceholder')}
                  className="min-h-[200px]"
                  {...field}
                />
              </FormControl>
               <p className="text-xs text-muted-foreground">{t('composer.bodyDescription')}</p>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div>
            <FormLabel>{t('composer.attachmentsLabel')}</FormLabel>
            <div className="mt-2 space-y-2">
                {files.length > 0 && (
                    <div className="space-y-2 rounded-md border p-2">
                        {files.map((file, index) => (
                            <div key={index} className="flex items-center justify-between text-sm p-1 bg-secondary rounded-md">
                                <span className="truncate">{file.name} ({(file.size / 1024).toFixed(2)} KB)</span>
                                <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeFile(index)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
                <Button type="button" variant="outline" asChild>
                    <label className="cursor-pointer w-full">
                        <Paperclip className="mr-2 h-4 w-4" />
                        {t('composer.addFilesButton')}
                        <input type="file" multiple onChange={handleFileChange} className="hidden" />
                    </label>
                </Button>
                 <p className="text-xs text-muted-foreground">
                    {t('composer.maxSizeNotice', { maxSize: MAX_TOTAL_SIZE_MB })}
                 </p>
            </div>
        </div>

        <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Send className="mr-2 h-4 w-4" />
                {isLoading ? t('composer.sendingButton') : t('composer.sendButton')}
            </Button>
        </div>
      </form>
    </Form>
  );
}

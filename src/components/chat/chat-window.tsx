
'use client';

import { useState, useEffect, useRef } from 'react';
import { db, app } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, doc } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import type { Message } from '@/lib/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Skeleton } from '../ui/skeleton';
import { ScrollArea } from '../ui/scroll-area';
import { useTranslation } from 'react-i18next';

interface ChatWindowProps {
  conversationId: string | null;
  currentUserUid: string;
}

const formSchema = z.object({
  text: z.string().min(1),
});

export function ChatWindow({ conversationId, currentUserUid }: ChatWindowProps) {
  const { t } = useTranslation('chat');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { text: '' },
  });

  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, 'conversations', conversationId, 'messages'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as Message[];
      setMessages(msgs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [conversationId]);
  
  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight });
    }
  }, [messages]);


  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!conversationId) return;

    form.reset();

    const functions = getFunctions(app, 'europe-west1');
    const sendMessage = httpsCallable(functions, 'sendMessage');
    await sendMessage({
      conversationId,
      text: values.text,
    });
  };

  const getInitials = (name: string) => {
    if (!name) return '?';
    const names = name.split(' ');
    if (names.length > 1) return `${names[0][0]}${names[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };


  if (!conversationId) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-muted-foreground bg-secondary/30">
        <MessageSquare className="h-12 w-12 mb-4" />
        <p>{t('selectConversation')}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
            {loading && Array.from({length: 5}).map((_, i) => <Skeleton key={i} className="h-12 w-1/2" />)}
            {messages.map((msg) => (
                <div key={msg.id} className={cn("flex items-end gap-2", msg.senderId === currentUserUid ? 'justify-end' : 'justify-start')}>
                {msg.senderId !== currentUserUid && (
                    <Avatar className="h-8 w-8">
                        <AvatarFallback>{getInitials(msg.senderName)}</AvatarFallback>
                    </Avatar>
                )}
                <div className={cn("max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg", msg.senderId === currentUserUid ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                    <p className="text-sm">{msg.text}</p>
                    <p className={cn("text-xs mt-1", msg.senderId === currentUserUid ? 'text-primary-foreground/70' : 'text-muted-foreground/70')}>
                    {new Date(msg.timestamp.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                </div>
                </div>
            ))}
        </div>
      </ScrollArea>
      <div className="p-4 border-t">
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
          <Input {...form.register('text')} placeholder={t('placeholder')} autoComplete="off" />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}

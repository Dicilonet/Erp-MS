'use client';

import { useState, useEffect } from 'react';
import { db, app } from '@/lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import type { Conversation, InternalUser, ConversationStatus } from '@/lib/types';
import { useAuth } from '@/components/auth-provider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { PlusCircle, MoreVertical } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

interface ConversationListProps {
  currentUserUid: string;
  onSelectConversation: (id: string) => void;
  selectedConversationId: string | null;
}

const statusColors: Record<ConversationStatus, string> = {
  abierta: 'bg-green-500',
  'en proceso': 'bg-orange-500',
  cerrada: 'bg-red-500',
};

export function ConversationList({ currentUserUid, onSelectConversation, selectedConversationId }: ConversationListProps) {
  const { t } = useTranslation('chat');
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<InternalUser[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const q = query(
      collection(db, 'conversations'),
      where('participantUids', 'array-contains', currentUserUid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const convos = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as Conversation[];
      
      convos.sort((a, b) => {
          const dateA = a.updatedAt?.toDate ? a.updatedAt.toDate() : new Date(0);
          const dateB = b.updatedAt?.toDate ? b.updatedAt.toDate() : new Date(0);
          return dateB.getTime() - dateA.getTime();
      });

      setConversations(convos);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUserUid]);

  // --- BLOQUE CORREGIDO ---
  // Este useEffect ahora filtra los usuarios por el companyId
  useEffect(() => {
    // Solo buscamos usuarios si el modal está abierto y tenemos un usuario con companyId
    if (isModalOpen && user?.companyId) {
        const usersQuery = query(
            collection(db, 'users'),
            where('companyId', '==', user.companyId), // <-- FILTRO CLAVE: Solo usuarios de la misma compañía
            where('__name__', '!=', user.uid) // Y excluimos al usuario actual
        );
        
        const unsubscribe = onSnapshot(usersQuery, (snapshot) => {
            setUsers(snapshot.docs.map(doc => ({ ...doc.data(), uid: doc.id }) as InternalUser));
        });
        
        return () => unsubscribe();
    }
  }, [isModalOpen, user]);
  
  const handleSelectUser = async (otherUserUid: string) => {
    setIsModalOpen(false);
    const functions = getFunctions(app, 'europe-west1');
    const getOrCreateConversation = httpsCallable(functions, 'getOrCreateConversation');
    const result: any = await getOrCreateConversation({ otherUserUid });
    onSelectConversation(result.data.conversationId);
  };

  const handleChangeStatus = async (conversationId: string, status: ConversationStatus) => {
    try {
        const functions = getFunctions(app, 'europe-west1');
        const updateStatus = httpsCallable(functions, 'updateConversationStatus');
        await updateStatus({ conversationId, status });
        toast({ title: t('toast.statusChanged', { status: t(`status.${status}`) }) });
    } catch (error) {
        console.error("Error changing status: ", error);
        toast({ variant: 'destructive', title: "Error", description: "No se pudo cambiar el estado."});
    }
  };

  const getParticipant = (participants: any[]) => {
      return participants.find(p => p.uid !== currentUserUid);
  }
  
  const getInitials = (name: string) => {
    if (!name) return '?';
    const names = name.split(' ');
    if (names.length > 1) return `${names[0][0]}${names[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="flex flex-col h-full">
        <div className="p-4 border-b">
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                        <PlusCircle className="h-4 w-4 mr-2"/>
                        {t('newConversation')}
                    </Button>
                </DialogTrigger>
                <DialogContent className="p-0">
                    <DialogHeader className="p-4 pb-0">
                      <DialogTitle>{t('newConversation')}</DialogTitle>
                    </DialogHeader>
                    <Command>
                        <CommandInput placeholder={t('searchUser')} />
                        <CommandList>
                            <CommandEmpty>{t('noUsersFound')}</CommandEmpty>
                            <CommandGroup heading={t('users')}>
                            {users.map(u => (
                                <CommandItem key={u.uid} onSelect={() => handleSelectUser(u.uid)}>
                                    <Avatar className="h-6 w-6 mr-2">
                                        <AvatarFallback>{getInitials(u.profile.fullName)}</AvatarFallback>
                                    </Avatar>
                                    <span>{u.profile.fullName}</span>
                                </CommandItem>
                            ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </DialogContent>
            </Dialog>
        </div>
      <ScrollArea className="flex-grow">
        <div className="space-y-1 p-2">
            {loading && Array.from({length: 4}).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
            {!loading && conversations.map((convo) => {
                const otherParticipant = getParticipant(convo.participants);
                return (
                    <div
                        key={convo.id}
                        onClick={() => onSelectConversation(convo.id)}
                        className={cn(
                        'w-full text-left p-2 rounded-md flex items-center gap-3 cursor-pointer',
                        selectedConversationId === convo.id ? 'bg-secondary' : 'hover:bg-muted/50'
                        )}
                    >
                        <div className="relative">
                            <Avatar>
                                <AvatarFallback>{getInitials(otherParticipant?.name)}</AvatarFallback>
                            </Avatar>
                            <span className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full border-2 border-background ${statusColors[convo.status] || 'bg-gray-400'}`} />
                        </div>
                        <div className="flex-grow truncate">
                            <p className="font-semibold">{otherParticipant?.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{convo.lastMessage?.text}</p>
                        </div>
                         <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                                    <MoreVertical className="h-4 w-4"/>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => handleChangeStatus(convo.id, 'abierta')}>{t('status.abierta')}</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleChangeStatus(convo.id, 'en proceso')}>{t('status.en proceso')}</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleChangeStatus(convo.id, 'cerrada')}>{t('status.cerrada')}</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )
            })}
        </div>
      </ScrollArea>
    </div>
  );
}
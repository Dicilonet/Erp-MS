
'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, orderBy, limit, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '@/components/auth-provider';
import type { Todo } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ListTodo, ArrowRight } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

export function DashboardTodoList() {
    const { user } = useAuth();
    const { t } = useTranslation('dashboard');
    const [tasks, setTasks] = useState<Todo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        if (!user) {
            setIsLoading(false);
            return;
        };
        
        const q = query(
            collection(db, `users/${user.uid}/todos`),
            where("completed", "==", false),
            orderBy("priority", "asc"),
            orderBy("createdAt", "desc"),
            limit(7)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const tasksData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Todo[];
            setTasks(tasksData);
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching todos:", error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const handleToggleComplete = async (e: React.MouseEvent, task: Todo) => {
        e.stopPropagation(); 
        if (!user) return;
        const todoRef = doc(db, `users/${user.uid}/todos`, task.id);
        try {
            await updateDoc(todoRef, { completed: !task.completed });
             toast({
                title: task.completed ? "Tarea desmarcada" : "¡Tarea completada!",
                description: `"${task.title || task.text}"`,
            });
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'No se pudo actualizar la tarea.',
            });
        }
    };


    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><ListTodo /> {t('quickTasks.title')}</CardTitle>
                <CardDescription>{t('quickTasks.description')}</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-full" />
                    </div>
                ) : tasks.length > 0 ? (
                    <div className="space-y-2">
                        {tasks.map(task => (
                             <Link href="/admin/todo-list" key={task.id} className="block group">
                                <div className="flex items-center gap-3 p-2 rounded-md hover:bg-secondary/50 transition-colors">
                                    <Checkbox 
                                        id={`dashboard-task-${task.id}`} 
                                        checked={task.completed}
                                        onClick={(e) => handleToggleComplete(e, task)}
                                        aria-label={`Marcar como completada: ${task.title || task.text}`}
                                    />
                                    <label htmlFor={`dashboard-task-${task.id}`} className="flex-1 text-sm font-medium cursor-pointer group-hover:underline">
                                        {task.title || task.text}
                                    </label>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-center text-muted-foreground py-4">{t('quickTasks.noTasks')}</p>
                )}
            </CardContent>
            <CardFooter>
                 <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link href="/admin/todo-list">
                        {t('quickTasks.viewAll')}
                         <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}

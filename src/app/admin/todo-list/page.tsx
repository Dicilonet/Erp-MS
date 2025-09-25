
'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, onSnapshot, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '@/components/auth-provider';
import type { Todo } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2, ChevronDown } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { TodoFormModal } from '@/components/todo-form-modal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';


export default function TodoListPage() {
  const { user } = useAuth();
  const { t } = useTranslation('todo');
  const [tasks, setTasks] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [todoToEdit, setTodoToEdit] = useState<Todo | null>(null);

  useEffect(() => {
    if (!user) {
        setIsLoading(false);
        return;
    };
    const q = query(collection(db, `users/${user.uid}/todos`), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Todo[];
      setTasks(tasksData);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  const handleToggleComplete = async (task: Todo) => {
    if (!user) return;
    const todoRef = doc(db, `users/${user.uid}/todos`, task.id);
    await updateDoc(todoRef, { completed: !task.completed });
  };

  const handleDelete = async (taskId: string) => {
    if (!user) return;
    const todoRef = doc(db, `users/${user.uid}/todos`, taskId);
    await deleteDoc(todoRef);
  };

  const openEditModal = (task: Todo) => {
    setTodoToEdit(task);
    setIsModalOpen(true);
  };
  
  const openNewModal = () => {
    setTodoToEdit(null);
    setIsModalOpen(true);
  };
  
  const priorityStyles: Record<Todo['priority'], string> = {
    importante: 'bg-destructive/20 text-destructive-foreground border-destructive/50',
    media: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50',
    idea: 'bg-sky-500/20 text-sky-500 border-sky-500/50',
  };

  const renderTaskList = (filteredTasks: Todo[]) => {
    if (isLoading) {
       return Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />);
    }
    if (filteredTasks.length === 0) {
      return <p className="text-muted-foreground text-center py-10">{t('noTasksInCategory')}</p>;
    }
    return filteredTasks.map(task => (
      <Collapsible key={task.id} className={`rounded-lg border p-4 transition-colors ${task.completed ? 'bg-muted text-muted-foreground' : 'bg-card'}`}>
          <div className="flex items-start gap-4">
            <Checkbox 
              checked={task.completed}
              onCheckedChange={() => handleToggleComplete(task)}
              className="mt-1"
              id={`task-${task.id}`}
            />
            <div className="flex-1">
                <CollapsibleTrigger asChild>
                    <div className="flex-1 cursor-pointer group">
                        <p className={cn("font-semibold text-base flex items-center", task.completed && 'line-through')}>
                            {task.title || t('quickTaskTitle')}
                            <ChevronDown className="h-4 w-4 ml-2 transition-transform group-data-[state=open]:rotate-180" />
                        </p>
                    </div>
                </CollapsibleTrigger>
                <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className={`text-xs ${priorityStyles[task.priority]}`}>{t(`priorities.${task.priority}`)}</Badge>
                    <div className="ml-auto flex items-center">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditModal(task)}>
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive h-8 w-8" onClick={() => handleDelete(task.id)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
          </div>
          <CollapsibleContent>
             <div className={cn("text-sm text-muted-foreground pt-4 pl-10 whitespace-pre-wrap", task.completed && 'line-through')}>
                {task.text}
            </div>
          </CollapsibleContent>
      </Collapsible>
    ));
  };


  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4 sm:mt-0 mb-6">
        <div className="flex-1">
            <h1 className="text-2xl font-bold">{t('title')}</h1>
            <p className="text-muted-foreground">{t('description')}</p>
        </div>
        <div className="w-full sm:w-auto">
            <Button onClick={openNewModal} disabled={!user} className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" />
              {t('addTask')}
            </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4 sm:p-6">
            <Tabs defaultValue="all" className="w-full">
                <div className="overflow-x-auto pb-2">
                    <TabsList className="inline-flex">
                        <TabsTrigger value="all">{t('tabs.all')}</TabsTrigger>
                        <TabsTrigger value="importante">{t('tabs.important')}</TabsTrigger>
                        <TabsTrigger value="media">{t('tabs.normal')}</TabsTrigger>
                        <TabsTrigger value="idea">{t('tabs.ideas')}</TabsTrigger>
                        <TabsTrigger value="completed">{t('tabs.completed')}</TabsTrigger>
                    </TabsList>
                </div>
                <TabsContent value="all" className="space-y-3 pt-4">
                    {renderTaskList(tasks.filter(t => !t.completed))}
                </TabsContent>
                <TabsContent value="importante" className="space-y-3 pt-4">
                    {renderTaskList(tasks.filter(t => t.priority === 'importante' && !t.completed))}
                </TabsContent>
                <TabsContent value="media" className="space-y-3 pt-4">
                    {renderTaskList(tasks.filter(t => t.priority === 'media' && !t.completed))}
                </TabsContent>
                <TabsContent value="idea" className="space-y-3 pt-4">
                    {renderTaskList(tasks.filter(t => t.priority === 'idea' && !t.completed))}
                </TabsContent>
                 <TabsContent value="completed" className="space-y-3 pt-4">
                    {renderTaskList(tasks.filter(t => t.completed))}
                </TabsContent>
            </Tabs>
        </CardContent>
      </Card>

      {isModalOpen && user && (
        <TodoFormModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          userId={user.uid}
          todoToEdit={todoToEdit}
        />
      )}
    </>
  );
}

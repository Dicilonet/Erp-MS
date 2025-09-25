
'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import type { Task, TaskStatus } from "@/lib/types";
import { db } from '@/lib/firebase';
import { CreateTaskForm } from './create-task-form';
import { EditTaskForm } from './edit-task-form';
import { Button } from './ui/button';
import { PlusCircle } from 'lucide-react';

const taskStatusColors: { [key in TaskStatus]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
    'Pendiente': 'secondary',
    'En Progreso': 'default',
    'Bloqueado': 'destructive',
    'Completado': 'outline'
};

interface TaskListProps {
  selectedProjectId: string | null;
}

export function TaskList({ selectedProjectId }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedProjectId) {
      setTasks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(collection(db, "tasks"), where("projectId", "==", selectedProjectId));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const tasksData = querySnapshot.docs.map(doc => ({ ...doc.data(), taskId: doc.id })) as Task[];
        setTasks(tasksData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        setLoading(false);
    }, (error) => {
        console.error("Error fetching tasks: ", error);
        setLoading(false);
    });

    return () => unsubscribe();
  }, [selectedProjectId]);

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Detalle del Proyecto</CardTitle>
         <CreateTaskForm selectedProjectId={selectedProjectId}>
            <Button size="sm" disabled={!selectedProjectId}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Añadir Tarea
            </Button>
        </CreateTaskForm>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-4">
            {loading ? (
               Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-3 rounded-lg border bg-card flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                </div>
              ))
            ) : tasks.length === 0 ? (
                <div className="flex items-center justify-center h-full pt-10">
                    <p className="text-muted-foreground text-center">
                        {selectedProjectId ? "No hay tareas para este proyecto. Comienza creando una." : "Selecciona un proyecto para ver sus tareas."}
                    </p>
                </div>
            ) : (
              tasks.map((task) => (
                <div key={task.taskId} className="p-3 rounded-lg border bg-card flex items-center justify-between">
                  <div>
                      <h3 className="font-semibold">{task.taskName}</h3>
                      <p className="text-xs text-muted-foreground mt-1">Vence: {new Date(task.dueDate).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                      <Badge variant={taskStatusColors[task.status] || 'secondary'}>{task.status}</Badge>
                      <Avatar className="h-8 w-8">
                          <AvatarFallback>{task.assignedTo?.substring(0, 2).toUpperCase() || '?'}</AvatarFallback>
                      </Avatar>
                      <EditTaskForm task={task} />
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

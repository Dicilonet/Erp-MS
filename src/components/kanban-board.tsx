
'use client';

import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, app } from '@/lib/firebase';
import { getFunctions, httpsCallable } from 'firebase/functions';
import type { Task, TaskStatus, InternalUser } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from './ui/skeleton';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { EditTaskForm } from './edit-task-form';
import { ProjectPhase } from '@/lib/types';

interface KanbanBoardProps {
  projectId: string;
  phaseId: string;
  teamMembers: InternalUser[];
}

const columnTitles: Record<TaskStatus, string> = {
  Pendiente: 'Pendiente',
  'En Progreso': 'En Progreso',
  Completado: 'Hecho',
  Bloqueado: 'Bloqueado',
};

const columnOrder: TaskStatus[] = ['Pendiente', 'En Progreso', 'Completado', 'Bloqueado'];


export function KanbanBoard({ projectId, phaseId, teamMembers }: KanbanBoardProps) {
  const [tasks, setTasks] = useState<Record<TaskStatus, Task[]>>({
    Pendiente: [],
    'En Progreso': [],
    Completado: [],
    Bloqueado: [],
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const getInitials = (name: string) => {
    if (!name) return '?';
    const names = name.split(' ');
    return names.length > 1 ? `${names[0][0]}${names[1][0]}`.toUpperCase() : name.substring(0, 2).toUpperCase();
  };
  
  const teamMembersMap = new Map(teamMembers.map(member => [member.uid, member]));

  useEffect(() => {
    if (!projectId || !phaseId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const q = query(
        collection(db, 'projects', projectId, 'tasks'),
        where("phaseId", "==", phaseId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newTasks: Record<TaskStatus, Task[]> = { Pendiente: [], 'En Progreso': [], Completado: [], Bloqueado: [] };
      snapshot.forEach((doc) => {
        const task = { ...doc.data(), taskId: doc.id } as Task;
        if (newTasks[task.status]) {
          newTasks[task.status].push(task);
        }
      });
      // Sort tasks within each column if needed, e.g., by creation date
      Object.keys(newTasks).forEach(status => {
        newTasks[status as TaskStatus].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      });

      setTasks(newTasks);
      setLoading(false);
    }, (error) => {
        console.error("Error fetching tasks:", error);
        toast({ variant: 'destructive', title: 'Error', description: 'No se pudieron cargar las tareas.'});
        setLoading(false);
    });

    return () => unsubscribe();
  }, [projectId, phaseId, toast]);

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }
    
    const startColumn = tasks[source.droppableId as TaskStatus];
    const taskToMove = startColumn.find(t => t.taskId === draggableId);

    if (!taskToMove) return;

    // Optimistic UI Update
    const newStartTasks = Array.from(startColumn);
    newStartTasks.splice(source.index, 1);
    
    const newFinishColumn = Array.from(tasks[destination.droppableId as TaskStatus]);
    const updatedTask = { ...taskToMove, status: destination.droppableId as TaskStatus };
    newFinishColumn.splice(destination.index, 0, updatedTask);
    
    const newTasksState = {
        ...tasks,
        [source.droppableId]: newStartTasks,
        [destination.droppableId]: newFinishColumn,
    };
    setTasks(newTasksState);
    
    // Backend Update
    try {
      const functions = getFunctions(app, 'europe-west1');
      const updateTaskStatus = httpsCallable(functions, 'updateTaskStatus');
      await updateTaskStatus({
        projectId: projectId,
        taskId: draggableId,
        newStatus: destination.droppableId,
      });
      toast({ title: 'Tarea Actualizada', description: `La tarea "${taskToMove.taskName}" se movió a "${columnTitles[destination.droppableId as TaskStatus]}".`});
    } catch (error) {
      console.error("Error updating task status:", error);
      toast({ variant: 'destructive', title: 'Error', description: 'No se pudo actualizar la tarea.' });
      // Revert optimistic update on error
      const revertedTasks = { ...tasks }; // Revert to original state before optimistic update
      setTasks(revertedTasks);
    }
  };
  
   const getDueDateColor = (dueDate: string) => {
    const date = parseISO(dueDate);
    const now = new Date();
    if (date < now) return "text-destructive font-semibold";
    return "text-muted-foreground";
  };


  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {columnOrder.map(col => (
          <div key={col} className="p-4 bg-muted/50 rounded-lg">
             <Skeleton className="h-6 w-3/4 mb-4" />
             <div className="space-y-3">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
             </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto pb-4">
        {columnOrder.map((columnId) => (
          <div key={columnId} className="flex flex-col">
            <h3 className="font-bold text-lg mb-4 px-1">{columnTitles[columnId]} ({tasks[columnId].length})</h3>
            <Droppable droppableId={columnId}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`p-1 bg-muted/50 rounded-lg transition-colors flex-grow min-h-[200px] ${snapshot.isDraggingOver ? 'bg-primary/10' : ''}`}
                >
                  <div className="space-y-3">
                    {tasks[columnId].length === 0 && !snapshot.isDraggingOver && (
                        <div className="flex items-center justify-center h-24">
                            <p className="text-xs text-muted-foreground text-center">Arrastra tareas aquí</p>
                        </div>
                    )}
                    {tasks[columnId].map((task, index) => (
                      <Draggable key={task.taskId} draggableId={task.taskId} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-3 bg-card rounded-md shadow-sm border group ${snapshot.isDragging ? 'ring-2 ring-primary' : ''}`}
                          >
                            <div className="flex justify-between items-start">
                                <p className="font-semibold">{task.taskName}</p>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <EditTaskForm task={task} phases={[]} teamMembers={teamMembers} />
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
                            <div className="flex justify-between items-center mt-3">
                              <span className={`text-xs ${getDueDateColor(task.dueDate)}`}>
                                  Vence: {formatDistanceToNow(parseISO(task.dueDate), { addSuffix: true, locale: es })}
                              </span>
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={teamMembersMap.get(task.assignedTo)?.profile.photoUrl} />
                                <AvatarFallback className="text-xs">{getInitials(teamMembersMap.get(task.assignedTo)?.profile.fullName || '?')}</AvatarFallback>
                              </Avatar>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}

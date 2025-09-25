
'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where, orderBy, limit as firestoreLimit, getDocs, documentId, collectionGroup } from 'firebase/firestore';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from '@/components/ui/button';
import type { Task, Project } from "@/lib/types";
import { db } from '@/lib/firebase';
import { ListTodo, ArrowRight } from 'lucide-react';
import { PriorityBadge } from './priority-badge';
import { useTranslation } from 'react-i18next';
import { useAuth } from './auth-provider';


interface EnrichedTask extends Task {
    projectName?: string;
}

const priorityOrder: { [key in Task['priority']]: number } = {
    'Crítica': 1,
    'Alta': 2,
    'Media': 3,
    'Baja': 4,
};


export function DashboardTaskList() {
  const { t } = useTranslation('dashboard');
  const { isSuperadmin } = useAuth();
  const [tasks, setTasks] = useState<EnrichedTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Protección: Solo los superadmins pueden ejecutar esta consulta.
    if (!isSuperadmin) {
        setLoading(false);
        setTasks([]);
        return;
    }

    const tasksQuery = query(
        collectionGroup(db, "tasks"),
        where("status", "!=", "Completado"),
        orderBy("status"), 
        orderBy("dueDate", "asc"),
        firestoreLimit(50)
    );

    const unsubscribe = onSnapshot(tasksQuery, async (tasksSnapshot) => {
        let tasksData = tasksSnapshot.docs
            .map(doc => ({ ...doc.data(), taskId: doc.id })) as Task[];

        tasksData.sort((a, b) => {
             const priorityComparison = priorityOrder[a.priority] - priorityOrder[b.priority];
             if (priorityComparison !== 0) return priorityComparison;
             return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        });
        
        const topTasks = tasksData.slice(0, 7);
        
        const projectIds = [...new Set(topTasks.map(t => t.projectId))];
        const projectsData: Record<string, Project> = {};
        
        if (projectIds.length > 0) {
            const projectsQuery = query(collection(db, 'projects'), where(documentId(), 'in', projectIds));
            const projectsSnap = await getDocs(projectsQuery);
            projectsSnap.forEach(doc => {
                projectsData[doc.id] = { ...doc.data(), projectId: doc.id } as Project;
            });
        }
        
        const enrichedTasks = topTasks.map(task => ({
            ...task,
            projectName: projectsData[task.projectId]?.projectName || t('tasks.unknownProject')
        }));

        setTasks(enrichedTasks);
        setLoading(false);
    }, (error) => {
        console.error("Error fetching tasks: ", error); 
        setLoading(false);
    });

    return () => unsubscribe();
  }, [isSuperadmin, t]);

  // Si el usuario no es superadmin, este componente no debería mostrarse (controlado en page.tsx)
  // pero como una capa extra de seguridad, no renderizamos nada si no es superadmin.
  if (!isSuperadmin) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle className="flex items-center gap-2"><ListTodo />{t('tasks.title')}</CardTitle>
                <CardDescription>{t('tasks.description')}</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
            {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-3">
                        <div className="space-y-2">
                        <Skeleton className="h-5 w-48" />
                        <Skeleton className="h-3 w-32" />
                        </div>
                        <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                ))
            ) : tasks.length === 0 ? (
                <p className="text-muted-foreground text-center py-10">{t('tasks.noTasks')}</p>
            ) : (
                tasks.map((task) => (
                    <div key={task.taskId} className="flex items-center justify-between p-3 rounded-lg border bg-secondary/30">
                        <div>
                            <p className="font-semibold">{task.taskName}</p>
                            <p className="text-xs text-muted-foreground">
                                {t('tasks.dueDate')}: {new Date(task.dueDate).toLocaleDateString()} | {t('tasks.in')}: <Link href={`/admin/projects/${task.projectId}`} passHref><span className="hover:underline cursor-pointer">{task.projectName}</span></Link>
                            </p>
                        </div>
                        <PriorityBadge priority={task.priority} />
                    </div>
                ))
            )}
        </div>
      </CardContent>
      <CardFooter>
          <Link href="/admin/projects" passHref className='w-full'>
            <Button variant="outline" className="w-full">
                {t('tasks.viewAll')}
                <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
      </CardFooter>
    </Card>
  );
}


'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where, Timestamp } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { Project, Task } from "@/lib/types";
import { db } from '@/lib/firebase';
import { cn } from '@/lib/utils';
import { subDays } from 'date-fns';

const statusColors: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
    'En Progreso': 'default',
    'Planificado': 'secondary',
    'Completado': 'outline',
    'Bloqueado': 'destructive'
};

interface ActiveProjectsListProps {
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
}

export function ActiveProjectsList({ selectedProjectId, setSelectedProjectId }: ActiveProjectsListProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sevenDaysAgo = subDays(new Date(), 7);
    const sevenDaysAgoTimestamp = Timestamp.fromDate(sevenDaysAgo);

    const projectsQuery = query(collection(db, "projects"));

    const unsubscribeProjects = onSnapshot(projectsQuery, (projectsSnapshot) => {
        const allProjects = projectsSnapshot.docs.map(doc => ({ ...doc.data(), projectId: doc.id })) as Project[];
        
        const tasksQuery = query(collection(db, "tasks"), where("createdAt", ">=", sevenDaysAgo.toISOString()));
        
        const unsubscribeTasks = onSnapshot(tasksQuery, (tasksSnapshot) => {
            const recentTaskProjectIds = new Set(tasksSnapshot.docs.map(doc => (doc.data() as Task).projectId));
            
            const activeProjects = allProjects.filter(p => 
                p.status === 'En Progreso' || recentTaskProjectIds.has(p.projectId)
            );
            
            setProjects(activeProjects);
            setLoading(false);
        });

        return () => unsubscribeTasks();

    }, (error) => {
        console.error("Error fetching projects: ", error);
        setLoading(false);
    });

    return () => unsubscribeProjects();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Proyectos en Ejecución</CardTitle>
        <CardDescription>Proyectos con estado "En Progreso" o con actividad en los últimos 7 días.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80">
          <div className="space-y-4">
            {loading ? (
              Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="p-3 rounded-lg border bg-card space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))
            ) : projects.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No hay proyectos activos en este momento.</p>
            ) : (
              projects.map((project) => (
                <div 
                    key={project.projectId} 
                    className={cn(
                        "p-3 rounded-lg border bg-card hover:bg-secondary cursor-pointer transition-colors",
                        selectedProjectId === project.projectId && "bg-secondary ring-2 ring-primary"
                    )}
                    onClick={() => setSelectedProjectId(project.projectId)}
                >
                  <div className="flex justify-between items-start">
                      <h3 className="font-semibold">{project.projectName}</h3>
                      <Badge variant={statusColors[project.status] || 'secondary'}>{project.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{project.description}</p>
                   <div className="text-xs text-muted-foreground mt-2">
                    <span>{new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}</span>
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

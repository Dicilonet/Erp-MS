
'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { Project } from "@/lib/types";
import { db } from '@/lib/firebase';
import { cn } from '@/lib/utils';
import { useAuth } from './auth-provider';

const statusColors: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
    'En Progreso': 'default',
    'Planificación': 'secondary',
    'Completado': 'outline',
    'Bloqueado': 'destructive'
};

interface ProjectListProps {
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
}

export function ProjectList({ selectedProjectId, setSelectedProjectId }: ProjectListProps) {
  const { user, isSuperadmin } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    let q;
    if (isSuperadmin) {
        // Los superadmins pueden ver todos los proyectos
        q = query(collection(db, "projects"));
    } else {
        // Los demás usuarios solo ven los proyectos a los que están asignados
        q = query(collection(db, "projects"), where("assignedTeam", "array-contains", user.uid));
    }

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const projectsData = querySnapshot.docs.map(doc => ({ ...doc.data(), projectId: doc.id })) as Project[];
        setProjects(projectsData.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()));
        setLoading(false);
    }, (error) => {
        console.error("Error fetching projects: ", error);
        setLoading(false);
    });

    return () => unsubscribe();
  }, [user, isSuperadmin]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mis Proyectos</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80">
          <div className="space-y-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-3 rounded-lg border bg-card space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))
            ) : projects.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No tienes proyectos asignados.</p>
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

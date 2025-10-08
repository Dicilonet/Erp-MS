
'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '@/lib/firebase';
import { UnifiedSearchView } from '@/components/unified-search-view';
import { AiSummary } from '@/components/ai-summary';
import { CalendarView } from '@/components/calendar-view';
import { BarChart, ShieldCheck, PlusCircle, GripVertical, Lock, Unlock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { InterestingPrograms } from '@/components/interesting-programs';
import { DashboardTaskList } from '@/components/dashboard-task-list';
import { DashboardTodoList } from '@/components/dashboard-todo-list';
import { Calculator } from '@/components/calculator';
import { useAuth } from '@/components/auth-provider';
import { TeamMemberTable } from '@/components/team-member-table';
import { CreateTeamMemberForm } from '@/components/create-team-member-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { InternalUser } from '@/lib/types';
import { ServiceCatalogWidget } from '@/components/dashboard/service-catalog-widget';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';


const defaultLeftColumn = ['unifiedSearch', 'aiSummary'];
const defaultRightColumn = ['todoList', 'calculator', 'calendar'];

export default function DashboardPage() {
  const { t } = useTranslation(['dashboard', 'common']);
  const { isSuperadmin, isLoading: isAuthLoading, user } = useAuth();
  const router = useRouter();
  
  const [teamData, setTeamData] = useState<{ collaborators: InternalUser[], teamOffice: InternalUser[] }>({ collaborators: [], teamOffice: [] });
  const [isTeamDataLoading, setIsTeamDataLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [columns, setColumns] = useState<{ left: string[], right: string[] }>({
    left: [],
    right: []
  });
  
  useEffect(() => {
    // Si el usuario está logueado y va a la landing, lo redirigimos al dashboard.
    // Esto lo hacemos aquí en lugar del AuthProvider para evitar conflictos.
    if (user && window.location.pathname === '/') {
        router.replace('/dashboard');
    }
  }, [user, router]);


  const componentMap = useMemo(() => {
    const baseMap: { [key: string]: React.ReactNode } = {
      unifiedSearch: <UnifiedSearchView />,
      interestingPrograms: <InterestingPrograms />,
      aiSummary: <AiSummary />,
      todoList: <DashboardTodoList />,
      calculator: <Calculator />,
      calendar: <CalendarView />,
      serviceCatalog: <ServiceCatalogWidget />,
      teamManagement: (
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                  <ShieldCheck className="h-8 w-8" />
                  <div>
                      <CardTitle className="text-2xl">{t('common:nav.teams')}</CardTitle>
                      <CardDescription>{t('teams.description')}</CardDescription>
                  </div>
              </div>
              <CreateTeamMemberForm>
                      <Button size="sm">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      <span>{t('teams.addMember')}</span>
                  </Button>
              </CreateTeamMemberForm>
          </CardHeader>
          <CardContent>
                  <Tabs defaultValue="colaboradores">
                  <TabsList>
                      <TabsTrigger value="colaboradores">{t('teams.tabs.collaborators')}</TabsTrigger>
                      <TabsTrigger value="teamoffice">{t('teams.tabs.teamOffice')}</TabsTrigger>
                  </TabsList>
                  <TabsContent value="colaboradores">
                      <TeamMemberTable role="colaborador" users={teamData.collaborators} loading={isTeamDataLoading} />
                  </TabsContent>
                  <TabsContent value="teamoffice">
                      <TeamMemberTable role="teamoffice" users={teamData.teamOffice} loading={isTeamDataLoading} />
                  </TabsContent>
              </Tabs>
          </CardContent>
      </Card>
      ),
    };
    
    if (isSuperadmin) {
        baseMap['taskList'] = <DashboardTaskList />;
    }

    return baseMap;
  }, [t, teamData, isTeamDataLoading, isSuperadmin]);

  const initializeLayout = useCallback(() => {
    const availableComponents = new Set([...defaultLeftColumn, ...defaultRightColumn]);
    if (isSuperadmin) {
      availableComponents.add('teamManagement');
      availableComponents.add('taskList');
      availableComponents.add('serviceCatalog');
      availableComponents.add('interestingPrograms');
    }

    if (user?.uid) {
        try {
          const storedLayout = localStorage.getItem(`dashboardLayout_${user.uid}`);
          if (storedLayout) {
             const parsedLayout = JSON.parse(storedLayout);
             
             parsedLayout.left = parsedLayout.left.filter((key: string) => availableComponents.has(key));
             parsedLayout.right = parsedLayout.right.filter((key: string) => availableComponents.has(key));

             const currentComponents = new Set([...parsedLayout.left, ...parsedLayout.right]);
             
             availableComponents.forEach(componentKey => {
                 if (!currentComponents.has(componentKey)) {
                     if (defaultLeftColumn.includes(componentKey) || componentKey === 'teamManagement' || componentKey === 'taskList' || componentKey === 'interestingPrograms') {
                         parsedLayout.left.push(componentKey);
                     } else {
                         parsedLayout.right.push(componentKey);
                     }
                 }
             });

             setColumns(parsedLayout);
             return;
          }
        } catch (error) {
          console.error("Failed to load layout from localStorage", error);
        }
    }
    
    let baseLeft = [...defaultLeftColumn];
    let baseRight = [...defaultRightColumn];
     if(isSuperadmin) {
        baseLeft = ['teamManagement', 'taskList', 'interestingPrograms', ...baseLeft];
        baseRight = ['todoList', 'calculator', 'calendar', 'serviceCatalog'];
    } else {
        baseLeft = baseLeft.filter(item => item !== 'taskList');
        baseRight = baseRight.filter(item => item !== 'taskList');
    }
    setColumns({ left: baseLeft, right: baseRight });
  }, [user, isSuperadmin]);


  useEffect(() => {
    setIsClient(true);
    if (!isAuthLoading) {
      initializeLayout();
    }
  }, [isAuthLoading, initializeLayout]);


  useEffect(() => {
    if (!isAuthLoading && isSuperadmin) {
        const functions = getFunctions(app, 'europe-west1');
        const getDashboardData = httpsCallable(functions, 'getDashboardData');
        
        getDashboardData()
            .then(result => {
                const data = result.data as { success: boolean, collaborators: InternalUser[], teamOffice: InternalUser[] };
                if (data.success) {
                    setTeamData({ collaborators: data.collaborators, teamOffice: data.teamOffice });
                }
            })
            .catch(error => console.error("Error al cargar datos del dashboard:", error))
            .finally(() => setIsTeamDataLoading(false));
    } else {
        setIsTeamDataLoading(false);
    }
  }, [isAuthLoading, isSuperadmin]);
  
  const isLoading = isAuthLoading || (isSuperadmin && isTeamDataLoading);

  const handleOnDragEnd = (result: DropResult) => {
    if (!isEditMode) return;
    const { destination, source } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;
    
    const startColumnKey = source.droppableId as keyof typeof columns;
    const endColumnKey = destination.droppableId as keyof typeof columns;
    
    const startColumnItems = Array.from(columns[startColumnKey]);
    const [reorderedItem] = startColumnItems.splice(source.index, 1);

    const newColumns = { ...columns };

    if (startColumnKey === endColumnKey) {
        startColumnItems.splice(destination.index, 0, reorderedItem);
        newColumns[startColumnKey] = startColumnItems;
    } else {
        const endColumnItems = Array.from(columns[endColumnKey]);
        endColumnItems.splice(destination.index, 0, reorderedItem);
        newColumns[startColumnKey] = startColumnItems;
        newColumns[endColumnKey] = endColumnItems;
    }

    setColumns(newColumns);
    if(user?.uid) {
        localStorage.setItem(`dashboardLayout_${user.uid}`, JSON.stringify(newColumns));
    }
  };

  if (isLoading || !isClient || (columns.left.length === 0 && columns.right.length === 0)) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-48 w-full" />
            </div>
            <div className="space-y-6">
                <Skeleton className="h-96 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        </div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 sm:mt-0">
          <div className="flex items-center gap-4">
              <BarChart className="h-8 w-8" />
              <h1 className="text-3xl font-bold">{t('title')}</h1>
          </div>
          <div className="flex items-center space-x-2">
            {isEditMode ? <Unlock className="h-5 w-5 text-accent" /> : <Lock className="h-5 w-5 text-muted-foreground"/>}
            <Label htmlFor="edit-mode-switch" className="text-sm font-medium">Modo Edición</Label>
            <Switch id="edit-mode-switch" checked={isEditMode} onCheckedChange={setIsEditMode} />
          </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Droppable droppableId="left" isDropDisabled={!isEditMode}>
                {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-6">
                        {columns.left.map((key, index) => (
                            componentMap[key] && (
                                <Draggable key={key} draggableId={key} index={index} isDragDisabled={!isEditMode}>
                                    {(provided) => (
                                        <div ref={provided.innerRef} {...provided.draggableProps} className="relative group">
                                            {isEditMode && (
                                                <div {...provided.dragHandleProps} className="absolute top-3 right-3 z-10 p-2 cursor-grab opacity-30 group-hover:opacity-100 transition-opacity">
                                                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                                                </div>
                                            )}
                                            {componentMap[key]}
                                        </div>
                                    )}
                                </Draggable>
                            )
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
          </div>

          <div className="space-y-6">
              <Droppable droppableId="right" isDropDisabled={!isEditMode}>
                {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-6">
                        {columns.right.map((key, index) => (
                             componentMap[key] && (
                                <Draggable key={key} draggableId={key} index={index} isDragDisabled={!isEditMode}>
                                    {(provided) => (
                                        <div ref={provided.innerRef} {...provided.draggableProps} className="relative group">
                                            {isEditMode && (
                                                <div {...provided.dragHandleProps} className="absolute top-3 right-3 z-10 p-2 cursor-grab opacity-30 group-hover:opacity-100 transition-opacity">
                                                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                                                </div>
                                            )}
                                            {componentMap[key]}
                                        </div>
                                    )}
                                </Draggable>
                            )
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
          </div>
      </div>
    </DragDropContext>
  );
}

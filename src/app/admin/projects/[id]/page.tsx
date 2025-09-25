
'use client';

import { useEffect, useState }from 'react';
import { useParams, notFound, useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db, app } from '@/lib/firebase';
import type { Project, InternalUser, Customer } from '@/lib/types';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { useAuth } from '@/components/auth-provider';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Briefcase, FileText, BarChart2, DollarSign, PlusCircle, Calendar, Flag, Users, User, Edit, Layers, StickyNote, Trash2, Loader2 } from 'lucide-react';
import { KanbanBoard } from '@/components/kanban-board';
import { CreateTaskForm } from '@/components/create-task-form';
import { CreateProjectForm } from '@/components/create-project-form';
import { ProjectMarketingCalendar } from '@/components/project-marketing-calendar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';


export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const { user: authUser, isSuperadmin } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation('projects');

  const [project, setProject] = useState<Project | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [teamMembers, setTeamMembers] = useState<InternalUser[]>([]);
  const [teamMembersMap, setTeamMembersMap] = useState<Map<string, InternalUser>>(new Map());

  useEffect(() => {
    if (!projectId) return;

    const fetchProjectAndTeam = async () => {
      setLoading(true);
      const projectRef = doc(db, 'projects', projectId);
      const projectSnap = await getDoc(projectRef);

      if (projectSnap.exists()) {
        const projectData = { ...projectSnap.data(), projectId: projectSnap.id } as Project;
        setProject(projectData);
        
        if (projectData.customerId) {
            const customerRef = doc(db, 'customers', projectData.customerId);
            const customerSnap = await getDoc(customerRef);
            if (customerSnap.exists()) {
                setCustomer({ ...customerSnap.data(), customerId: customerSnap.id } as Customer);
            }
        }

        if (projectData.assignedTeam && projectData.assignedTeam.length > 0) {
            try {
                const functions = getFunctions(app, 'europe-west1');
                const getTeamMembers = httpsCallable(functions, 'getDashboardData');
                const result: any = await getTeamMembers();
                if (result.data.success) {
                    const allMembers: InternalUser[] = [...result.data.collaborators, ...result.data.teamOffice];
                    const projectTeam = allMembers.filter(member => projectData.assignedTeam.includes(member.uid));
                    setTeamMembers(projectTeam);
                    setTeamMembersMap(new Map(allMembers.map(m => [m.uid, m])));
                }
            } catch (error) {
                console.error("Error fetching team members: ", error);
            }
        }
      } else {
        notFound();
      }
      setLoading(false);
    };

    fetchProjectAndTeam();
  }, [projectId]);

  const handleDeleteProject = async () => {
    setIsDeleting(true);
    try {
        const functions = getFunctions(app, 'europe-west1');
        const deleteProjectFunc = httpsCallable(functions, 'deleteProject');
        await deleteProjectFunc({ projectId });
        toast({ title: t('detail.delete.successTitle'), description: t('detail.delete.successDescription') });
        router.push('/admin/projects');
    } catch (error: any) {
        toast({ variant: 'destructive', title: t('detail.delete.errorTitle'), description: error.message });
    } finally {
        setIsDeleting(false);
    }
  };


  const getInitials = (name: string) => {
    if (!name) return '?';
    const names = name.split(' ');
    return names.length > 1 ? `${names[0][0]}${names[1][0]}`.toUpperCase() : name.substring(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div className="space-y-4 p-4 md:p-6">
        <Skeleton className="h-9 w-32" />
        <div className="space-y-2">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-8 w-1/2" />
        </div>
        <div className="border-b">
          <Skeleton className="h-10 w-96" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!project) {
    return notFound();
  }

  const projectOwner = teamMembersMap.get(project.projectOwner);

  return (
    <div className="p-0 sm:p-6 space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('detail.backButton')}
        </Button>
        <div className="flex gap-2">
            <CreateProjectForm projectToEdit={project}>
                <Button variant="outline">
                    <Edit className="mr-2 h-4 w-4" />
                    {t('detail.editButton')}
                </Button>
            </CreateProjectForm>
            {isSuperadmin && (
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" disabled={isDeleting}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            {t('detail.delete.button')}
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>{t('detail.delete.title')}</AlertDialogTitle>
                            <AlertDialogDescription>
                                {t('detail.delete.description', { projectName: project.projectName })}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>{t('detail.delete.cancel')}</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteProject} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
                                {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                {isDeleting ? t('detail.delete.deleting') : t('detail.delete.confirm')}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </div>
      </div>

      <div>
        <h1 className="text-3xl font-bold">{project.projectName}</h1>
        <p className="text-muted-foreground">{t('detail.clientLabel')}: {project.clientName}</p>
      </div>

      <Tabs defaultValue="tasks" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
          <TabsTrigger value="summary"><Briefcase className="mr-2 h-4 w-4" />{t('detail.tabs.summary')}</TabsTrigger>
          <TabsTrigger value="tasks"><FileText className="mr-2 h-4 w-4" />{t('detail.tabs.tasks')}</TabsTrigger>
          <TabsTrigger value="marketing"><BarChart2 className="mr-2 h-4 w-4" />{t('detail.tabs.marketing')}</TabsTrigger>
          <TabsTrigger value="finance"><DollarSign className="mr-2 h-4 w-4" />{t('detail.tabs.finance')}</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="mt-4">
            <Card>
                <CardHeader>
                    <CardTitle>{t('detail.kanban.title')}</CardTitle>
                    <CardDescription>{t('detail.kanban.description')}</CardDescription>
                </CardHeader>
                <CardContent>
                   <Accordion type="single" collapsible defaultValue={project.phases && project.phases.length > 0 ? project.phases[0].id : undefined} className="w-full">
                     {(project.phases || []).map((phase) => (
                        <AccordionItem value={phase.id} key={phase.id}>
                            <AccordionTrigger className="text-lg font-medium hover:no-underline">
                                <div className="flex items-center gap-3">
                                    <Layers className="h-5 w-5" />
                                    {phase.name}
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                {phase.notes && (
                                    <div className="p-3 mb-4 text-sm text-amber-900 bg-amber-100 border-l-4 border-amber-500 rounded-r-lg dark:bg-amber-950 dark:text-amber-300">
                                        <p className="font-semibold flex items-center gap-2"><StickyNote className="h-4 w-4"/>{t('detail.kanban.phaseNote')}:</p>
                                        <p className="mt-1 whitespace-pre-wrap">{phase.notes}</p>
                                    </div>
                                )}
                                <div className="flex justify-end mb-4">
                                     <CreateTaskForm projectId={projectId} phases={project.phases || []} teamMembers={teamMembers} defaultPhaseId={phase.id}>
                                        <Button><PlusCircle className="mr-2 h-4 w-4" />{t('detail.kanban.addTaskButton')}</Button>
                                    </CreateTaskForm>
                                </div>
                                <KanbanBoard projectId={projectId} phaseId={phase.id} teamMembers={teamMembers} />
                            </AccordionContent>
                        </AccordionItem>
                     ))}
                   </Accordion>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="summary" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('detail.summary.title')}</CardTitle>
              <CardDescription>{t('detail.summary.description')}</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                   <div className="flex items-center">
                        <Flag className="h-5 w-5 mr-3 text-muted-foreground" />
                        <div>
                            <p className="text-sm text-muted-foreground">{t('detail.summary.status')}</p>
                            <p className="font-semibold">{project.status}</p>
                        </div>
                   </div>
                    <div className="flex items-center">
                        <Briefcase className="h-5 w-5 mr-3 text-muted-foreground" />
                        <div>
                            <p className="text-sm text-muted-foreground">{t('detail.summary.type')}</p>
                            <p className="font-semibold">{project.projectType}</p>
                        </div>
                   </div>
                    <div className="flex items-center">
                        <Calendar className="h-5 w-5 mr-3 text-muted-foreground" />
                        <div>
                            <p className="text-sm text-muted-foreground">{t('detail.summary.duration')}</p>
                            <p className="font-semibold">{new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}</p>
                        </div>
                   </div>
                   <div className="flex items-center">
                        <DollarSign className="h-5 w-5 mr-3 text-muted-foreground" />
                        <div>
                            <p className="text-sm text-muted-foreground">{t('detail.summary.budget')}</p>
                            <p className="font-semibold">{project.budget ? `${project.budget.toLocaleString('de-DE')} €` : t('detail.summary.notDefined')}</p>
                        </div>
                   </div>
                </div>
                <div className="space-y-4">
                    <div className="flex items-start">
                        <User className="h-5 w-5 mr-3 mt-1 text-muted-foreground" />
                        <div>
                            <p className="text-sm text-muted-foreground">{t('detail.summary.owner')}</p>
                            {projectOwner ? (
                                <div className="flex items-center gap-2 font-semibold">
                                     <Avatar className="h-6 w-6">
                                        <AvatarImage src={projectOwner.profile.photoUrl} />
                                        <AvatarFallback>{getInitials(projectOwner.profile.fullName)}</AvatarFallback>
                                    </Avatar>
                                    {projectOwner.profile.fullName}
                                </div>
                            ) : (
                                <p className="font-semibold">{t('detail.summary.unassigned')}</p>
                            )}
                        </div>
                   </div>
                   <div className="flex items-start">
                        <Users className="h-5 w-5 mr-3 mt-1 text-muted-foreground" />
                        <div>
                            <p className="text-sm text-muted-foreground">{t('detail.summary.team')}</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {teamMembers.map(member => (
                                    <div key={member.uid} className="flex items-center gap-2 p-1 bg-secondary rounded-md">
                                        <Avatar className="h-5 w-5">
                                            <AvatarImage src={member.profile.photoUrl} />
                                            <AvatarFallback className="text-xs">{getInitials(member.profile.fullName)}</AvatarFallback>
                                        </Avatar>
                                        <span className="text-xs font-medium">{member.profile.fullName}</span>
                                    </div>
                                ))}
                                {teamMembers.length === 0 && <p className="text-xs text-muted-foreground">{t('detail.summary.noTeamMembers')}</p>}
                            </div>
                        </div>
                   </div>
                </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="marketing" className="mt-4">
          <ProjectMarketingCalendar projectId={projectId} customerId={project.customerId}/>
        </TabsContent>
        <TabsContent value="finance" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('detail.finance.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{t('detail.finance.description')}</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}


'use client';

import { TeamMemberTable } from '@/components/team-member-table';
import { CreateTeamMemberForm } from '@/components/create-team-member-form';
import { ShieldCheck, PlusCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/components/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '@/lib/firebase';
import type { InternalUser } from '@/lib/types';
import { useTranslation } from 'react-i18next';


export default function TeamsPage() {
    const { t } = useTranslation(['dashboard', 'common']);
    const { isSuperadmin, isLoading: isAuthLoading } = useAuth();
    const router = useRouter();

    const [teamData, setTeamData] = useState<{ collaborators: InternalUser[], teamOffice: InternalUser[] }>({ collaborators: [], teamOffice: [] });
    const [isTeamDataLoading, setIsTeamDataLoading] = useState(true);

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
                .catch(error => console.error("Error al cargar datos del equipo:", error))
                .finally(() => setIsTeamDataLoading(false));
        } else if (!isAuthLoading && !isSuperadmin) {
             router.push('/dashboard');
             setIsTeamDataLoading(false);
        }
    }, [isSuperadmin, isAuthLoading, router]);
    
    const isLoading = isAuthLoading || isTeamDataLoading;
    
    if (isLoading) {
         return (
             <div className="flex h-screen w-full items-center justify-center">
                 <Loader2 className="h-8 w-8 animate-spin" />
             </div>
         );
    }
    
 return (
    <>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 sm:mt-0">
        <div className="flex items-center gap-4 self-start">
          <ShieldCheck className="h-8 w-8" />
          <h1 className="text-2xl sm:text-3xl font-bold">{t('common:nav.teams')}</h1>
        </div>
        <div className="w-full sm:w-auto">
            <CreateTeamMemberForm>
                <Button className="w-full">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {t('dashboard:teams.addMember')}
                </Button>
            </CreateTeamMemberForm>
        </div>
      </div>
       <Tabs defaultValue="colaboradores" className="mt-6">
            <TabsList>
                <TabsTrigger value="colaboradores">{t('dashboard:teams.tabs.collaborators')}</TabsTrigger>
                <TabsTrigger value="teamoffice">{t('dashboard:teams.tabs.teamOffice')}</TabsTrigger>
            </TabsList>
            <TabsContent value="colaboradores">
                <TeamMemberTable role="colaborador" users={teamData.collaborators} loading={isLoading} />
            </TabsContent>
            <TabsContent value="teamoffice">
                 <TeamMemberTable role="teamoffice" users={teamData.teamOffice} loading={isLoading} />
            </TabsContent>
        </Tabs>
    </>
  );
}

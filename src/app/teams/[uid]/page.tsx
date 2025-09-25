
'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { notFound, useParams, useRouter as useNextRouter } from 'next/navigation';
import { db, app } from '@/lib/firebase';
import { getFunctions, httpsCallable } from 'firebase/functions';
import type { InternalUser } from '@/lib/types';
import { useAuth } from '@/components/auth-provider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ShieldCheck, ArrowLeft, Mail, Phone, Globe, Calendar, Key, Loader2, Save } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';


const allModules = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'customers', label: 'Clientes' },
    { id: 'projects', label: 'Proyectos' },
    { id: 'offers', label: 'Ofertas' },
    { id: 'expenses', label: 'Gastos' },
    { id: 'marketing', label: 'Marketing (Content Pool & Plan)' },
    { id: 'support', label: 'Soporte' },
    { id: 'communications', label: 'Comunicaciones' },
    { id: 'connections', label: 'Conexiones' },
    { id: 'teams', label: 'Gestión de Equipos' },
];


export default function TeamMemberPage() {
    const { t } = useTranslation('dashboard');
    const { user: currentUser, isSuperadmin } = useAuth();
    const [member, setMember] = useState<InternalUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [selectedModules, setSelectedModules] = useState<string[]>([]);
    const params = useParams();
    const router = useNextRouter();
    const { toast } = useToast();
    const uid = params.uid as string;

    useEffect(() => {
        if (!uid) return;
        
        const fetchMember = async () => {
            const docRef = doc(db, 'users', uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = { ...docSnap.data(), uid: docSnap.id } as InternalUser;
                setMember(data);
                setSelectedModules(data.accessibleModules || []);
            } else {
                notFound();
            }
            setLoading(false);
        };
        fetchMember();
    }, [uid]);
    
    const getInitials = (name: string) => {
        if (!name) return '?';
        const names = name.split(' ');
        return names.length > 1 ? `${names[0][0]}${names[1][0]}`.toUpperCase() : name.substring(0, 2).toUpperCase();
    };
    
    const handleModuleChange = (moduleId: string, checked: boolean) => {
        setSelectedModules(prev =>
            checked ? [...prev, moduleId] : prev.filter(id => id !== moduleId)
        );
    };

    const handleSaveChanges = async () => {
        if (!isSuperadmin) {
            toast({ variant: 'destructive', title: 'Acción no permitida', description: t('teams.profile.permissionsCard.noPermission') });
            return;
        }
        setIsSaving(true);
        try {
            const functions = getFunctions(app, 'europe-west1');
            const updateUserPermissions = httpsCallable(functions, 'updateUserPermissions');
            await updateUserPermissions({ userId: uid, modules: selectedModules });
            toast({ title: t('teams.profile.permissionsCard.success'), description: t('teams.profile.permissionsCard.successDescription', {name: member?.profile.fullName}) });
        } catch (error: any) {
             toast({ variant: 'destructive', title: t('teams.profile.permissionsCard.error'), description: error.message });
        } finally {
            setIsSaving(false);
        }
    };


    if (loading) {
        return (
             <div className="space-y-6">
                <Skeleton className="h-10 w-32" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Skeleton className="h-64 md:col-span-1" />
                    <Skeleton className="h-64 md:col-span-2" />
                </div>
            </div>
        )
    }

    if (!member) {
        return notFound();
    }
    
    const hasChanges = JSON.stringify(selectedModules.sort()) !== JSON.stringify((member.accessibleModules || []).sort());


    return (
        <div className="space-y-6">
            <Button variant="outline" onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('teams.profile.backButton')}
            </Button>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Columna de Perfil */}
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardHeader className="items-center text-center">
                            <Avatar className="h-24 w-24 mb-4">
                                <AvatarImage src={member.profile.photoUrl} />
                                <AvatarFallback className="text-3xl">{getInitials(member.profile.fullName)}</AvatarFallback>
                            </Avatar>
                            <CardTitle>{member.profile.fullName}</CardTitle>
                            <CardDescription className="capitalize">{t(`teams.profile.profileCard.role.${member.role}` as any)}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-muted-foreground" /><span>{member.email}</span></div>
                            <div className="flex items-center gap-3"><Phone className="h-4 w-4 text-muted-foreground" /><span>{member.profile.whatsapp}</span></div>
                            <div className="flex items-center gap-3"><Globe className="h-4 w-4 text-muted-foreground" /><span>{member.profile.country}</span></div>
                            <div className="flex items-center gap-3"><Calendar className="h-4 w-4 text-muted-foreground" /><span>{t('teams.profile.profileCard.memberSince')}: {new Date(member.profile.memberSince).toLocaleDateString()}</span></div>
                            <div className="flex items-center gap-3"><Key className="h-4 w-4 text-muted-foreground" /><span>{t('teams.profile.profileCard.uid')}: {member.uid}</span></div>
                        </CardContent>
                    </Card>
                </div>

                {/* Columna de Permisos */}
                <div className="lg:col-span-2">
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><ShieldCheck /> {t('teams.profile.permissionsCard.title')}</CardTitle>
                            <CardDescription>
                               {isSuperadmin ? t('teams.profile.permissionsCard.description') : t('teams.profile.permissionsCard.description_viewer')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {allModules.map(module => (
                                    <div key={module.id} className="flex items-center space-x-2 rounded-md border p-3">
                                        <Checkbox
                                            id={module.id}
                                            checked={selectedModules.includes(module.id)}
                                            onCheckedChange={(checked) => handleModuleChange(module.id, !!checked)}
                                            disabled={!isSuperadmin}
                                        />
                                        <Label htmlFor={module.id} className="font-normal cursor-pointer flex-1">{module.label}</Label>
                                    </div>
                                ))}
                            </div>
                            {isSuperadmin && (
                                 <div className="flex justify-end pt-4">
                                    <Button onClick={handleSaveChanges} disabled={isSaving || !hasChanges}>
                                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                        {isSaving ? t('teams.profile.permissionsCard.savingButton') : t('teams.profile.permissionsCard.saveButton')}
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

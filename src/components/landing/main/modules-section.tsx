'use client';

import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Users, FolderKanban, BarChart, FileText, Receipt, Mail, Briefcase, Zap, Leaf, BrainCircuit, ShieldCheck, FolderSync } from 'lucide-react';

export function ModulesSection() {
  const { t } = useTranslation('landing');
  const modules = [
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: t('modules.crm.title'),
      description: t('modules.crm.description'),
    },
    {
      icon: <FolderKanban className="h-8 w-8 text-primary" />,
      title: t('modules.projects.title'),
      description: t('modules.projects.description'),
    },
    {
      icon: <Briefcase className="h-8 w-8 text-primary" />,
      title: t('modules.marketing.title'),
      description: t('modules.marketing.description'),
    },
    {
      icon: <FileText className="h-8 w-8 text-primary" />,
      title: t('modules.offers.title'),
      description: t('modules.offers.description'),
    },
    {
      icon: <Receipt className="h-8 w-8 text-primary" />,
      title: t('modules.expenses.title'),
      description: t('modules.expenses.description'),
    },
    {
      icon: <Mail className="h-8 w-8 text-primary" />,
      title: t('modules.communications.title'),
      description: t('modules.communications.description'),
    },
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: t('modules.automation.title'),
      description: t('modules.automation.description'),
    },
    {
      icon: <ShieldCheck className="h-8 w-8 text-primary" />,
      title: t('modules.teams.title'),
      description: t('modules.teams.description'),
    },
  ];

  return (
    <section id="modules" className="py-16 lg:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            {t('modules.title')}
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            {t('modules.subtitle')}
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {modules.map((module) => (
            <Card key={module.title} className="hover:shadow-lg hover:-translate-y-1 transition-transform">
              <CardHeader>
                <div className="flex items-center gap-4">
                  {module.icon}
                  <CardTitle>{module.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{module.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Inbox, Send, FileEdit, Trash2, Mail, Users, Archive, AlertOctagon, Bot, CornerUpLeft, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';


// --- DATOS DE EJEMPLO (se reemplazarán con datos reales de la API de Gmail) ---
const sampleEmails = [
  { id: '1', from: 'info@dicilo.com', subject: 'Bienvenido a nuestro servicio', body: 'Hola, te damos la bienvenida...', date: 'hace 2h', unread: true },
  { id: '2', from: 'soporte@proveedor.com', subject: 'RE: Consulta sobre API', body: 'Estimado cliente, hemos recibido su consulta...', date: 'ayer', unread: false },
  { id: '3', from: 'marketing@evento.com', subject: 'Última oportunidad para registrarte', body: 'No te pierdas el evento del año...', date: 'hace 3d', unread: false },
  { id: '4', from: 'no-reply@github.com', subject: '[erp-dicilo] Tu despliegue ha finalizado', body: 'El despliegue en Firebase Hosting ha finalizado correctamente.', date: 'hace 4d', unread: false },
  { id: '5', from: 'rrhh@empresa.com', subject: 'Proceso de selección', body: 'Gracias por tu interés en la posición de desarrollador...', date: 'hace 5d', unread: false },
];
type Email = typeof sampleEmails[0];

const sampleAccounts = [
  { email: 'usuario@gmail.com', type: 'gmail', connected: true }
];

// --- Componentes Separados ---

const AccountPanel = ({ onConnect }: { onConnect: () => void }) => {
  const { t } = useTranslation('communications');
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold">{t('hub.accounts.title')}</h2>
      {sampleAccounts.map(acc => (
        <div key={acc.email} className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={`https://www.google.com/s2/favicons?domain=gmail.com&sz=32`} />
            <AvatarFallback>G</AvatarFallback>
          </Avatar>
          <div className="truncate">
            <p className="text-sm font-medium">{acc.email}</p>
            <p className="text-xs text-green-500">{t('hub.accounts.connected')}</p>
          </div>
        </div>
      ))}
      <Button onClick={onConnect} className="w-full">{t('hub.accounts.connect')}</Button>
    </div>
  );
};

const FolderPanel = () => {
  const { t } = useTranslation('communications');
  return (
    <div className="p-4 space-y-2">
      <h2 className="text-lg font-semibold">{t('hub.folders.title')}</h2>
      <Button variant="secondary" className="w-full justify-start gap-2"><Inbox /> {t('hub.folders.inbox')} <span className="ml-auto text-xs">1</span></Button>
      <Button variant="ghost" className="w-full justify-start gap-2"><Send /> {t('hub.folders.sent')}</Button>
      <Button variant="ghost" className="w-full justify-start gap-2"><FileEdit /> {t('hub.folders.drafts')}</Button>
      <Button variant="ghost" className="w-full justify-start gap-2"><Trash2 /> {t('hub.folders.trash')}</Button>
    </div>
  );
};

const EmailListPanel = ({ onSelectEmail }: { onSelectEmail: (email: Email) => void }) => (
  <div className="flex flex-col h-full">
    <div className="p-4">
        <Input placeholder={'Buscar en correos...'} />
    </div>
    <Separator />
    <div className="flex-grow overflow-y-auto">
      {sampleEmails.map(email => (
        <div
          key={email.id}
          className="p-4 border-b cursor-pointer hover:bg-muted/50"
          onClick={() => onSelectEmail(email)}
        >
          <div className="flex justify-between items-center">
            <p className={`font-semibold text-sm ${email.unread ? 'text-foreground' : 'text-muted-foreground'}`}>{email.from}</p>
            <p className="text-xs text-muted-foreground">{email.date}</p>
          </div>
          <p className="text-sm truncate">{email.subject}</p>
          <p className="text-xs text-muted-foreground truncate">{email.body}</p>
        </div>
      ))}
    </div>
  </div>
);

const EmailDetailPanel = ({ email, onAiReply, onBack }: { email: Email; onAiReply: () => void, onBack?: () => void }) => {
    const { t } = useTranslation('communications');
    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b flex items-center gap-2">
                {onBack && <Button variant="ghost" size="icon" className="mr-2 md:hidden" onClick={onBack}><ArrowLeft className="h-4 w-4"/></Button>}
                <div>
                    <h2 className="text-xl font-bold">{email.subject}</h2>
                    <p className="text-sm text-muted-foreground">De: {email.from}</p>
                </div>
            </div>
            <div className="flex-grow p-4 overflow-y-auto">
                <p>{email.body}</p>
                <br /><p>...</p>
            </div>
            <Separator/>
            <div className="p-4 space-y-3 bg-background">
                <Textarea placeholder={t('hub.reply.placeholder')} rows={5}/>
                <div className="flex justify-between">
                <Button><Send className="mr-2 h-4 w-4"/> {t('hub.reply.send')}</Button>
                    <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="outline" onClick={onAiReply}><Bot className="mr-2 h-4 w-4"/> {t('hub.reply.aiAssist')}</Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{t('hub.reply.aiTooltip')}</p>
                        </TooltipContent>
                    </Tooltip>
                    </TooltipProvider>
                </div>
            </div>
        </div>
    )
};


export default function EmailHubPage() {
  const { t } = useTranslation('communications');
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(sampleEmails[0]);
  const isMobile = useIsMobile();
  
  const handleConnectGmail = () => {
    alert('INICIANDO CONEXIÓN CON GMAIL (SIMULACIÓN). Se redirigiría al usuario a la pantalla de consentimiento de Google.');
  };
  
  const handleAiReply = () => {
     alert('ACCIÓN DE IA (SIMULACIÓN). Se analizaría el correo y se generaría una propuesta de respuesta.');
  }

  // --- Layout para móvil ---
  if (isMobile) {
      return (
         <div className="flex flex-col h-[calc(100vh-100px)] overflow-hidden">
            <div className="flex items-center gap-4 mb-4">
                <Mail className="h-8 w-8" />
                <div>
                <h1 className="text-2xl sm:text-3xl font-bold">{t('hub.title')}</h1>
                <p className="text-muted-foreground">{t('hub.description')}</p>
                </div>
            </div>
            <div className="flex-grow border rounded-lg">
                {!selectedEmail ? (
                    <EmailListPanel onSelectEmail={setSelectedEmail} />
                ) : (
                    <EmailDetailPanel email={selectedEmail} onAiReply={handleAiReply} onBack={() => setSelectedEmail(null)} />
                )}
            </div>
         </div>
      );
  }

  // --- Layout para Escritorio ---
  return (
    <div className="flex flex-col h-[calc(100vh-100px)] overflow-hidden">
      <div className="flex items-center gap-4 mb-4">
        <Mail className="h-8 w-8" />
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">{t('hub.title')}</h1>
          <p className="text-muted-foreground">{t('hub.description')}</p>
        </div>
      </div>
      
      <ResizablePanelGroup direction="horizontal" className="flex-grow rounded-lg border">
        
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <AccountPanel onConnect={handleConnectGmail} />
            <Separator />
            <FolderPanel />
        </ResizablePanel>
        
        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={30} minSize={20}>
            <EmailListPanel onSelectEmail={setSelectedEmail} />
        </ResizablePanel>

        <ResizableHandle withHandle />
        
        <ResizablePanel defaultSize={50} minSize={30}>
            {selectedEmail ? (
                <EmailDetailPanel email={selectedEmail} onAiReply={handleAiReply} />
            ) : (
                <div className="flex h-full items-center justify-center">
                    <p className="text-muted-foreground">{t('hub.noEmailSelected')}</p>
                </div>
            )}
        </ResizablePanel>

      </ResizablePanelGroup>
    </div>
  );
}

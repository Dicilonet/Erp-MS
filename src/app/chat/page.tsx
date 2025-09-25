
'use client';

import { useState } from 'react';
import { ConversationList } from '@/components/chat/conversation-list';
import { ChatWindow } from '@/components/chat/chat-window';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/components/auth-provider';
import { FullScreenLoader } from '@/components/ui/fullscreen-loader';
import { useTranslation } from 'react-i18next';

export default function ChatPage() {
  const { t } = useTranslation('chat');
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const { user, isLoading } = useAuth();

  if (isLoading || !user) {
    return <FullScreenLoader />;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-100px)]">
        <div className="mb-6">
             <h1 className="text-3xl font-bold">{t('title')}</h1>
             <p className="text-muted-foreground">{t('description')}</p>
        </div>
      <Card className="flex-grow grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 h-full">
        <div className="col-span-1 border-r h-full">
          <ConversationList
            currentUserUid={user.uid}
            onSelectConversation={setSelectedConversationId}
            selectedConversationId={selectedConversationId}
          />
        </div>
        <div className="col-span-1 md:col-span-2 lg:col-span-3 h-full">
          <ChatWindow
            currentUserUid={user.uid}
            conversationId={selectedConversationId}
          />
        </div>
      </Card>
    </div>
  );
}


'use client';

import { Flame, ArrowUp, ArrowDown, ChevronsUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { TaskPriority } from '@/lib/types';

interface PriorityBadgeProps {
  priority: TaskPriority;
}

const priorityConfig: Record<TaskPriority, { icon: React.ReactNode, color: 'destructive' | 'default' | 'secondary' | 'outline' }> = {
  'Crítica': { icon: <Flame className="h-3 w-3" />, color: 'destructive' },
  'Alta': { icon: <ChevronsUp className="h-3 w-3" />, color: 'default' },
  'Media': { icon: <ArrowUp className="h-3 w-3" />, color: 'secondary' },
  'Baja': { icon: <ArrowDown className="h-3 w-3" />, color: 'outline' },
};

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config = priorityConfig[priority] || priorityConfig['Media'];

  return (
    <Badge variant={config.color} className="flex items-center gap-1.5">
      {config.icon}
      <span>{priority}</span>
    </Badge>
  );
}

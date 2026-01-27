import { cn } from '@/lib/utils';
import { ConnectionStatus as ConnectionStatusType } from '@/types/patient';
import { CheckCircle2, XCircle, Loader2, Unplug } from 'lucide-react';

interface ConnectionStatusProps {
  status: ConnectionStatusType;
  showLabel?: boolean;
  errorMessage?: string;
}

export function ConnectionStatus({ status, showLabel = true, errorMessage }: ConnectionStatusProps) {
  const config = {
    connected: {
      icon: CheckCircle2,
      label: 'EMR已连接',
      className: 'text-status-connected',
      bgClassName: 'bg-green-50',
    },
    error: {
      icon: XCircle,
      label: errorMessage || 'EMR连接失败',
      className: 'text-status-error',
      bgClassName: 'bg-red-50',
    },
    pending: {
      icon: Loader2,
      label: '正在连接...',
      className: 'text-status-pending',
      bgClassName: 'bg-yellow-50',
    },
    disconnected: {
      icon: Unplug,
      label: '未连接',
      className: 'text-muted-foreground',
      bgClassName: 'bg-muted',
    },
  };

  const { icon: Icon, label, className, bgClassName } = config[status];

  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium",
      bgClassName
    )}>
      <Icon className={cn("w-3.5 h-3.5", className, status === 'pending' && 'animate-spin')} />
      {showLabel && <span className={className}>{label}</span>}
    </div>
  );
}

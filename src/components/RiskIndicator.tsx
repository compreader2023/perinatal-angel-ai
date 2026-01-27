import { cn } from '@/lib/utils';
import { RiskLevel } from '@/types/patient';

interface RiskIndicatorProps {
  level: RiskLevel;
  probability?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animate?: boolean;
}

export function RiskIndicator({ 
  level, 
  probability, 
  size = 'md', 
  showLabel = false,
  animate = true 
}: RiskIndicatorProps) {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-6 h-6',
  };

  const labelText = {
    high: '高危',
    medium: '中危',
    low: '低危',
  };

  const labelColors = {
    high: 'text-risk-high',
    medium: 'text-risk-medium',
    low: 'text-risk-low',
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex items-center justify-center">
        {/* Ping animation for high risk */}
        {animate && level === 'high' && (
          <span className={cn(
            "absolute rounded-full bg-risk-high opacity-75 animate-ping-slow",
            sizeClasses[size]
          )} />
        )}
        {/* Pulse animation for medium risk */}
        {animate && level === 'medium' && (
          <span className={cn(
            "absolute rounded-full bg-risk-medium opacity-50 animate-pulse-slow",
            sizeClasses[size]
          )} />
        )}
        {/* Main indicator */}
        <span className={cn(
          "relative rounded-full",
          sizeClasses[size],
          level === 'high' && 'bg-risk-high',
          level === 'medium' && 'bg-risk-medium',
          level === 'low' && 'bg-risk-low',
        )} />
      </div>
      {showLabel && (
        <span className={cn("text-sm font-medium", labelColors[level])}>
          {labelText[level]}
          {probability !== undefined && ` (${probability}%)`}
        </span>
      )}
    </div>
  );
}

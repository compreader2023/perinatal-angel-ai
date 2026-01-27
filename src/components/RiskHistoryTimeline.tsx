import { RiskHistory, RiskLevel } from '@/types/patient';
import { RiskIndicator } from './RiskIndicator';
import { cn } from '@/lib/utils';

interface RiskHistoryTimelineProps {
  history: RiskHistory[];
  compact?: boolean;
}

export function RiskHistoryTimeline({ history, compact = false }: RiskHistoryTimelineProps) {
  if (history.length === 0) {
    return <span className="text-muted-foreground text-sm">暂无历史数据</span>;
  }

  if (compact) {
    // Show last 7 days as small dots
    const recentHistory = history.slice(-7);
    return (
      <div className="flex items-center gap-1">
        {recentHistory.map((record, index) => (
          <div
            key={record.date}
            className="group relative"
          >
            <RiskIndicator level={record.level} size="sm" animate={false} />
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
              {record.date}: {record.probability}%
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {history.map((record, index) => (
        <div key={record.date} className="flex items-center gap-3">
          <RiskIndicator level={record.level} size="sm" animate={false} />
          <span className="text-sm text-muted-foreground">{record.date}</span>
          <span className="text-sm font-medium">{record.probability}%</span>
        </div>
      ))}
    </div>
  );
}

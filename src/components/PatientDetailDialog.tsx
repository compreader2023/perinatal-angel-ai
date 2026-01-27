import { Patient } from '@/types/patient';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RiskIndicator } from './RiskIndicator';
import { ConnectionStatus } from './ConnectionStatus';
import { RiskHistoryTimeline } from './RiskHistoryTimeline';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Activity, 
  Calendar, 
  FileText, 
  Heart, 
  TrendingUp,
  User
} from 'lucide-react';

interface PatientDetailDialogProps {
  patient: Patient | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PatientDetailDialog({ patient, open, onOpenChange }: PatientDetailDialogProps) {
  if (!patient) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-xl">{patient.name}</span>
                  <RiskIndicator 
                    level={patient.currentRisk} 
                    probability={patient.currentProbability}
                    showLabel 
                  />
                </div>
                <p className="text-sm text-muted-foreground font-normal">
                  住院号: {patient.admissionNumber}
                </p>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              概览
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              风险历史
            </TabsTrigger>
            <TabsTrigger value="records" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              病历记录
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="medical-card p-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-3">基本信息</h4>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-sm text-muted-foreground">年龄</dt>
                    <dd className="text-sm font-medium">{patient.age}岁</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-muted-foreground">孕周</dt>
                    <dd className="text-sm font-medium">{patient.gestationalWeeks}周</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-muted-foreground">入院日期</dt>
                    <dd className="text-sm font-medium">{patient.admissionDate}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-muted-foreground">预产期</dt>
                    <dd className="text-sm font-medium">{patient.expectedDueDate}</dd>
                  </div>
                </dl>
              </div>

              <div className="medical-card p-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-3">系统状态</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">EMR连接</span>
                    <ConnectionStatus status={patient.emrStatus} />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">当前风险</span>
                    <RiskIndicator 
                      level={patient.currentRisk} 
                      probability={patient.currentProbability}
                      showLabel 
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">监测天数</span>
                    <span className="text-sm font-medium">{patient.riskHistory.length}天</span>
                  </div>
                </div>
              </div>

              {patient.medicalRecords.length > 0 && (
                <div className="medical-card p-4 col-span-2">
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">最新监测数据</h4>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-secondary/30 rounded-lg">
                      <p className="text-2xl font-bold text-primary">
                        {patient.medicalRecords[0].bloodOxygen}%
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">血氧饱和度</p>
                    </div>
                    <div className="text-center p-3 bg-secondary/30 rounded-lg">
                      <p className="text-2xl font-bold text-primary">
                        {patient.medicalRecords[0].bloodPressureSBP}/{patient.medicalRecords[0].bloodPressureDBP}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">血压 mmHg</p>
                    </div>
                    <div className="text-center p-3 bg-secondary/30 rounded-lg">
                      <p className="text-2xl font-bold text-primary">
                        {patient.medicalRecords[0].heartRate}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">心率 bpm</p>
                    </div>
                    <div className="text-center p-3 bg-secondary/30 rounded-lg">
                      <p className="text-2xl font-bold text-primary">
                        {patient.medicalRecords[0].fetalHeartRate}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">胎心率 bpm</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            <div className="medical-card p-4">
              <h4 className="text-sm font-medium text-muted-foreground mb-4">风险评估历史趋势</h4>
              <div className="space-y-3">
                {patient.riskHistory.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">暂无历史数据</p>
                ) : (
                  patient.riskHistory.slice().reverse().map((record, index) => (
                    <div 
                      key={record.date}
                      className="flex items-center gap-4 p-3 bg-secondary/30 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{record.date}</span>
                      </div>
                      <div className="flex-1 flex items-center gap-3">
                        <RiskIndicator level={record.level} animate={false} />
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all ${
                              record.level === 'high' ? 'bg-risk-high' :
                              record.level === 'medium' ? 'bg-risk-medium' : 'bg-risk-low'
                            }`}
                            style={{ width: `${record.probability}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold w-12 text-right">
                          {record.probability}%
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="records" className="mt-4">
            <ScrollArea className="h-[400px]">
              {patient.medicalRecords.length === 0 ? (
                <div className="medical-card p-8 text-center">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">暂无病历记录</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="data-table-header">
                      <TableHead>日期</TableHead>
                      <TableHead>血氧</TableHead>
                      <TableHead>血压</TableHead>
                      <TableHead>心率</TableHead>
                      <TableHead>胎心率</TableHead>
                      <TableHead>羊水指数</TableHead>
                      <TableHead>备注</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patient.medicalRecords.map((record) => (
                      <TableRow key={record.date}>
                        <TableCell className="font-medium">{record.date}</TableCell>
                        <TableCell>{record.bloodOxygen}%</TableCell>
                        <TableCell>{record.bloodPressureSBP}/{record.bloodPressureDBP}</TableCell>
                        <TableCell>{record.heartRate}</TableCell>
                        <TableCell>{record.fetalHeartRate}</TableCell>
                        <TableCell>{record.amnioticFluidIndex}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{record.notes}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

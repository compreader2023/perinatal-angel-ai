import { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { mockPatients } from '@/data/mockPatients';
import { Patient } from '@/types/patient';
import { Sidebar } from '@/components/Sidebar';
import { RiskIndicator } from '@/components/RiskIndicator';
import { ConnectionStatus } from '@/components/ConnectionStatus';
import { RiskHistoryTimeline } from '@/components/RiskHistoryTimeline';
import { PatientDetailDialog } from '@/components/PatientDetailDialog';
import { CreatePatientDialog } from '@/components/CreatePatientDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Plus, 
  Search, 
  Eye, 
  AlertTriangle,
  Activity,
  Users,
  TrendingUp
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Filter patients based on user role
  const accessiblePatients = useMemo(() => {
    if (user?.role === 'admin') return patients;
    if (user?.assignedPatients) {
      return patients.filter(p => user.assignedPatients?.includes(p.id));
    }
    return patients;
  }, [patients, user]);

  // Apply search and risk filters
  const filteredPatients = useMemo(() => {
    return accessiblePatients.filter(patient => {
      const matchesSearch = 
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.admissionNumber.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRisk = riskFilter === 'all' || patient.currentRisk === riskFilter;
      
      return matchesSearch && matchesRisk;
    });
  }, [accessiblePatients, searchQuery, riskFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = accessiblePatients.length;
    const highRisk = accessiblePatients.filter(p => p.currentRisk === 'high').length;
    const mediumRisk = accessiblePatients.filter(p => p.currentRisk === 'medium').length;
    const lowRisk = accessiblePatients.filter(p => p.currentRisk === 'low').length;
    return { total, highRisk, mediumRisk, lowRisk };
  }, [accessiblePatients]);

  const handlePatientCreated = (patient: Patient) => {
    setPatients(prev => [patient, ...prev]);
  };

  const handleViewPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsDetailOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 p-6 overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">监测仪表盘</h1>
            <p className="text-muted-foreground">实时监控孕妇围产期脑部缺氧风险</p>
          </div>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            创建监测档案
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="medical-card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">监测总数</p>
              </div>
            </div>
          </div>
          
          <div className="medical-card p-4 border-l-4 border-l-risk-high">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-risk-high" />
              </div>
              <div>
                <p className="text-2xl font-bold text-risk-high">{stats.highRisk}</p>
                <p className="text-sm text-muted-foreground">高危病例</p>
              </div>
            </div>
          </div>
          
          <div className="medical-card p-4 border-l-4 border-l-risk-medium">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center">
                <Activity className="w-5 h-5 text-risk-medium" />
              </div>
              <div>
                <p className="text-2xl font-bold text-risk-medium">{stats.mediumRisk}</p>
                <p className="text-sm text-muted-foreground">中危病例</p>
              </div>
            </div>
          </div>
          
          <div className="medical-card p-4 border-l-4 border-l-risk-low">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-risk-low" />
              </div>
              <div>
                <p className="text-2xl font-bold text-risk-low">{stats.lowRisk}</p>
                <p className="text-sm text-muted-foreground">低危病例</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="medical-card mb-6">
          <div className="p-4 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="搜索姓名或住院号..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={riskFilter} onValueChange={setRiskFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="风险等级" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部风险等级</SelectItem>
                <SelectItem value="high">高危</SelectItem>
                <SelectItem value="medium">中危</SelectItem>
                <SelectItem value="low">低危</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Patient Table */}
        <div className="medical-card">
          <Table>
            <TableHeader>
              <TableRow className="data-table-header">
                <TableHead>姓名</TableHead>
                <TableHead>住院号</TableHead>
                <TableHead>年龄</TableHead>
                <TableHead>孕周</TableHead>
                <TableHead>预产期</TableHead>
                <TableHead>EMR状态</TableHead>
                <TableHead>历史趋势</TableHead>
                <TableHead className="text-center">风险等级</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    没有找到匹配的监测记录
                  </TableCell>
                </TableRow>
              ) : (
                filteredPatients.map((patient) => (
                  <TableRow 
                    key={patient.id}
                    className={`
                      ${patient.currentRisk === 'high' ? 'bg-red-50/50' : ''}
                      ${patient.currentRisk === 'medium' ? 'bg-yellow-50/30' : ''}
                      hover:bg-accent/50 cursor-pointer
                    `}
                    onClick={() => handleViewPatient(patient)}
                  >
                    <TableCell className="font-medium">{patient.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {patient.admissionNumber}
                      </Badge>
                    </TableCell>
                    <TableCell>{patient.age}岁</TableCell>
                    <TableCell>{patient.gestationalWeeks}周</TableCell>
                    <TableCell>{patient.expectedDueDate}</TableCell>
                    <TableCell>
                      <ConnectionStatus status={patient.emrStatus} showLabel={false} />
                    </TableCell>
                    <TableCell>
                      <RiskHistoryTimeline history={patient.riskHistory} compact />
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center">
                        <RiskIndicator 
                          level={patient.currentRisk} 
                          probability={patient.currentProbability}
                          showLabel
                          size="lg"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewPatient(patient);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        详情
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </main>

      <PatientDetailDialog
        patient={selectedPatient}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />

      <CreatePatientDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onPatientCreated={handlePatientCreated}
      />
    </div>
  );
}

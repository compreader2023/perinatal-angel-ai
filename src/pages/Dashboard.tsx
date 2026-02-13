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
import { UploadRecordDialog } from '@/components/UploadRecordDialog';
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
  TrendingUp,
  Upload,
  Loader2,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

type SortField = 'gestationalWeeks' | 'expectedDueDate' | 'currentRisk' | 'none';
type SortDirection = 'asc' | 'desc';

const riskOrder: Record<string, number> = { high: 3, medium: 2, low: 1 };

export default function Dashboard() {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Sorting
  const [sortField, setSortField] = useState<SortField>('none');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [jumpPage, setJumpPage] = useState('');

  // All roles see the same patient list
  const accessiblePatients = patients;

  // Apply search and risk filters, then sort
  const filteredPatients = useMemo(() => {
    let result = accessiblePatients.filter(patient => {
      const matchesSearch = 
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.admissionNumber.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRisk = riskFilter === 'all' || patient.currentRisk === riskFilter;
      return matchesSearch && matchesRisk;
    });

    if (sortField !== 'none') {
      result = [...result].sort((a, b) => {
        let cmp = 0;
        if (sortField === 'gestationalWeeks') {
          cmp = a.gestationalWeeks - b.gestationalWeeks;
        } else if (sortField === 'expectedDueDate') {
          cmp = a.expectedDueDate.localeCompare(b.expectedDueDate);
        } else if (sortField === 'currentRisk') {
          cmp = (riskOrder[a.currentRisk] || 0) - (riskOrder[b.currentRisk] || 0);
        }
        return sortDirection === 'asc' ? cmp : -cmp;
      });
    }

    return result;
  }, [accessiblePatients, searchQuery, riskFilter, sortField, sortDirection]);

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(filteredPatients.length / pageSize));
  const paginatedPatients = filteredPatients.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Reset to page 1 when filters change
  useMemo(() => { setCurrentPage(1); }, [searchQuery, riskFilter, pageSize]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

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

  const handlePatientUpdated = (patient: Patient) => {
    setPatients(prev => prev.map(p => p.id === patient.id ? patient : p));
  };

  const handleViewPatient = (patient: Patient) => {
    if (patient.status === 'extracting' || patient.status === 'analyzing') return;
    setSelectedPatient(patient);
    setIsDetailOpen(true);
  };

  const handleJumpPage = () => {
    const page = parseInt(jumpPage);
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setJumpPage('');
    }
  };

  const renderPatientStatus = (patient: Patient) => {
    if (patient.status === 'extracting') {
      return (
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          数据提取中....
        </span>
      );
    }
    if (patient.status === 'analyzing') {
      return null; // show normal data
    }
    return null;
  };

  const renderRiskCell = (patient: Patient) => {
    if (patient.status === 'extracting') {
      return <span className="text-xs text-muted-foreground">—</span>;
    }
    if (patient.status === 'analyzing') {
      return (
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          AI分析中...
        </span>
      );
    }
    return (
      <RiskIndicator 
        level={patient.currentRisk} 
        probability={patient.currentProbability}
        showLabel
        size="lg"
      />
    );
  };

  const renderHistoryCell = (patient: Patient) => {
    if (patient.status === 'extracting' || patient.status === 'analyzing') {
      return <span className="text-xs text-muted-foreground">暂无</span>;
    }
    return <RiskHistoryTimeline history={patient.riskHistory} compact />;
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
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsUploadOpen(true)}>
              <Upload className="w-4 h-4 mr-2" />
              上传病历
            </Button>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              创建监测档案
            </Button>
          </div>
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
                <TableHead>
                  <button className="flex items-center gap-1 hover:text-foreground" onClick={() => handleSort('gestationalWeeks')}>
                    孕周
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </button>
                </TableHead>
                <TableHead>
                  <button className="flex items-center gap-1 hover:text-foreground" onClick={() => handleSort('expectedDueDate')}>
                    预产期
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </button>
                </TableHead>
                <TableHead>EMR状态</TableHead>
                <TableHead>历史趋势</TableHead>
                <TableHead className="text-center">
                  <button className="flex items-center gap-1 hover:text-foreground mx-auto" onClick={() => handleSort('currentRisk')}>
                    风险等级
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </button>
                </TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPatients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    没有找到匹配的监测记录
                  </TableCell>
                </TableRow>
              ) : (
                paginatedPatients.map((patient) => {
                  const isProcessing = patient.status === 'extracting';
                  return (
                    <TableRow 
                      key={patient.id}
                      className={`
                        ${!isProcessing && patient.currentRisk === 'high' ? 'bg-red-50/50' : ''}
                        ${!isProcessing && patient.currentRisk === 'medium' ? 'bg-yellow-50/30' : ''}
                        hover:bg-accent/50 ${isProcessing ? 'opacity-70' : 'cursor-pointer'}
                      `}
                      onClick={() => handleViewPatient(patient)}
                    >
                      <TableCell className="font-medium">
                        {isProcessing ? (
                          <span className="flex items-center gap-1.5">
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />
                            数据提取中....
                          </span>
                        ) : patient.name}
                      </TableCell>
                      <TableCell>
                        {isProcessing ? '—' : (
                          <Badge variant="outline" className="font-mono">
                            {patient.admissionNumber}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{isProcessing ? '—' : `${patient.gestationalWeeks}周`}</TableCell>
                      <TableCell>{isProcessing ? '—' : patient.expectedDueDate}</TableCell>
                      <TableCell>
                        <ConnectionStatus status={patient.emrStatus} showLabel={false} />
                      </TableCell>
                      <TableCell>
                        {renderHistoryCell(patient)}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          {renderRiskCell(patient)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {!isProcessing && patient.status !== 'analyzing' && (
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
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>每页</span>
              <Select value={pageSize.toString()} onValueChange={(v) => setPageSize(Number(v))}>
                <SelectTrigger className="w-[70px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <span>条，共 {filteredPatients.length} 条</span>
            </div>

            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" className="h-8 w-8" disabled={currentPage === 1} onClick={() => setCurrentPage(1)}>
                <ChevronsLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm px-3">{currentPage} / {totalPages}</span>
              <Button variant="outline" size="icon" className="h-8 w-8" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8" disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)}>
                <ChevronsRight className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-1 ml-2">
                <span className="text-sm text-muted-foreground">跳至</span>
                <Input
                  className="w-14 h-8 text-center"
                  value={jumpPage}
                  onChange={(e) => setJumpPage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleJumpPage()}
                />
                <span className="text-sm text-muted-foreground">页</span>
              </div>
            </div>
          </div>
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

      <UploadRecordDialog
        open={isUploadOpen}
        onOpenChange={setIsUploadOpen}
        onPatientCreated={handlePatientCreated}
        onPatientUpdated={handlePatientUpdated}
      />
    </div>
  );
}

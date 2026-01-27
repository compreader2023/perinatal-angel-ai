import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Link2, CheckCircle2, XCircle } from 'lucide-react';
import { Patient, ConnectionStatus } from '@/types/patient';
import { toast } from 'sonner';

interface CreatePatientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPatientCreated: (patient: Patient) => void;
}

export function CreatePatientDialog({ open, onOpenChange, onPatientCreated }: CreatePatientDialogProps) {
  const [name, setName] = useState('');
  const [admissionNumber, setAdmissionNumber] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [connectionError, setConnectionError] = useState('');

  const handleConnect = async () => {
    if (!name.trim() || !admissionNumber.trim()) {
      toast.error('请填写完整信息');
      return;
    }

    setIsConnecting(true);
    setConnectionStatus('pending');
    setConnectionError('');

    // Simulate EMR connection
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Random success/failure for demo
    const success = Math.random() > 0.3;
    
    if (success) {
      setConnectionStatus('connected');
      toast.success('EMR系统连接成功！');
    } else {
      const errors = [
        '患者信息不匹配，请核实住院号',
        '网络连接超时，请稍后重试',
        'EMR系统暂时不可用',
      ];
      const error = errors[Math.floor(Math.random() * errors.length)];
      setConnectionStatus('error');
      setConnectionError(error);
      toast.error(error);
    }

    setIsConnecting(false);
  };

  const handleSubmit = () => {
    if (connectionStatus !== 'connected') {
      toast.error('请先连接EMR系统');
      return;
    }

    const newPatient: Patient = {
      id: Date.now().toString(),
      name,
      admissionNumber,
      expectedDueDate: '2024-03-01', // Would be fetched from EMR
      admissionDate: new Date().toISOString().split('T')[0],
      age: 28,
      gestationalWeeks: 38,
      currentRisk: 'low',
      currentProbability: 30,
      emrStatus: 'connected',
      riskHistory: [],
      medicalRecords: [],
    };

    onPatientCreated(newPatient);
    handleClose();
    toast.success('监测档案创建成功！');
  };

  const handleClose = () => {
    setName('');
    setAdmissionNumber('');
    setConnectionStatus('disconnected');
    setConnectionError('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>创建监测档案</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">孕妇姓名</Label>
            <Input
              id="name"
              placeholder="请输入孕妇姓名"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={connectionStatus === 'connected'}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="admission">住院号</Label>
            <Input
              id="admission"
              placeholder="请输入住院号"
              value={admissionNumber}
              onChange={(e) => setAdmissionNumber(e.target.value)}
              disabled={connectionStatus === 'connected'}
            />
          </div>

          {/* EMR Connection Status */}
          <div className="p-4 rounded-lg border bg-secondary/30">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">EMR系统连接</span>
              {connectionStatus === 'connected' && (
                <div className="flex items-center gap-1.5 text-status-connected">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-xs font-medium">已连接</span>
                </div>
              )}
              {connectionStatus === 'error' && (
                <div className="flex items-center gap-1.5 text-status-error">
                  <XCircle className="w-4 h-4" />
                  <span className="text-xs font-medium">连接失败</span>
                </div>
              )}
            </div>

            {connectionError && (
              <p className="text-xs text-status-error mb-3">{connectionError}</p>
            )}

            {connectionStatus !== 'connected' && (
              <Button
                onClick={handleConnect}
                disabled={isConnecting || !name.trim() || !admissionNumber.trim()}
                className="w-full"
                variant={connectionStatus === 'error' ? 'destructive' : 'default'}
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    正在连接EMR系统...
                  </>
                ) : (
                  <>
                    <Link2 className="w-4 h-4 mr-2" />
                    {connectionStatus === 'error' ? '重新连接' : '连接EMR系统'}
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            取消
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={connectionStatus !== 'connected'}
          >
            创建档案
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

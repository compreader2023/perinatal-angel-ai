import { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Patient } from '@/types/patient';
import { Upload, FileText, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface UploadRecordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPatientCreated: (patient: Patient) => void;
  onPatientUpdated: (patient: Patient) => void;
}

export function UploadRecordDialog({ open, onOpenChange, onPatientCreated, onPatientUpdated }: UploadRecordDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type === 'application/pdf') {
      setFile(droppedFile);
    } else {
      toast.error('请上传PDF格式的文件');
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile?.type === 'application/pdf') {
      setFile(selectedFile);
    } else {
      toast.error('请上传PDF格式的文件');
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);

    // Create patient with extracting status
    const tempId = Date.now().toString();
    const extractingPatient: Patient = {
      id: tempId,
      name: '—',
      admissionNumber: '—',
      expectedDueDate: '—',
      admissionDate: new Date().toISOString().split('T')[0],
      gestationalWeeks: 0,
      currentRisk: 'low',
      currentProbability: 0,
      emrStatus: 'disconnected',
      riskHistory: [],
      medicalRecords: [],
      status: 'extracting',
    };
    onPatientCreated(extractingPatient);
    toast.success('文件上传成功，正在提取数据...');
    handleClose();

    // Simulate extraction delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Update with extracted data, now analyzing
    const analyzingPatient: Patient = {
      ...extractingPatient,
      name: '赵丽华',
      admissionNumber: 'A20240201',
      expectedDueDate: '2024-03-10',
      gestationalWeeks: 36,
      status: 'analyzing',
    };
    onPatientUpdated(analyzingPatient);

    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Final result with risk
    const risks: Array<{ risk: 'high' | 'medium' | 'low'; prob: number }> = [
      { risk: 'high', prob: 88 },
      { risk: 'medium', prob: 65 },
      { risk: 'low', prob: 30 },
    ];
    const selected = risks[Math.floor(Math.random() * risks.length)];
    const completedPatient: Patient = {
      ...analyzingPatient,
      currentRisk: selected.risk,
      currentProbability: selected.prob,
      status: 'ready',
    };
    onPatientUpdated(completedPatient);
    toast.success('病历分析完成！');
  };

  const handleClose = () => {
    if (!isUploading) {
      setFile(null);
    }
    setIsUploading(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>上传病历</DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
              ${isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/30 hover:border-primary/50'}
            `}
            onClick={() => document.getElementById('pdf-upload')?.click()}
          >
            {file ? (
              <div className="flex items-center justify-center gap-3">
                <FileText className="w-8 h-8 text-primary" />
                <div className="text-left">
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <>
                <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm font-medium">拖拽PDF文件到此处</p>
                <p className="text-xs text-muted-foreground mt-1">或点击选择本地文件</p>
              </>
            )}
            <input
              id="pdf-upload"
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>

          <Button
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="w-full"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                上传中...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                上传并解析
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RiskIndicator } from '@/components/RiskIndicator';
import { 
  Brain, 
  Loader2, 
  User, 
  Activity, 
  Stethoscope, 
  Baby,
  FileCheck,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';
import { RiskLevel } from '@/types/patient';

interface PredictionResult {
  probability: number;
  riskLevel: RiskLevel;
  factors: string[];
}

export default function ManualDetection() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);

  // Form state - Basic Info
  const [name, setName] = useState('');
  const [admissionNumber, setAdmissionNumber] = useState('');
  const [age, setAge] = useState<number>(28);
  
  // Routine Data
  const [complications, setComplications] = useState('无');
  const [adversePregnancyHistory, setAdversePregnancyHistory] = useState(false);
  const [weightGain, setWeightGain] = useState<number>(12);
  const [bmi, setBmi] = useState<number>(24);
  const [pregnancyCount, setPregnancyCount] = useState<number>(1);
  const [deliveryCount, setDeliveryCount] = useState<number>(0);
  const [abnormalFetalMovement, setAbnormalFetalMovement] = useState(false);
  
  // Monitoring Data
  const [bloodOxygen, setBloodOxygen] = useState<number>(98);
  const [bloodPressureSBP, setBloodPressureSBP] = useState<number>(120);
  const [bloodPressureDBP, setBloodPressureDBP] = useState<number>(80);
  const [heartRate, setHeartRate] = useState<number>(75);
  
  // Ultrasound Data
  const [gestationalWeeks, setGestationalWeeks] = useState<number>(38);
  const [amnioticFluidIndex, setAmnioticFluidIndex] = useState('12');
  const [placentaGrade, setPlacentaGrade] = useState('II级');
  const [umbilicalBloodFlowRatio, setUmbilicalBloodFlowRatio] = useState<number>(2.5);
  const [umbilicalCordAroundNeck, setUmbilicalCordAroundNeck] = useState(false);
  
  // Delivery Data
  const [prematureRuptureOfMembranes, setPrematureRuptureOfMembranes] = useState(false);
  const [placentaPrevia, setPlacentaPrevia] = useState(false);
  const [placentalAbruption, setPlacentalAbruption] = useState(false);
  const [scarredUterus, setScarredUterus] = useState(false);
  
  // Fetal Data
  const [fetalHeartRate, setFetalHeartRate] = useState<number>(140);

  const handleAnalyze = async () => {
    if (!name.trim() || !admissionNumber.trim()) {
      toast.error('请填写基本信息');
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Calculate mock risk based on input factors
    let riskScore = 0;
    const factors: string[] = [];

    // Risk factors assessment
    if (bloodPressureSBP > 140 || bloodPressureDBP > 90) {
      riskScore += 25;
      factors.push('血压偏高');
    }
    if (bloodOxygen < 95) {
      riskScore += 20;
      factors.push('血氧饱和度偏低');
    }
    if (fetalHeartRate > 160 || fetalHeartRate < 110) {
      riskScore += 20;
      factors.push('胎心率异常');
    }
    if (umbilicalCordAroundNeck) {
      riskScore += 15;
      factors.push('脐带绕颈');
    }
    if (adversePregnancyHistory) {
      riskScore += 10;
      factors.push('不良孕产史');
    }
    if (abnormalFetalMovement) {
      riskScore += 15;
      factors.push('胎动异常');
    }
    if (parseFloat(amnioticFluidIndex) < 8) {
      riskScore += 15;
      factors.push('羊水过少');
    }
    if (prematureRuptureOfMembranes) {
      riskScore += 15;
      factors.push('胎膜早破');
    }
    if (placentalAbruption) {
      riskScore += 30;
      factors.push('胎盘早剥');
    }
    if (placentaPrevia) {
      riskScore += 20;
      factors.push('前置胎盘');
    }
    if (age > 35) {
      riskScore += 10;
      factors.push('高龄产妇');
    }

    // Normalize score
    const probability = Math.min(Math.max(riskScore, 5), 98);
    
    let riskLevel: RiskLevel;
    if (probability >= 85) {
      riskLevel = 'high';
    } else if (probability >= 50) {
      riskLevel = 'medium';
    } else {
      riskLevel = 'low';
    }

    if (factors.length === 0) {
      factors.push('各项指标正常');
    }

    setResult({
      probability,
      riskLevel,
      factors,
    });

    setIsAnalyzing(false);
    toast.success('AI分析完成');
  };

  const handleReset = () => {
    setName('');
    setAdmissionNumber('');
    setAge(28);
    setComplications('无');
    setAdversePregnancyHistory(false);
    setWeightGain(12);
    setBmi(24);
    setPregnancyCount(1);
    setDeliveryCount(0);
    setAbnormalFetalMovement(false);
    setBloodOxygen(98);
    setBloodPressureSBP(120);
    setBloodPressureDBP(80);
    setHeartRate(75);
    setGestationalWeeks(38);
    setAmnioticFluidIndex('12');
    setPlacentaGrade('II级');
    setUmbilicalBloodFlowRatio(2.5);
    setUmbilicalCordAroundNeck(false);
    setPrematureRuptureOfMembranes(false);
    setPlacentaPrevia(false);
    setPlacentalAbruption(false);
    setScarredUterus(false);
    setFetalHeartRate(140);
    setResult(null);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">手动检测</h1>
              <p className="text-muted-foreground">录入孕妇病程参数，快速进行风险评估</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form Section */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileCheck className="w-5 h-5" />
                    病程参数录入
                  </CardTitle>
                  <CardDescription>
                    请填写孕妇的各项检查数据用于风险预测
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="basic" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 mb-6">
                      <TabsTrigger value="basic" className="text-xs">
                        <User className="w-4 h-4 mr-1" />
                        基本信息
                      </TabsTrigger>
                      <TabsTrigger value="monitoring" className="text-xs">
                        <Activity className="w-4 h-4 mr-1" />
                        监测数据
                      </TabsTrigger>
                      <TabsTrigger value="ultrasound" className="text-xs">
                        <Stethoscope className="w-4 h-4 mr-1" />
                        超声检查
                      </TabsTrigger>
                      <TabsTrigger value="delivery" className="text-xs">
                        <Baby className="w-4 h-4 mr-1" />
                        分娩数据
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="basic" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>姓名 *</Label>
                          <Input 
                            value={name} 
                            onChange={(e) => setName(e.target.value)}
                            placeholder="请输入孕妇姓名"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>住院号 *</Label>
                          <Input 
                            value={admissionNumber} 
                            onChange={(e) => setAdmissionNumber(e.target.value)}
                            placeholder="请输入住院号"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>年龄</Label>
                          <Input 
                            type="number"
                            value={age} 
                            onChange={(e) => setAge(Number(e.target.value))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>BMI</Label>
                          <Input 
                            type="number"
                            step="0.1"
                            value={bmi} 
                            onChange={(e) => setBmi(Number(e.target.value))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>孕期增重 (kg)</Label>
                          <Input 
                            type="number"
                            step="0.1"
                            value={weightGain} 
                            onChange={(e) => setWeightGain(Number(e.target.value))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>并发症</Label>
                          <Select value={complications} onValueChange={setComplications}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="无">无</SelectItem>
                              <SelectItem value="妊娠期高血压">妊娠期高血压</SelectItem>
                              <SelectItem value="妊娠期糖尿病">妊娠期糖尿病</SelectItem>
                              <SelectItem value="贫血">贫血</SelectItem>
                              <SelectItem value="其他">其他</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>怀孕次数</Label>
                          <Input 
                            type="number"
                            value={pregnancyCount} 
                            onChange={(e) => setPregnancyCount(Number(e.target.value))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>分娩次数</Label>
                          <Input 
                            type="number"
                            value={deliveryCount} 
                            onChange={(e) => setDeliveryCount(Number(e.target.value))}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                          <Label>不良孕产史</Label>
                          <Switch 
                            checked={adversePregnancyHistory}
                            onCheckedChange={setAdversePregnancyHistory}
                          />
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                          <Label>胎动异常</Label>
                          <Switch 
                            checked={abnormalFetalMovement}
                            onCheckedChange={setAbnormalFetalMovement}
                          />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="monitoring" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>血氧饱和度 (%)</Label>
                          <Input 
                            type="number"
                            value={bloodOxygen} 
                            onChange={(e) => setBloodOxygen(Number(e.target.value))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>心率 (bpm)</Label>
                          <Input 
                            type="number"
                            value={heartRate} 
                            onChange={(e) => setHeartRate(Number(e.target.value))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>收缩压 SBP (mmHg)</Label>
                          <Input 
                            type="number"
                            value={bloodPressureSBP} 
                            onChange={(e) => setBloodPressureSBP(Number(e.target.value))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>舒张压 DBP (mmHg)</Label>
                          <Input 
                            type="number"
                            value={bloodPressureDBP} 
                            onChange={(e) => setBloodPressureDBP(Number(e.target.value))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>胎心率 (bpm)</Label>
                          <Input 
                            type="number"
                            value={fetalHeartRate} 
                            onChange={(e) => setFetalHeartRate(Number(e.target.value))}
                          />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="ultrasound" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>孕周</Label>
                          <Input 
                            type="number"
                            value={gestationalWeeks} 
                            onChange={(e) => setGestationalWeeks(Number(e.target.value))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>羊水指数 (cm)</Label>
                          <Input 
                            value={amnioticFluidIndex} 
                            onChange={(e) => setAmnioticFluidIndex(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>胎盘分级</Label>
                          <Select value={placentaGrade} onValueChange={setPlacentaGrade}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0级">0级</SelectItem>
                              <SelectItem value="I级">I级</SelectItem>
                              <SelectItem value="II级">II级</SelectItem>
                              <SelectItem value="III级">III级</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>脐血流 S/D 比值</Label>
                          <Input 
                            type="number"
                            step="0.1"
                            value={umbilicalBloodFlowRatio} 
                            onChange={(e) => setUmbilicalBloodFlowRatio(Number(e.target.value))}
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                        <Label>脐带绕颈</Label>
                        <Switch 
                          checked={umbilicalCordAroundNeck}
                          onCheckedChange={setUmbilicalCordAroundNeck}
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="delivery" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                          <Label>胎膜早破</Label>
                          <Switch 
                            checked={prematureRuptureOfMembranes}
                            onCheckedChange={setPrematureRuptureOfMembranes}
                          />
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                          <Label>前置胎盘</Label>
                          <Switch 
                            checked={placentaPrevia}
                            onCheckedChange={setPlacentaPrevia}
                          />
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                          <Label>胎盘早剥</Label>
                          <Switch 
                            checked={placentalAbruption}
                            onCheckedChange={setPlacentalAbruption}
                          />
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                          <Label>疤痕子宫</Label>
                          <Switch 
                            checked={scarredUterus}
                            onCheckedChange={setScarredUterus}
                          />
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="flex gap-3 mt-6 pt-6 border-t">
                    <Button 
                      onClick={handleAnalyze} 
                      className="flex-1"
                      disabled={isAnalyzing}
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          AI分析中...
                        </>
                      ) : (
                        <>
                          <Brain className="w-4 h-4 mr-2" />
                          开始AI预测
                        </>
                      )}
                    </Button>
                    <Button variant="outline" onClick={handleReset}>
                      重置
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Result Section */}
            <div className="lg:col-span-1">
              <Card className={`sticky top-6 ${result ? 'border-2' : ''} ${
                result?.riskLevel === 'high' ? 'border-risk-high' :
                result?.riskLevel === 'medium' ? 'border-risk-medium' :
                result?.riskLevel === 'low' ? 'border-risk-low' : ''
              }`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    预测结果
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isAnalyzing ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="relative">
                        <Brain className="w-16 h-16 text-primary animate-pulse" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        </div>
                      </div>
                      <p className="mt-4 text-sm text-muted-foreground">
                        NPH-AIPS模型分析中...
                      </p>
                    </div>
                  ) : result ? (
                    <div className="space-y-6">
                      {/* Risk Circle */}
                      <div className="flex flex-col items-center">
                        <div className={`relative w-32 h-32 rounded-full flex items-center justify-center ${
                          result.riskLevel === 'high' ? 'bg-red-100' :
                          result.riskLevel === 'medium' ? 'bg-yellow-100' : 'bg-green-100'
                        }`}>
                          <div className="text-center">
                            <p className={`text-4xl font-bold ${
                              result.riskLevel === 'high' ? 'text-risk-high' :
                              result.riskLevel === 'medium' ? 'text-risk-medium' : 'text-risk-low'
                            }`}>
                              {result.probability}%
                            </p>
                            <p className="text-sm text-muted-foreground">风险概率</p>
                          </div>
                          {result.riskLevel === 'high' && (
                            <div className="absolute inset-0 rounded-full border-4 border-risk-high animate-ping opacity-30" />
                          )}
                        </div>
                        <div className="mt-4">
                          <RiskIndicator 
                            level={result.riskLevel}
                            showLabel
                            size="lg"
                          />
                        </div>
                      </div>

                      {/* Risk Factors */}
                      <div>
                        <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" />
                          风险因素
                        </h4>
                        <ul className="space-y-2">
                          {result.factors.map((factor, index) => (
                            <li 
                              key={index}
                              className="text-sm p-2 rounded bg-secondary/50 flex items-center gap-2"
                            >
                              <span className={`w-2 h-2 rounded-full ${
                                result.riskLevel === 'high' ? 'bg-risk-high' :
                                result.riskLevel === 'medium' ? 'bg-risk-medium' : 'bg-risk-low'
                              }`} />
                              {factor}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Recommendation */}
                      <div className={`p-4 rounded-lg ${
                        result.riskLevel === 'high' ? 'bg-red-50 border border-risk-high/30' :
                        result.riskLevel === 'medium' ? 'bg-yellow-50 border border-risk-medium/30' :
                        'bg-green-50 border border-risk-low/30'
                      }`}>
                        <h4 className="text-sm font-medium mb-2">建议措施</h4>
                        <p className="text-sm text-muted-foreground">
                          {result.riskLevel === 'high' 
                            ? '立即通知主治医生，加强监护频率，准备紧急预案。'
                            : result.riskLevel === 'medium'
                            ? '增加监测频率，密切关注各项指标变化。'
                            : '继续常规监测，保持现有护理方案。'
                          }
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Brain className="w-16 h-16 text-muted-foreground/30 mb-4" />
                      <p className="text-muted-foreground">
                        填写病程参数后
                        <br />
                        点击"开始AI预测"查看结果
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Loader2, AlertCircle, Shield, Heart, Activity } from 'lucide-react';
import { toast } from 'sonner';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        toast.success('登录成功');
        navigate('/dashboard');
      } else {
        setError('邮箱或密码错误');
      }
    } catch (err) {
      setError('登录失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  const demoAccounts = [
    { role: '管理员', email: 'admin@hospital.com', password: 'admin123' },
    { role: '医生', email: 'doctor@hospital.com', password: 'doctor123' },
    { role: '护士', email: 'nurse@hospital.com', password: 'nurse123' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:flex-1 gradient-medical items-center justify-center p-12">
        <div className="max-w-lg text-white">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">NPH-AIPS</h1>
              <p className="text-white/80">新生儿围产期脑部缺氧AI预测系统</p>
            </div>
          </div>
          
          <p className="text-lg text-white/90 mb-8">
            基于深度学习的围产期脑部缺氧风险预测系统，通过分析孕妇病历数据，
            为医护人员提供实时风险预警，保障母婴安全。
          </p>

          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-white/10 backdrop-blur">
              <Shield className="w-8 h-8 mb-2" />
              <p className="text-sm font-medium">智能预警</p>
              <p className="text-xs text-white/70">三级风险评估</p>
            </div>
            <div className="p-4 rounded-xl bg-white/10 backdrop-blur">
              <Activity className="w-8 h-8 mb-2" />
              <p className="text-sm font-medium">实时监测</p>
              <p className="text-xs text-white/70">EMR自动同步</p>
            </div>
            <div className="p-4 rounded-xl bg-white/10 backdrop-blur">
              <Heart className="w-8 h-8 mb-2" />
              <p className="text-sm font-medium">数据驱动</p>
              <p className="text-xs text-white/70">万例病历训练</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
              <Brain className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">NPH-AIPS</h1>
              <p className="text-xs text-muted-foreground">围产期脑缺氧预测系统</p>
            </div>
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">系统登录</CardTitle>
              <CardDescription>
                请使用您的账号登录系统
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">邮箱</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@hospital.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">密码</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      登录中...
                    </>
                  ) : (
                    '登录'
                  )}
                </Button>
              </form>

              {/* Demo Accounts */}
              <div className="mt-6 pt-6 border-t">
                <p className="text-xs text-muted-foreground text-center mb-3">
                  演示账号（点击自动填充）
                </p>
                <div className="space-y-2">
                  {demoAccounts.map((account) => (
                    <button
                      key={account.email}
                      type="button"
                      onClick={() => {
                        setEmail(account.email);
                        setPassword(account.password);
                      }}
                      className="w-full p-2 text-left text-xs rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                    >
                      <span className="font-medium">{account.role}</span>
                      <span className="text-muted-foreground ml-2">{account.email}</span>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

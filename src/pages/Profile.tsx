import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Sidebar } from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { UserCircle, Lock, Pencil, AlertCircle } from 'lucide-react';

const ADMIN_PHONE = '13111112222';

export default function Profile() {
  const { user, updateUser, changePassword } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [department, setDepartment] = useState(user?.department || '');
  const [phone, setPhone] = useState(user?.phone || '');

  // Password dialog
  const [pwDialogOpen, setPwDialogOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const roleLabels: Record<string, string> = {
    admin: '系统管理员',
    doctor: '医生',
    nurse: '护士',
  };

  const isAdmin = user?.role === 'admin';

  const handleSaveInfo = () => {
    if (!name.trim()) {
      toast.error('姓名不能为空');
      return;
    }
    const updates: Partial<Pick<import('@/types/patient').User, 'name' | 'department' | 'phone'>> = {
      name: name.trim(),
      department: department.trim(),
    };
    if (isAdmin) {
      updates.phone = phone.trim();
    }
    updateUser(updates);
    toast.success('个人信息已更新');
  };

  const handleChangePassword = () => {
    if (!oldPassword) {
      toast.error('请输入原始密码');
      return;
    }
    if (!newPassword) {
      toast.error('请输入新密码');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('新密码长度不能少于6位');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('两次输入的新密码不一致');
      return;
    }
    const success = changePassword(oldPassword, newPassword);
    if (success) {
      toast.success('密码修改成功');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPwDialogOpen(false);
    } else {
      toast.error('原始密码错误');
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-bold">个人中心</h1>
            <p className="text-muted-foreground">查看和修改您的个人信息</p>
          </div>

          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCircle className="w-5 h-5" />
                基本信息
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>姓名</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="请输入姓名" />
              </div>
              <div className="space-y-2">
                <Label>手机号</Label>
                {isAdmin ? (
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="请输入手机号" />
                ) : (
                  <>
                    <Input value={user?.phone || ''} disabled />
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      如需修改手机号，请联系管理员（手机号：{ADMIN_PHONE}）
                    </p>
                  </>
                )}
              </div>
              <div className="space-y-2">
                <Label>角色</Label>
                <Input value={user ? roleLabels[user.role] || user.role : ''} disabled />
              </div>
              <div className="space-y-2">
                <Label>科室</Label>
                <Input value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="请输入科室" />
              </div>
              <Button onClick={handleSaveInfo}>保存修改</Button>
            </CardContent>
          </Card>

          {/* Password */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                登录密码
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>当前密码</Label>
                  <p className="text-sm tracking-widest">••••••</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setPwDialogOpen(true)}>
                  <Pencil className="w-4 h-4 mr-1" />
                  修改密码
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Change Password Dialog */}
      <Dialog open={pwDialogOpen} onOpenChange={setPwDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>修改密码</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>原始密码</Label>
              <Input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} placeholder="请输入原始密码" />
            </div>
            <div className="space-y-2">
              <Label>新密码</Label>
              <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="请输入新密码（至少6位）" />
            </div>
            <div className="space-y-2">
              <Label>确认新密码</Label>
              <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="请再次输入新密码" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPwDialogOpen(false)}>取消</Button>
            <Button onClick={handleChangePassword}>确认修改</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

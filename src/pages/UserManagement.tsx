import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { User, UserRole } from '@/types/patient';
import { Plus, Search, Pencil, Trash2, Shield, Users } from 'lucide-react';
import { toast } from 'sonner';

const initialUsers: User[] = [
  { id: '1', name: '张管理员', phone: '13111112222', role: 'admin', department: '系统管理' },
  { id: '2', name: '李医生', phone: '15155556666', role: 'doctor', department: '产科' },
  { id: '3', name: '王护士', phone: '18188889999', role: 'nurse', department: '产科' },
  { id: '4', name: '刘医生', phone: '13900001111', role: 'doctor', department: '产科' },
  { id: '5', name: '陈护士', phone: '13900002222', role: 'nurse', department: '产科' },
];

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  // Form state
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formRole, setFormRole] = useState<UserRole>('nurse');
  const [formDepartment, setFormDepartment] = useState('产科');

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery);
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const roleLabels: Record<UserRole, string> = {
    admin: '管理员',
    doctor: '医生',
    nurse: '护士',
  };

  const roleBadgeVariants: Record<UserRole, 'default' | 'secondary' | 'outline'> = {
    admin: 'default',
    doctor: 'secondary',
    nurse: 'outline',
  };

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormName(user.name);
      setFormPhone(user.phone);
      setFormPassword('');
      setFormRole(user.role);
      setFormDepartment(user.department || '产科');
    } else {
      setEditingUser(null);
      setFormName('');
      setFormPhone('');
      setFormPassword('');
      setFormRole('nurse');
      setFormDepartment('产科');
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingUser(null);
  };

  const handleSubmit = () => {
    if (!formName.trim() || !formPhone.trim()) {
      toast.error('请填写完整信息');
      return;
    }
    if (!editingUser && !formPassword.trim()) {
      toast.error('请输入密码');
      return;
    }

    if (editingUser) {
      setUsers(prev => prev.map(u => 
        u.id === editingUser.id 
          ? { ...u, name: formName, phone: formPhone, role: formRole, department: formDepartment }
          : u
      ));
      toast.success('用户信息已更新');
    } else {
      const newUser: User = {
        id: Date.now().toString(),
        name: formName,
        phone: formPhone,
        role: formRole,
        department: formDepartment,
      };
      setUsers(prev => [...prev, newUser]);
      toast.success('用户创建成功');
    }

    handleCloseDialog();
  };

  const handleDelete = (userId: string) => {
    if (confirm('确定要删除该用户吗？')) {
      setUsers(prev => prev.filter(u => u.id !== userId));
      toast.success('用户已删除');
    }
  };

  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    doctors: users.filter(u => u.role === 'doctor').length,
    nurses: users.filter(u => u.role === 'nurse').length,
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 p-6 overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">用户管理</h1>
            <p className="text-muted-foreground">管理系统用户及权限</p>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="w-4 h-4 mr-2" />
            添加用户
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="medical-card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">总用户数</p>
              </div>
            </div>
          </div>
          <div className="medical-card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.admins}</p>
                <p className="text-sm text-muted-foreground">管理员</p>
              </div>
            </div>
          </div>
          <div className="medical-card p-4">
            <div>
              <p className="text-2xl font-bold">{stats.doctors}</p>
              <p className="text-sm text-muted-foreground">医生</p>
            </div>
          </div>
          <div className="medical-card p-4">
            <div>
              <p className="text-2xl font-bold">{stats.nurses}</p>
              <p className="text-sm text-muted-foreground">护士</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="medical-card mb-6">
          <div className="p-4 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="搜索用户名或手机号..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="角色" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部角色</SelectItem>
                <SelectItem value="admin">管理员</SelectItem>
                <SelectItem value="doctor">医生</SelectItem>
                <SelectItem value="nurse">护士</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* User Table */}
        <div className="medical-card">
          <Table>
            <TableHeader>
              <TableRow className="data-table-header">
                <TableHead>姓名</TableHead>
                <TableHead>手机号</TableHead>
                <TableHead>角色</TableHead>
                <TableHead>科室</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    没有找到匹配的用户
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {user.name.charAt(0)}
                          </span>
                        </div>
                        {user.name}
                      </div>
                    </TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>
                      <Badge variant={roleBadgeVariants[user.role]}>
                        {roleLabels[user.role]}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.department}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDialog(user)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(user.id)}
                          disabled={user.role === 'admin' && stats.admins === 1}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Add/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingUser ? '编辑用户' : '添加用户'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>姓名</Label>
                <Input
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="请输入用户姓名"
                />
              </div>
              <div className="space-y-2">
                <Label>手机号</Label>
                <Input
                  type="tel"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  placeholder="请输入手机号"
                />
              </div>
              <div className="space-y-2">
                <Label>密码{editingUser && '（留空则不修改）'}</Label>
                <Input
                  type="password"
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  placeholder={editingUser ? '留空则不修改密码' : '请输入密码'}
                />
              </div>
              <div className="space-y-2">
                <Label>角色</Label>
                <Select value={formRole} onValueChange={(v) => setFormRole(v as UserRole)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">管理员</SelectItem>
                    <SelectItem value="doctor">医生</SelectItem>
                    <SelectItem value="nurse">护士</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>科室</Label>
                <Input
                  value={formDepartment}
                  onChange={(e) => setFormDepartment(e.target.value)}
                  placeholder="请输入科室"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleCloseDialog}>
                取消
              </Button>
              <Button onClick={handleSubmit}>
                {editingUser ? '保存' : '创建'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}

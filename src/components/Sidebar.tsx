import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ClipboardEdit, 
  Users, 
  LogOut,
  Activity,
  Brain,
  Shield,
  UserCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    {
      label: '监测仪表盘',
      icon: LayoutDashboard,
      href: '/dashboard',
      roles: ['admin', 'doctor', 'nurse'],
    },
    {
      label: '手动检测',
      icon: ClipboardEdit,
      href: '/manual-detection',
      roles: ['admin', 'doctor', 'nurse'],
    },
    {
      label: '用户管理',
      icon: Users,
      href: '/users',
      roles: ['admin'],
    },
  ];

  const filteredNavItems = navItems.filter(
    item => user && item.roles.includes(user.role)
  );

  const roleLabels = {
    admin: '系统管理员',
    doctor: '医生',
    nurse: '护士',
  };

  return (
    <aside className="w-64 min-h-screen bg-sidebar text-sidebar-foreground flex flex-col relative">
      {/* Logo Area */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sidebar-primary flex items-center justify-center">
            <Brain className="w-6 h-6 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-sm">NPH-AIPS</h1>
            <p className="text-xs text-sidebar-foreground/70">围产期脑缺氧预测</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {filteredNavItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User Info - fixed at bottom */}
      <div className="sticky bottom-0 p-4 border-t border-sidebar-border bg-sidebar">
        <Link to="/profile" className="flex items-center gap-3 mb-3 rounded-lg px-2 py-2 -mx-2 hover:bg-sidebar-accent transition-colors cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-sidebar-accent flex items-center justify-center">
            <span className="text-sm font-medium">{user?.name.charAt(0)}</span>
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-sm font-medium truncate block">{user?.name}</span>
            <div className="flex items-center gap-1.5">
              <Shield className="w-3 h-3 text-sidebar-foreground/60" />
              <p className="text-xs text-sidebar-foreground/60">
                {user && roleLabels[user.role]}
              </p>
            </div>
          </div>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent"
          onClick={logout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          退出登录
        </Button>
      </div>
    </aside>
  );
}

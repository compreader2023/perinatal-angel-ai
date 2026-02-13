import React, { createContext, useContext, useState, useCallback } from 'react';
import { User, UserRole } from '@/types/patient';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (phone: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<Pick<User, 'name' | 'department'>>) => void;
  changePassword: (oldPassword: string, newPassword: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo - stored as mutable for password changes
const mockUsers: (User & { password: string })[] = [
  {
    id: '1',
    name: '张管理员',
    phone: '13111112222',
    password: 'admin123',
    role: 'admin',
    department: '系统管理',
  },
  {
    id: '2',
    name: '李医生',
    phone: '15155556666',
    password: 'doctor123',
    role: 'doctor',
    department: '产科',
    assignedPatients: ['1', '2', '3'],
  },
  {
    id: '3',
    name: '王护士',
    phone: '18188889999',
    password: 'nurse123',
    role: 'nurse',
    department: '产科',
    assignedPatients: ['1', '4'],
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (phone: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const foundUser = mockUsers.find(u => u.phone === phone && u.password === password);
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const updateUser = useCallback((updates: Partial<Pick<User, 'name' | 'department'>>) => {
    setUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      // Also update mockUsers
      const mu = mockUsers.find(u => u.id === prev.id);
      if (mu) {
        if (updates.name) mu.name = updates.name;
        if (updates.department) mu.department = updates.department;
      }
      return updated;
    });
  }, []);

  const changePassword = useCallback((oldPassword: string, newPassword: string): boolean => {
    if (!user) return false;
    const mu = mockUsers.find(u => u.id === user.id);
    if (!mu || mu.password !== oldPassword) return false;
    mu.password = newPassword;
    return true;
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, updateUser, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

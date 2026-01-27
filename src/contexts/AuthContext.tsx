import React, { createContext, useContext, useState, useCallback } from 'react';
import { User, UserRole } from '@/types/patient';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: (User & { password: string })[] = [
  {
    id: '1',
    name: '张管理员',
    email: 'admin@hospital.com',
    password: 'admin123',
    role: 'admin',
    department: '系统管理',
  },
  {
    id: '2',
    name: '李医生',
    email: 'doctor@hospital.com',
    password: 'doctor123',
    role: 'doctor',
    department: '产科',
    assignedPatients: ['1', '2', '3'],
  },
  {
    id: '3',
    name: '王护士',
    email: 'nurse@hospital.com',
    password: 'nurse123',
    role: 'nurse',
    department: '产科',
    assignedPatients: ['1', '4'],
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
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

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
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

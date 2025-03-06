
import { toast } from 'sonner';
import { User, USERS } from '@/types/user';

// Simulate authentication process
export const login = (username: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    // Simulate API call delay
    setTimeout(() => {
      const user = USERS.find(u => u.username === username);
      
      // Verificar se o usuário existe e se a senha está correta
      if (user && user.password === password) {
        // Criar uma versão do usuário sem a senha para armazenar no localStorage
        const safeUser = { ...user };
        delete safeUser.password;
        
        // Salvar no localStorage
        localStorage.setItem('user', JSON.stringify(safeUser));
        resolve(safeUser);
        toast.success('Login realizado com sucesso');
      } else {
        reject(new Error('Usuário ou senha incorretos'));
        toast.error('Falha no login. Verifique suas credenciais.');
      }
    }, 800);
  });
};

export const logout = (): void => {
  localStorage.removeItem('user');
  toast.info('Você foi desconectado');
};

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr) as User;
  } catch (error) {
    logout();
    return null;
  }
};

export const hasAccessToDashboard = (user: User | null, dashboardId: string): boolean => {
  if (!user) return false;
  
  const dashboard = Object.entries(import.meta.glob('@/types/user.ts', { eager: true }))
    .map(([_, module]) => (module as any).DASHBOARDS)[0][dashboardId];
  
  if (!dashboard) return false;
  
  return dashboard.roles.includes(user.role);
};

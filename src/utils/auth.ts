
import { toast } from 'sonner';
import { User, USERS } from '@/types/user';

// Variável para armazenar os usuários em memória (simulando um banco de dados)
let users = [...USERS];

// Simulate authentication process
export const login = (username: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    // Simulate API call delay
    setTimeout(() => {
      const user = users.find(u => u.username === username);
      
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

// Funções para gerenciar usuários (CRUD)
export const getAllUsers = (): User[] => {
  // Retornar cópia dos usuários sem as senhas
  return users.map(user => {
    const { password, ...safeUser } = user;
    return safeUser;
  });
};

export const getUserById = (id: string): User | undefined => {
  const user = users.find(u => u.id === id);
  if (!user) return undefined;
  
  const { password, ...safeUser } = user;
  return safeUser;
};

export const addUser = (user: Omit<User, 'id'>): User => {
  // Verificar se já existe um usuário com o mesmo username
  if (users.some(u => u.username === user.username)) {
    toast.error('Já existe um usuário com este nome de usuário');
    throw new Error('Já existe um usuário com este nome de usuário');
  }
  
  // Gerar ID único
  const id = (Math.max(...users.map(u => parseInt(u.id))) + 1).toString();
  
  const newUser = { ...user, id };
  users.push(newUser);
  
  toast.success('Usuário adicionado com sucesso');
  return newUser;
};

export const updateUser = (id: string, userData: Partial<Omit<User, 'id'>>): User => {
  const userIndex = users.findIndex(u => u.id === id);
  
  if (userIndex === -1) {
    toast.error('Usuário não encontrado');
    throw new Error('Usuário não encontrado');
  }
  
  // Verificar se está alterando o username para um que já existe
  if (userData.username && 
      users.some(u => u.username === userData.username && u.id !== id)) {
    toast.error('Já existe um usuário com este nome de usuário');
    throw new Error('Já existe um usuário com este nome de usuário');
  }
  
  // Atualizar usuário
  users[userIndex] = { ...users[userIndex], ...userData };
  
  // Se o usuário atualizado for o atual logado, atualizar também no localStorage
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === id) {
    const updatedUser = { ...currentUser, ...userData };
    delete (updatedUser as any).password; // garantir que a senha não é armazenada
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }
  
  toast.success('Usuário atualizado com sucesso');
  
  const { password, ...safeUser } = users[userIndex];
  return safeUser;
};

export const deleteUser = (id: string): void => {
  const userIndex = users.findIndex(u => u.id === id);
  
  if (userIndex === -1) {
    toast.error('Usuário não encontrado');
    throw new Error('Usuário não encontrado');
  }
  
  // Verificar se não é o último admin
  const adminUsers = users.filter(u => u.role === 'admin');
  if (users[userIndex].role === 'admin' && adminUsers.length <= 1) {
    toast.error('Não é possível excluir o último usuário administrador');
    throw new Error('Não é possível excluir o último usuário administrador');
  }
  
  // Remover usuário
  users.splice(userIndex, 1);
  toast.success('Usuário excluído com sucesso');
};

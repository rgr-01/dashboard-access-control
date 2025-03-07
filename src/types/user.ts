
export type UserRole = 'pecas' | 'comercial' | 'financeiro' | 'gerente' | 'admin';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  name: string;
  password?: string; // Adicionado campo de senha opcional para não expor no localStorage
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface DashboardAccess {
  [key: string]: {
    title: string;
    embedUrl: string;
    description: string;
    roles: UserRole[];
  };
}

export const DASHBOARDS: DashboardAccess = {
  pecas: {
    title: 'Dashboard de Peças',
    embedUrl: 'https://app.powerbi.com/reportEmbed?reportId=your-pecas-report-id',
    description: 'Visualização de estoque e movimentação de peças',
    roles: ['pecas', 'gerente', 'admin']
  },
  comercial: {
    title: 'Dashboard Comercial',
    embedUrl: 'https://app.powerbi.com/reportEmbed?reportId=your-comercial-report-id',
    description: 'Análise de vendas e performance comercial',
    roles: ['comercial', 'gerente', 'admin']
  },
  financeiro: {
    title: 'Dashboard Financeiro',
    embedUrl: 'https://app.powerbi.com/reportEmbed?reportId=your-financeiro-report-id',
    description: 'Resultados financeiros e análise de custos',
    roles: ['financeiro', 'gerente', 'admin']
  },
  admin: {
    title: 'Painel Administrativo',
    embedUrl: '',
    description: 'Gerenciamento de usuários e permissões',
    roles: ['admin']
  }
};

// Mock database de usuários para demo com senhas
export const USERS: User[] = [
  {
    id: '1',
    username: 'pecas',
    role: 'pecas',
    name: 'Usuário Peças',
    password: 'senha123'
  },
  {
    id: '2',
    username: 'comercial',
    role: 'comercial',
    name: 'Usuário Comercial',
    password: 'senha123'
  },
  {
    id: '3',
    username: 'financeiro',
    role: 'financeiro',
    name: 'Usuário Financeiro',
    password: 'senha123'
  },
  {
    id: '4',
    username: 'gerente',
    role: 'gerente',
    name: 'Usuário Gerente',
    password: 'senha123'
  },
  {
    id: '5',
    username: 'admin',
    role: 'admin',
    name: 'Administrador',
    password: 'admin123'
  }
];

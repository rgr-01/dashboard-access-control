
export type UserRole = 'pecas' | 'comercial' | 'financeiro' | 'gerente';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  name: string;
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
    roles: ['pecas', 'gerente']
  },
  comercial: {
    title: 'Dashboard Comercial',
    embedUrl: 'https://app.powerbi.com/reportEmbed?reportId=your-comercial-report-id',
    description: 'Análise de vendas e performance comercial',
    roles: ['comercial', 'gerente']
  },
  financeiro: {
    title: 'Dashboard Financeiro',
    embedUrl: 'https://app.powerbi.com/reportEmbed?reportId=your-financeiro-report-id',
    description: 'Resultados financeiros e análise de custos',
    roles: ['financeiro', 'gerente']
  }
};

// Mock database of users for demo
export const USERS: User[] = [
  {
    id: '1',
    username: 'pecas',
    role: 'pecas',
    name: 'Usuário Peças'
  },
  {
    id: '2',
    username: 'comercial',
    role: 'comercial',
    name: 'Usuário Comercial'
  },
  {
    id: '3',
    username: 'financeiro',
    role: 'financeiro',
    name: 'Usuário Financeiro'
  },
  {
    id: '4',
    username: 'gerente',
    role: 'gerente',
    name: 'Usuário Gerente'
  }
];

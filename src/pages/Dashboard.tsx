
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DashboardEmbed } from '@/components/DashboardEmbed';
import { getCurrentUser, hasAccessToDashboard } from '@/utils/auth';
import { DASHBOARDS } from '@/types/user';
import { AnimatedTransition } from '@/components/ui-components/AnimatedTransition';
import { LayoutDashboard, LogOut, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { logout } from '@/utils/auth';

const Dashboard = () => {
  const [user, setUser] = useState(getCurrentUser());
  const navigate = useNavigate();
  const params = useParams();
  const [selectedDashboard, setSelectedDashboard] = useState<string | null>(params.dashboardId || null);
  
  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    
    if (params.dashboardId && !hasAccessToDashboard(user, params.dashboardId)) {
      navigate('/not-authorized');
    } else if (params.dashboardId) {
      setSelectedDashboard(params.dashboardId);
    }
  }, [user, params.dashboardId, navigate]);
  
  const accessibleDashboards = Object.entries(DASHBOARDS).filter(
    ([id, dashboard]) => dashboard.roles.includes(user?.role || 'pecas' as any)
  );

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  const handleDashboardSelect = (dashboardId: string) => {
    setSelectedDashboard(dashboardId);
    navigate(`/dashboard/${dashboardId}`, { replace: true });
  };

  // Função para obter o título baseado no dashboard selecionado ou perfil do usuário
  const getDashboardTitle = () => {
    if (selectedDashboard && DASHBOARDS[selectedDashboard]) {
      return DASHBOARDS[selectedDashboard].title;
    }
    
    // Títulos baseados no perfil do usuário
    switch (user?.role) {
      case 'comercial':
        return 'Dashboards Comercial';
      case 'financeiro':
        return 'Dashboards Financeiro';
      case 'pecas':
        return 'Dashboards Peças';
      case 'gerente':
        return 'Dashboards Gerente';
      case 'admin':
        return 'Dashboards Administrativo';
      default:
        return 'Dashboards';
    }
  };
  
  if (!user) return null;
  
  return (
    <div className="min-h-screen flex">
      {/* Sidebar Orange */}
      <div className="w-64 bg-orange-400 min-h-screen flex flex-col">
        <AnimatedTransition>
          {/* User Avatar Section */}
          <div className="flex flex-col items-center py-8 px-6">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} alt={user.name} />
                <AvatarFallback className="text-2xl bg-gray-200 text-gray-600">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
          
          {/* Dashboard Menu */}
          <div className="flex-1 px-4">
            <div className="space-y-2">
              {accessibleDashboards.map(([id, dashboard], index) => (
                <AnimatedTransition key={id} delay={50 * index}>
                  <Button 
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-white hover:bg-white/20 border-none",
                      selectedDashboard === id && "bg-white/20"
                    )}
                    onClick={() => handleDashboardSelect(id)}
                  >
                    <LayoutDashboard className="mr-3 h-4 w-4" />
                    <span>Dashboard</span>
                  </Button>
                </AnimatedTransition>
              ))}
            </div>
          </div>

          {/* Logout Button */}
          <div className="p-4">
            <Button 
              variant="ghost"
              className="w-full justify-start text-white hover:bg-white/20"
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-4 w-4" />
              <span>Sair</span>
            </Button>
          </div>
        </AnimatedTransition>
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 bg-gray-100 min-h-screen">
        {/* Header */}
        <div className="bg-white px-8 py-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">
              {getDashboardTitle()}
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">User</span>
              <div className="w-10 h-10 bg-orange-400 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-8">
          {selectedDashboard ? (
            <AnimatedTransition>
              <div className="bg-white rounded-lg shadow-sm min-h-[600px]">
                <DashboardEmbed dashboardId={selectedDashboard} />
              </div>
            </AnimatedTransition>
          ) : (
            <AnimatedTransition>
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <LayoutDashboard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Selecione um Dashboard
                </h2>
                <p className="text-gray-600">
                  Escolha um dashboard na barra lateral para visualizar os dados
                </p>
              </div>
            </AnimatedTransition>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

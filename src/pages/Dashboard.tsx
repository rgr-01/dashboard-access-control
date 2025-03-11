
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { DashboardEmbed } from '@/components/DashboardEmbed';
import { getCurrentUser, hasAccessToDashboard } from '@/utils/auth';
import { DASHBOARDS } from '@/types/user';
import { AnimatedTransition } from '@/components/ui-components/AnimatedTransition';
import { ArrowRight, LayoutDashboard, Menu, X } from 'lucide-react';
import { GlassCard } from '@/components/ui-components/GlassCard';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Dashboard = () => {
  const [user, setUser] = useState(getCurrentUser());
  const navigate = useNavigate();
  const params = useParams();
  const [selectedDashboard, setSelectedDashboard] = useState<string | null>(params.dashboardId || null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
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
  
  useEffect(() => {
    // Close sidebar when changing routes on mobile
    setSidebarOpen(false);
  }, [selectedDashboard]);

  useEffect(() => {
    // Close sidebar when clicking outside on mobile
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('dashboard-sidebar');
      if (sidebarOpen && sidebar && !sidebar.contains(event.target as Node)) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarOpen]);
  
  const accessibleDashboards = Object.entries(DASHBOARDS).filter(
    ([id, dashboard]) => dashboard.roles.includes(user?.role || 'pecas' as any)
  );
  
  const handleDashboardSelect = (dashboardId: string) => {
    setSelectedDashboard(dashboardId);
    navigate(`/dashboard/${dashboardId}`, { replace: true });
  };
  
  if (!user) return null;
  
  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      <Header />
      
      {/* Mobile sidebar toggle */}
      <div className="fixed top-[5.5rem] left-4 z-50 md:hidden">
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full bg-white shadow-md"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? "Fechar menu" : "Abrir menu"}
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>
      
      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div 
        id="dashboard-sidebar"
        className={cn(
          "w-[280px] md:w-64 lg:w-72 min-h-screen bg-[#FF9443] pt-20 px-4 z-50 border-r text-white",
          "fixed left-0 top-0 bottom-0 transition-transform duration-300",
          "md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <AnimatedTransition>
          <div className="sticky top-24 space-y-6 overflow-y-auto max-h-[calc(100vh-120px)] pb-12 scrollbar-none">
            {/* User Profile Picture */}
            <div className="flex flex-col items-center my-6 pb-6 border-b border-white/10">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage 
                  src={user.role === 'gerente' 
                    ? `https://api.dicebear.com/7.x/avataaars/svg?seed=manager-special`
                    : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`
                  } 
                  alt={user.name} 
                />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="text-base font-medium">{user.name}</h3>
                <p className="text-xs text-white/80 mt-1 capitalize">{user.role}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold tracking-tight">Dashboards</h2>
              <p className="text-sm text-white/80">
                Navegue pelos dashboards disponíveis para seu perfil
              </p>
            </div>
            
            <div className="space-y-3">
              {accessibleDashboards.map(([id, dashboard], index) => (
                <AnimatedTransition key={id} delay={50 * index}>
                  <Button 
                    variant={selectedDashboard === id ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      selectedDashboard !== id && "text-white hover:text-white hover:bg-white/10"
                    )}
                    onClick={() => handleDashboardSelect(id)}
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>{dashboard.title}</span>
                  </Button>
                </AnimatedTransition>
              ))}
            </div>
          </div>
        </AnimatedTransition>
      </div>
      
      {/* Main content */}
      <div className={cn(
        "pt-24 pb-12 px-4 sm:px-6 lg:px-8 w-full min-h-screen",
        "md:ml-64 lg:ml-72" // Add margin to account for sidebar
      )}>
        {selectedDashboard ? (
          <AnimatedTransition>
            <div className="w-full overflow-hidden">
              <DashboardEmbed dashboardId={selectedDashboard} />
            </div>
          </AnimatedTransition>
        ) : (
          <AnimatedTransition>
            <div className="text-center mb-10 max-w-3xl mx-auto">
              <h1 className="text-3xl font-bold tracking-tight">Dashboards disponíveis</h1>
              <p className="mt-2 text-muted-foreground">
                Selecione um dashboard no menu lateral para visualizar
              </p>
            </div>
            
            {accessibleDashboards.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Nenhum dashboard disponível para o seu perfil.</p>
              </div>
            )}
          </AnimatedTransition>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

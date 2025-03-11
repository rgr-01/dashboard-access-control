
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { DashboardEmbed } from '@/components/DashboardEmbed';
import { getCurrentUser, hasAccessToDashboard } from '@/utils/auth';
import { DASHBOARDS } from '@/types/user';
import { AnimatedTransition } from '@/components/ui-components/AnimatedTransition';
import { ArrowRight, LayoutDashboard } from 'lucide-react';
import { GlassCard } from '@/components/ui-components/GlassCard';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
  
  const handleDashboardSelect = (dashboardId: string) => {
    setSelectedDashboard(dashboardId);
    navigate(`/dashboard/${dashboardId}`, { replace: true });
  };
  
  if (!user) return null;
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <Header />
      
      {/* Sidebar - Updated with the new background color #FF9443 */}
      <div className="w-full md:w-64 lg:w-72 md:min-h-screen bg-[#FF9443] pt-20 px-4 md:fixed left-0 top-0 bottom-0 border-r">
        <AnimatedTransition>
          <div className="sticky top-24 space-y-6">
            {/* User Profile Picture */}
            <div className="flex flex-col items-center my-6 pb-6 border-b border-primary/10">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} alt={user.name} />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="text-base font-medium">{user.name}</h3>
                <p className="text-xs text-muted-foreground mt-1 capitalize">{user.role}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold tracking-tight">Dashboards</h2>
              <p className="text-sm text-muted-foreground">
                Navegue pelos dashboards disponíveis para seu perfil
              </p>
            </div>
            
            <div className="space-y-3">
              {accessibleDashboards.map(([id, dashboard], index) => (
                <AnimatedTransition key={id} delay={50 * index}>
                  <Button 
                    variant={selectedDashboard === id ? "default" : "ghost"}
                    className="w-full justify-start"
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
        "pt-24 pb-12 px-4 sm:px-6 lg:px-8 w-full",
        "md:ml-64 lg:ml-72" // Add margin to account for sidebar
      )}>
        {selectedDashboard ? (
          <AnimatedTransition>
            <DashboardEmbed dashboardId={selectedDashboard} />
          </AnimatedTransition>
        ) : (
          <AnimatedTransition>
            <div className="text-center mb-10">
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


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

const Dashboard = () => {
  const [user, setUser] = useState(getCurrentUser());
  const navigate = useNavigate();
  const params = useParams();
  const dashboardId = params.dashboardId;
  
  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    
    if (dashboardId && !hasAccessToDashboard(user, dashboardId)) {
      navigate('/not-authorized');
    }
  }, [user, dashboardId, navigate]);
  
  const accessibleDashboards = Object.entries(DASHBOARDS).filter(
    ([id, dashboard]) => dashboard.roles.includes(user?.role || 'pecas' as any)
  );
  
  if (!user) return null;
  
  if (dashboardId) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <Header />
        <div className="mb-6">
          <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
            Voltar para todos os dashboards
          </Button>
        </div>
        <DashboardEmbed dashboardId={dashboardId} />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <Header />
      
      {/* Sidebar */}
      <div className="w-full md:w-64 lg:w-72 md:min-h-screen bg-primary/5 pt-20 px-4 md:fixed left-0 top-0 bottom-0 border-r">
        <AnimatedTransition>
          <div className="sticky top-24 space-y-6">
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
                    variant={dashboardId === id ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => navigate(`/dashboard/${id}`)}
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
        <AnimatedTransition>
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold tracking-tight">Dashboards disponíveis</h1>
            <p className="mt-2 text-muted-foreground">
              Selecione um dashboard para visualizar
            </p>
          </div>
        </AnimatedTransition>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {accessibleDashboards.map(([id, dashboard], index) => (
            <AnimatedTransition key={id} delay={100 * index} animationType="slide-up">
              <GlassCard 
                className="h-full group transition-all duration-300 hover:shadow-md"
                blurStrength="light"
              >
                <CardHeader className="pb-4">
                  <CardTitle>{dashboard.title}</CardTitle>
                  <CardDescription>{dashboard.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm text-muted-foreground">
                    Acesso permitido para: {dashboard.roles.join(', ')}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full group-hover:bg-primary/90"
                    onClick={() => navigate(`/dashboard/${id}`)}
                  >
                    <span>Acessar</span>
                    <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardFooter>
              </GlassCard>
            </AnimatedTransition>
          ))}
        </div>
        
        {accessibleDashboards.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum dashboard disponível para o seu perfil.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

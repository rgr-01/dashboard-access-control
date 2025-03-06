import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { DashboardEmbed } from '@/components/DashboardEmbed';
import { getCurrentUser, hasAccessToDashboard } from '@/utils/auth';
import { DASHBOARDS } from '@/types/user';
import { AnimatedTransition } from '@/components/ui-components/AnimatedTransition';
import { ArrowRight } from 'lucide-react';

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
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <Header />
      
      <AnimatedTransition>
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight">Dashboards disponíveis</h1>
          <p className="mt-2 text-muted-foreground">
            Selecione um dashboard para visualizar
          </p>
        </div>
      </AnimatedTransition>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accessibleDashboards.map(([id, dashboard], index) => (
          <AnimatedTransition key={id} delay={100 * index} animationType="slide-up">
            <Card className="group h-full overflow-hidden border transition-all duration-300 hover:shadow-md hover:border-primary/20">
              <CardHeader className="bg-primary/5 pb-4">
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
            </Card>
          </AnimatedTransition>
        ))}
      </div>
      
      {accessibleDashboards.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhum dashboard disponível para o seu perfil.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

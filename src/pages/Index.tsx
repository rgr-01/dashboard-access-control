
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '@/components/LoginForm';
import { getCurrentUser } from '@/utils/auth';
import { AnimatedTransition } from '@/components/ui-components/AnimatedTransition';

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is already logged in
    const user = getCurrentUser();
    if (user) {
      navigate('/dashboard');
    }
  }, [navigate]);
  
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background design elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/10 blur-3xl"></div>
      </div>
      
      <AnimatedTransition>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Sistema de Dashboards</h1>
          <p className="mt-2 text-muted-foreground max-w-md mx-auto">
            Acesse os painéis de acordo com seu perfil de usuário
          </p>
        </div>
      </AnimatedTransition>
      
      <LoginForm />
      
      <AnimatedTransition delay={700} className="mt-8 text-sm text-muted-foreground">
        <p>Usuários para teste: pecas, comercial, financeiro, gerente</p>
        <p>Qualquer senha funciona para teste</p>
      </AnimatedTransition>
    </div>
  );
};

export default Index;

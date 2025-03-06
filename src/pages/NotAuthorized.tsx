
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { AnimatedTransition } from '@/components/ui-components/AnimatedTransition';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const NotAuthorized = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <AnimatedTransition animationType="slide-up">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-destructive/10">
            <ShieldAlert className="h-8 w-8 text-destructive" />
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Acesso Negado</h1>
          
          <p className="text-muted-foreground mb-8 max-w-md">
            Você não tem permissão para acessar este dashboard. Por favor, retorne à página principal
            ou entre em contato com o administrador.
          </p>
          
          <Button onClick={() => navigate('/dashboard')} className="mx-auto">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para a página principal
          </Button>
        </div>
      </AnimatedTransition>
    </div>
  );
};

export default NotAuthorized;

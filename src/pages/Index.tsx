
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
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-white">
      <div className="max-w-md w-full flex flex-col items-center space-y-8">
        <AnimatedTransition>
          <div className="mb-4 flex flex-col items-center">
            {/* Logo */}
            <div className="w-24 h-24 mb-4">
              <img 
                src="/lovable-uploads/5600e16e-10d9-47c8-8ac3-3ecabaa40d59.png" 
                alt="Agrícola Analitycs Logo" 
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-8">Agrícola Analitycs</h1>
          </div>
        </AnimatedTransition>

        <div className="w-full">
          <AnimatedTransition delay={200}>
            <h2 className="text-3xl font-semibold text-center mb-8">Bem - Vindo</h2>
          </AnimatedTransition>
          
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Index;

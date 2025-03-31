
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
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-white font-[Poppins]">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <AnimatedTransition>
          <div className="flex flex-col items-center mb-8">
            {/* Logo */}
            <div className="w-24 h-24 mb-2">
              <img 
                src="/lovable-uploads/149f4792-9a16-42a2-ba7a-75cbb4819662.png" 
                alt="Agrícola Analitycs Logo" 
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Agrícola Analitycs</h1>
          </div>
        </AnimatedTransition>

        <div className="w-full">
          <AnimatedTransition delay={200}>
            <h2 className="text-xl font-semibold text-center mb-8">Bem - Vindo</h2>
          </AnimatedTransition>
          
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Index;

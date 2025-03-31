
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { login } from '@/utils/auth';
import { AnimatedTransition } from './ui-components/AnimatedTransition';

export function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (error) {
      // Error is handled in the auth service
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatedTransition animationType="slide-up">
      <Card className="border shadow-sm w-full max-w-md mx-auto overflow-hidden bg-white">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatedTransition delay={300}>
              <div className="space-y-2">
                <label htmlFor="username" className="block text-left text-sm font-medium">
                  Usuário
                </label>
                <Input
                  id="username"
                  placeholder=""
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="bg-white border h-12"
                  autoComplete="username"
                />
              </div>
            </AnimatedTransition>
            
            <AnimatedTransition delay={400}>
              <div className="space-y-2">
                <label htmlFor="password" className="block text-left text-sm font-medium">
                  Senha
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder=""
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white border h-12"
                  autoComplete="current-password"
                />
              </div>
            </AnimatedTransition>
          </form>
        </CardContent>
        <CardFooter className="pb-6 pt-2">
          <AnimatedTransition delay={600}>
            <Button 
              className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-medium"
              onClick={handleSubmit} 
              disabled={isLoading}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </AnimatedTransition>
        </CardFooter>
      </Card>
    </AnimatedTransition>
  );
}


import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { login } from '@/utils/auth';
import { GlassCard } from './ui-components/GlassCard';
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
      <GlassCard className="w-full max-w-md mx-auto overflow-hidden">
        <Card className="border-0 shadow-none bg-transparent">
          <CardHeader className="space-y-1">
            <AnimatedTransition delay={100}>
              <CardTitle className="text-2xl font-bold text-center">Acesso ao Sistema</CardTitle>
            </AnimatedTransition>
            <AnimatedTransition delay={200}>
              <CardDescription className="text-center">
                Digite suas credenciais para acessar os dashboards
              </CardDescription>
            </AnimatedTransition>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatedTransition delay={300}>
                <div className="space-y-2">
                  <Label htmlFor="username">Usuário</Label>
                  <Input
                    id="username"
                    placeholder="Seu nome de usuário"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="bg-white/50 border-white/20 focus:border-white/40"
                    autoComplete="username"
                  />
                </div>
              </AnimatedTransition>
              
              <AnimatedTransition delay={400}>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-white/50 border-white/20 focus:border-white/40"
                    autoComplete="current-password"
                  />
                </div>
              </AnimatedTransition>

              <AnimatedTransition delay={500}>
                <div className="text-xs text-muted-foreground">
                  Use um dos usuários: pecas, comercial, financeiro, gerente
                </div>
              </AnimatedTransition>
            </form>
          </CardContent>
          <CardFooter>
            <AnimatedTransition delay={600}>
              <Button 
                className="w-full" 
                onClick={handleSubmit} 
                disabled={isLoading}
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </AnimatedTransition>
          </CardFooter>
        </Card>
      </GlassCard>
    </AnimatedTransition>
  );
}

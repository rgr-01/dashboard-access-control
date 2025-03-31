
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import { login } from '@/utils/auth';
import { AnimatedTransition } from './ui-components/AnimatedTransition';

export function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <AnimatedTransition animationType="slide-up">
      <form onSubmit={handleSubmit} className="space-y-6">
        <AnimatedTransition delay={300}>
          <div className="relative">
            <Input
              id="username"
              placeholder="Usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="pl-10 py-3 h-12 rounded-lg bg-white border border-gray-300 text-sm"
              autoComplete="username"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <User size={18} />
            </div>
          </div>
        </AnimatedTransition>
        
        <AnimatedTransition delay={400}>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pl-10 py-3 h-12 rounded-lg bg-white border border-gray-300 text-sm"
              autoComplete="current-password"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <Lock size={18} />
            </div>
            <button 
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400"
              onClick={toggleShowPassword}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </AnimatedTransition>
        
        <AnimatedTransition delay={500}>
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <label htmlFor="remember" className="ml-2 block text-gray-600">
                Lembrar-me
              </label>
            </div>
            <a href="#" className="text-green-600 hover:text-green-500">
              Esqueceu a senha?
            </a>
          </div>
        </AnimatedTransition>

        <AnimatedTransition delay={600}>
          <Button 
            type="submit"
            className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg"
            disabled={isLoading}
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </Button>
        </AnimatedTransition>
      </form>
    </AnimatedTransition>
  );
}


import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { LogOut, Menu, User, ChevronLeft, Settings } from 'lucide-react';
import { getCurrentUser, logout } from '@/utils/auth';
import { cn } from '@/lib/utils';

export function Header() {
  const [user, setUser] = useState(getCurrentUser());
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isLoginPage = location.pathname === '/';
  const isNotFoundPage = location.pathname === '/not-found';
  const isDashboardPage = location.pathname.startsWith('/dashboard');
  const isAdminPage = location.pathname.startsWith('/admin');

  if (isLoginPage || isNotFoundPage) return null;

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 py-4 px-6 transition-all duration-300",
      scrolled ? "bg-background/80 backdrop-blur-md shadow-sm" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {(isDashboardPage || isAdminPage) && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/dashboard')}
              className="mr-2"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
          <h1 className="font-medium text-lg">Sistema de Dashboards</h1>
        </div>

        {user && (
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium hidden md:inline-block">
              {user.name} ({user.role})
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} alt={user.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem disabled className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>{user.name}</span>
                </DropdownMenuItem>
                <DropdownMenuItem disabled className="text-xs text-muted-foreground">
                  Perfil: {user.role}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                
                {user.role === 'admin' && (
                  <>
                    <DropdownMenuItem onClick={() => navigate('/admin')}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Painel Administrativo</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </header>
  );
}

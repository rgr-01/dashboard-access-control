
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { AdminPanel } from '@/components/AdminPanel';
import { getCurrentUser } from '@/utils/auth';

const AdminPage = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  
  useEffect(() => {
    // Verificar se o usuário está logado e é admin
    if (!user) {
      navigate('/');
      return;
    }
    
    if (user.role !== 'admin') {
      navigate('/not-authorized');
    }
  }, [user, navigate]);
  
  if (!user || user.role !== 'admin') return null;
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto pt-24 pb-12 px-4">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Painel Administrativo</h1>
        <AdminPanel />
      </div>
    </div>
  );
};

export default AdminPage;

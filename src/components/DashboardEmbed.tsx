
import { AdminPanel } from '@/components/AdminPanel';
import { DASHBOARDS } from '@/types/user';

interface DashboardEmbedProps {
  dashboardId: string;
}

export function DashboardEmbed({ dashboardId }: DashboardEmbedProps) {
  // Se for o dashboard admin, exibir o painel administrativo
  if (dashboardId === 'admin') {
    return <AdminPanel />;
  }
  
  const dashboard = DASHBOARDS[dashboardId];
  
  if (!dashboard) {
    return (
      <div className="flex items-center justify-center h-64 border rounded-lg bg-muted/20">
        <p className="text-muted-foreground">Dashboard não encontrado</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="pb-4 border-b">
        <h2 className="text-2xl font-bold">{dashboard.title}</h2>
        <p className="text-muted-foreground">{dashboard.description}</p>
      </div>
      
      <div className="aspect-[16/9] w-full border rounded-lg bg-background flex items-center justify-center overflow-hidden">
        {dashboard.embedUrl ? (
          <iframe 
            src={dashboard.embedUrl}
            className="w-full h-full"
            title={dashboard.title}
            frameBorder="0" 
            allowFullScreen
          />
        ) : (
          <div className="text-center p-8">
            <p className="text-muted-foreground">Endereço de embed não configurado para este dashboard.</p>
          </div>
        )}
      </div>
    </div>
  );
}

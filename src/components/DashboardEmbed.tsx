
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimatedTransition } from './ui-components/AnimatedTransition';
import { DASHBOARDS } from '@/types/user';

interface DashboardEmbedProps {
  dashboardId: string;
}

export function DashboardEmbed({ dashboardId }: DashboardEmbedProps) {
  const [isLoading, setIsLoading] = useState(true);
  
  const dashboard = DASHBOARDS[dashboardId];
  
  if (!dashboard) {
    return (
      <Card className="w-full h-[500px] flex items-center justify-center">
        <CardContent>
          <p className="text-center text-muted-foreground">Dashboard não encontrado</p>
        </CardContent>
      </Card>
    );
  }
  
  useEffect(() => {
    // Simulating load time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [dashboardId]);
  
  return (
    <AnimatedTransition animationType="fade">
      <Card className="w-full border shadow-md overflow-hidden">
        <CardHeader className="bg-primary/5 pb-4">
          <CardTitle>{dashboard.title}</CardTitle>
          <CardDescription>{dashboard.description}</CardDescription>
        </CardHeader>
        <CardContent className="p-0 h-[600px] relative">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80">
              <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
              <span className="ml-2 text-sm text-muted-foreground">Carregando dashboard...</span>
            </div>
          ) : (
            <iframe
              title={dashboard.title}
              width="100%"
              height="100%"
              src={dashboard.embedUrl}
              frameBorder="0"
              allowFullScreen
            ></iframe>
          )}
        </CardContent>
      </Card>
    </AnimatedTransition>
  );
}

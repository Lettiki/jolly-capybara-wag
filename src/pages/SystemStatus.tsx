"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Globe, 
  ShieldAlert, 
  Mail, 
  Activity, 
  Server, 
  Wifi,
  ChevronRight,
  History,
  Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';

const SystemStatus = () => {
  const services = [
    { name: 'VPN Corporativa', status: 'online', icon: ShieldAlert, uptime: '99.9%', latency: '24ms' },
    { name: 'Active Directory', status: 'online', icon: Activity, uptime: '100%', latency: '12ms' },
    { name: 'Servidor de E-mail', status: 'warning', icon: Mail, uptime: '98.5%', latency: '145ms' },
    { name: 'Link Internet (Principal)', status: 'online', icon: Globe, uptime: '99.9%', latency: '8ms' },
    { name: 'Banco de Dados ERP', status: 'online', icon: Server, uptime: '99.9%', latency: '5ms' },
    { name: 'Wi-Fi Escritório Central', status: 'online', icon: Wifi, uptime: '99.7%', latency: '15ms' },
  ];

  const incidents = [
    { 
      id: 1, 
      service: 'Servidor de E-mail', 
      title: 'Instabilidade no recebimento de anexos', 
      status: 'investigating', 
      date: 'Hoje, 10:45',
      description: 'Identificamos uma lentidão no processamento de anexos maiores que 10MB. A equipe técnica já está analisando os logs do servidor.'
    },
    { 
      id: 2, 
      service: 'VPN Corporativa', 
      title: 'Manutenção Preventiva Concluída', 
      status: 'resolved', 
      date: 'Ontem, 22:00',
      description: 'Atualização de patches de segurança aplicada com sucesso. Nenhum tempo de inatividade foi registrado.'
    },
    { 
      id: 3, 
      service: 'Link Internet', 
      title: 'Queda de Link (Fibra Óptica)', 
      status: 'resolved', 
      date: '15 Out, 14:20',
      description: 'Rompimento de fibra externa. O tráfego foi redirecionado para o link de backup automaticamente.'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Status do Sistema</h1>
          <p className="text-muted-foreground">Monitoramento em tempo real dos serviços críticos da infraestrutura.</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-600 px-4 py-2 rounded-2xl border border-emerald-500/20">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-sm font-bold">Todos os sistemas operacionais</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <Card key={service.name} className="border-none shadow-lg bg-card/50 backdrop-blur-sm overflow-hidden group hover:shadow-xl transition-all">
            <div className={cn(
              "h-1 w-full",
              service.status === 'online' ? "bg-emerald-500" : "bg-amber-500"
            )} />
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={cn(
                  "p-3 rounded-2xl",
                  service.status === 'online' ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                )}>
                  <service.icon className="w-6 h-6" />
                </div>
                <Badge variant="outline" className={cn(
                  "rounded-lg font-bold",
                  service.status === 'online' ? "text-emerald-500 border-emerald-500/20" : "text-amber-500 border-amber-500/20"
                )}>
                  {service.status.toUpperCase()}
                </Badge>
              </div>
              <h3 className="font-bold text-lg mb-1">{service.name}</h3>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground">Uptime</p>
                  <p className="text-sm font-bold">{service.uptime}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground">Latência</p>
                  <p className="text-sm font-bold">{service.latency}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <History className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold">Histórico de Incidentes</h2>
          </div>
          
          <div className="space-y-4">
            {incidents.map((incident) => (
              <Card key={incident.id} className="border-none shadow-md bg-card/50 overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-[10px] font-bold uppercase">{incident.service}</Badge>
                        <span className="text-xs text-muted-foreground">{incident.date}</span>
                      </div>
                      <CardTitle className="text-lg">{incident.title}</CardTitle>
                    </div>
                    <Badge className={cn(
                      "rounded-lg",
                      incident.status === 'resolved' ? "bg-emerald-500" : "bg-amber-500"
                    )}>
                      {incident.status === 'resolved' ? 'Resolvido' : 'Investigando'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {incident.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold">Manutenções</h2>
          </div>

          <Card className="border-none shadow-lg bg-primary text-primary-foreground rounded-3xl overflow-hidden">
            <CardContent className="p-6 space-y-4">
              <div className="p-3 bg-white/20 rounded-2xl w-fit">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Próxima Janela</h3>
                <p className="text-sm opacity-80">Sábado, 26 de Outubro</p>
                <p className="text-xs opacity-60 mt-1">02:00 AM - 04:00 AM</p>
              </div>
              <div className="pt-4 border-t border-white/10">
                <p className="text-xs font-bold uppercase tracking-wider mb-2">Escopo</p>
                <ul className="text-sm space-y-2 opacity-90">
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-white rounded-full" />
                    Reboot dos Switches Core
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-white rounded-full" />
                    Backup Full do SQL Server
                  </li>
                </ul>
              </div>
              <Button variant="secondary" className="w-full rounded-xl font-bold bg-white text-primary hover:bg-white/90">
                Ver Detalhes
              </Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-card/50 rounded-3xl">
            <CardHeader>
              <CardTitle className="text-sm">Assinar Alertas</CardTitle>
              <CardDescription>Receba notificações em tempo real sobre quedas de sistema.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full rounded-xl gap-2">
                <Mail className="w-4 h-4" /> Notificar por E-mail
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SystemStatus;
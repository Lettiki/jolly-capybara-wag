"use client";

import React, { useMemo } from 'react';
import { BookOpen, Sparkles, TrendingUp, BarChart3, Clock, ChevronRight, Activity, Globe, ShieldAlert, Mail } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, Cell } from 'recharts';
import ChatAssistant from '@/components/ChatAssistant';
import { cn } from '@/lib/utils';

const Dashboard = () => {
  const { knowledgeBase, user } = useApp();
  const navigate = useNavigate();

  const stats = useMemo(() => ({
    total: knowledgeBase.length,
    recent: knowledgeBase.filter(e => {
      const date = new Date(e.createdAt);
      const now = new Date();
      return (now.getTime() - date.getTime()) < (7 * 24 * 60 * 60 * 1000);
    }).length,
  }), [knowledgeBase]);

  const recentEntries = useMemo(() => {
    return [...knowledgeBase].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ).slice(0, 5);
  }, [knowledgeBase]);

  const chartData = useMemo(() => {
    const counts: Record<string, number> = {};
    knowledgeBase.forEach(e => {
      counts[e.category] = (counts[e.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [knowledgeBase]);

  const systemStatus = [
    { name: 'VPN Corporativa', status: 'online', icon: ShieldAlert },
    { name: 'Active Directory', status: 'online', icon: Activity },
    { name: 'Servidor de E-mail', status: 'warning', icon: Mail },
    { name: 'Link Internet', status: 'online', icon: Globe },
  ];

  const COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#64748b'];

  return (
    <div className="space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Olá, {user?.name}! 👋</h1>
          <p className="text-muted-foreground text-lg mt-1">Central de Inteligência Técnica</p>
        </div>
        <div className="flex gap-3">
          <Card className="px-4 py-2 flex items-center gap-3 border-none bg-primary/5">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Base Total</p>
              <p className="text-lg font-bold leading-none">{stats.total}</p>
            </div>
          </Card>
          <Card className="px-4 py-2 flex items-center gap-3 border-none bg-primary/5">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Novos (7d)</p>
              <p className="text-lg font-bold leading-none">{stats.recent}</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Status Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {systemStatus.map((sys) => (
          <Card key={sys.name} className="border-none shadow-sm bg-card/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-lg",
                sys.status === 'online' ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
              )}>
                <sys.icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase text-muted-foreground truncate">{sys.name}</p>
                <div className="flex items-center gap-1.5">
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full animate-pulse",
                    sys.status === 'online' ? "bg-emerald-500" : "bg-amber-500"
                  )} />
                  <span className="text-xs font-medium capitalize">{sys.status}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Chat Assistant */}
        <div className="lg:col-span-7 space-y-8">
          <ChatAssistant />
          
          <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" /> Distribuição
                </CardTitle>
                <CardDescription>Registros por categoria</CardDescription>
              </div>
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            </CardHeader>
            <CardContent className="h-[250px] pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Activity & Quick Actions */}
        <div className="lg:col-span-5 space-y-8">
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" /> Atividade Recente
              </CardTitle>
              <CardDescription>Últimas soluções adicionadas à base</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {recentEntries.map((entry) => (
                  <div 
                    key={entry.id} 
                    className="p-4 hover:bg-accent/50 transition-colors cursor-pointer flex items-center justify-between group"
                    onClick={() => navigate(`/entry/${entry.id}`)}
                  >
                    <div className="space-y-1 min-w-0">
                      <p className="font-bold text-sm truncate group-hover:text-primary transition-colors">{entry.title}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[9px] h-4 px-1.5 uppercase">{entry.category}</Badge>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(entry.createdAt).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1" />
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-border">
                <Link to="/knowledge">
                  <Button variant="ghost" className="w-full text-xs font-bold uppercase tracking-wider">
                    Ver Base Completa
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4">
            <Card className="border-none bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors cursor-pointer group">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-emerald-500/20 rounded-2xl text-emerald-600">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold">Novo Registro</h3>
                  <p className="text-xs text-muted-foreground">Documente uma nova solução</p>
                </div>
                <Link to="/new">
                  <Button size="icon" variant="ghost" className="rounded-full group-hover:translate-x-1 transition-transform">
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-none bg-blue-500/5 hover:bg-blue-500/10 transition-colors cursor-pointer group">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-blue-500/20 rounded-2xl text-blue-600">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold">Explorar Base</h3>
                  <p className="text-xs text-muted-foreground">Consulte o acervo técnico</p>
                </div>
                <Link to="/knowledge">
                  <Button size="icon" variant="ghost" className="rounded-full group-hover:translate-x-1 transition-transform">
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
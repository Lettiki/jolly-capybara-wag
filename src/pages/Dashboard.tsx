"use client";

import React, { useMemo, useEffect, useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  TrendingUp, 
  BarChart3, 
  Clock, 
  ChevronRight, 
  Activity, 
  Globe, 
  ShieldAlert, 
  Mail, 
  Users, 
  Trophy, 
  Star, 
  Loader2, 
  Search, 
  Plus, 
  Zap,
  User as UserIcon
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate, Link } from 'react-router-dom';
import { ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, Cell } from 'recharts';
import ChatAssistant from '@/components/ChatAssistant';
import { cn } from '@/lib/utils';
import { showError } from '@/utils/toast';

const Dashboard = () => {
  const { knowledgeBase, user, favorites, fetchEntries, fetchStats } = useApp();
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quickSearch, setQuickSearch] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchEntries(),
          fetchStats().then(data => setStats(data)).catch(() => setStats(null))
        ]);
      } catch (err) {
        console.error("Erro ao carregar dados do Dashboard:", err);
        showError("Não foi possível carregar todos os dados do dashboard.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickSearch.trim()) {
      navigate(`/knowledge?search=${encodeURIComponent(quickSearch)}`);
    }
  };

  const topReporters = useMemo(() => {
    const counts: Record<string, number> = {};
    knowledgeBase.forEach(entry => {
      if (entry.reporters) {
        entry.reporters.forEach(name => {
          counts[name] = (counts[name] || 0) + 1;
        });
      }
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [knowledgeBase]);

  const recentEntries = useMemo(() => {
    return [...knowledgeBase].slice(0, 5);
  }, [knowledgeBase]);

  const systemStatus = [
    { name: 'VPN Corporativa', status: 'online', icon: ShieldAlert },
    { name: 'Active Directory', status: 'online', icon: Activity },
    { name: 'Servidor de E-mail', status: 'warning', icon: Mail },
    { name: 'Link Internet', status: 'online', icon: Globe },
  ];

  const quickActions = [
    { label: 'Novo Registro', icon: Plus, path: '/new', color: 'bg-blue-500' },
    { label: 'Ver Favoritos', icon: Star, path: '/knowledge?category=Favoritos', color: 'bg-amber-500' },
    { label: 'Base Completa', icon: BookOpen, path: '/knowledge', color: 'bg-indigo-500' },
    { label: 'Meu Perfil', icon: UserIcon, path: '/profile', color: 'bg-emerald-500' },
  ];

  const COLORS = ['#6366f1', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#64748b'];

  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
            Olá, {user?.name?.split(' ')[0] || 'Técnico'}! 👋
          </h1>
          <p className="text-muted-foreground text-lg">Bem-vindo à sua central de inteligência técnica.</p>
        </div>
        
        <form onSubmit={handleSearch} className="relative w-full lg:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Busca rápida na base..." 
            className="h-14 pl-12 pr-4 rounded-2xl bg-card border-none shadow-xl shadow-primary/5 focus-visible:ring-2 focus-visible:ring-primary/20"
            value={quickSearch}
            onChange={(e) => setQuickSearch(e.target.value)}
          />
        </form>
      </div>

      {/* Quick Actions & Status Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Button
              key={action.label}
              variant="ghost"
              className="h-auto p-6 flex flex-col items-center gap-3 rounded-3xl bg-card/40 backdrop-blur-md hover:bg-card/60 border-none shadow-lg transition-all group"
              onClick={() => navigate(action.path)}
            >
              <div className={cn("p-3 rounded-2xl text-white shadow-lg group-hover:scale-110 transition-transform", action.color)}>
                <action.icon className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold tracking-tight">{action.label}</span>
            </Button>
          ))}
        </div>
        <div className="lg:col-span-4 grid grid-cols-2 gap-4">
          {systemStatus.slice(0, 2).map((sys) => (
            <Card 
              key={sys.name} 
              className="border-none shadow-lg bg-card/40 backdrop-blur-md rounded-3xl cursor-pointer hover:bg-card/60 transition-colors"
              onClick={() => navigate('/status')}
            >
              <CardContent className="p-5 flex items-center gap-4">
                <div className={cn(
                  "p-3 rounded-2xl",
                  sys.status === 'online' ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                )}>
                  <sys.icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest truncate">{sys.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className={cn(
                      "w-2 h-2 rounded-full animate-pulse",
                      sys.status === 'online' ? "bg-emerald-500" : "bg-amber-500"
                    )} />
                    <span className="text-sm font-bold capitalize">{sys.status}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-8">
          <ChatAssistant />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-none shadow-xl bg-card/50 rounded-3xl overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-indigo-500" /> Categorias
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[220px] pt-0">
                {stats?.byCategory && stats.byCategory.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.byCategory}>
                      <XAxis dataKey="name" hide />
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                        cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                      />
                      <Bar dataKey="value" radius={[6, 6, 6, 6]} barSize={30}>
                        {stats.byCategory.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground text-sm italic">
                    Nenhum dado de categoria disponível.
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white rounded-3xl">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="w-5 h-5" /> Resumo Semanal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm opacity-80">Novas Soluções</span>
                  <span className="text-2xl font-bold">{stats?.recent || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm opacity-80">Total na Base</span>
                  <span className="text-2xl font-bold">{stats?.total || 0}</span>
                </div>
                <Button variant="secondary" className="w-full rounded-2xl font-bold bg-white/20 hover:bg-white/30 border-none text-white" asChild>
                  <Link to="/knowledge">Ver Tudo</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-8">
          <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
            <CardHeader className="bg-accent/30">
              <CardTitle className="text-lg flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" /> Top Contribuidores
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                {topReporters.length > 0 ? topReporters.map(([name, count], index) => (
                  <div key={name} className="p-4 flex items-center justify-between hover:bg-accent/20 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold",
                        index === 0 ? "bg-amber-500 text-white" : "bg-accent text-muted-foreground"
                      )}>
                        {index + 1}
                      </div>
                      <span className="text-sm font-bold">{name}</span>
                    </div>
                    <Badge variant="secondary" className="rounded-lg px-2 py-0.5">{count} chamados</Badge>
                  </div>
                )) : (
                  <div className="p-10 text-center text-sm text-muted-foreground italic">Nenhum dado disponível</div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" /> Atividade Recente
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                {recentEntries.length > 0 ? recentEntries.map((entry) => (
                  <div 
                    key={entry.id} 
                    className="p-4 hover:bg-accent/20 transition-colors cursor-pointer flex items-center justify-between group"
                    onClick={() => navigate(`/entry/${entry.id}`)}
                  >
                    <div className="space-y-1 min-w-0">
                      <p className="font-bold text-sm truncate group-hover:text-primary transition-colors">{entry.title}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[9px] h-4 px-1.5 uppercase font-bold">{entry.category}</Badge>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(entry.createdAt).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1" />
                  </div>
                )) : (
                  <div className="p-10 text-center text-sm text-muted-foreground italic">Nenhuma atividade recente.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
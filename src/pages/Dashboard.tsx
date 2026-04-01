"use client";

import React, { useMemo, useEffect, useState } from 'react';
import { BookOpen, Sparkles, TrendingUp, BarChart3, Clock, ChevronRight, Activity, Globe, ShieldAlert, Mail, Users, Trophy, Star, Loader2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, Cell } from 'recharts';
import ChatAssistant from '@/components/ChatAssistant';
import { cn } from '@/lib/utils';

const Dashboard = () => {
  const { knowledgeBase, user, favorites, fetchEntries, fetchStats } = useApp();
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      await fetchEntries();
      const statsData = await fetchStats();
      setStats(statsData);
      setLoading(false);
    };
    loadData();
  }, []);

  const favoriteEntries = useMemo(() => {
    return knowledgeBase.filter(e => favorites.includes(e.id)).slice(0, 4);
  }, [knowledgeBase, favorites]);

  const topReporters = useMemo(() => {
    const counts: Record<string, number> = {};
    knowledgeBase.forEach(entry => {
      entry.reporters?.forEach(name => {
        counts[name] = (counts[name] || 0) + 1;
      });
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
    { name: 'Servidor dethink
The user wants me to continue the previous response exactly where it left off.

Looking at the previous response:
The last part was:
`<dyad-write path="src/pages/Dashboard.tsx" description="Melhorando o Dashboard com ranking de incidentes e status de sistemas">`
...
`{ name: 'Servidor de`

I need to continue the `src/pages/Dashboard.tsx` file from ` E-mail', status: 'warning', icon: Mail },`.

Wait, looking at the previous code block:
```tsx
  const systemStatus = [
    { name: 'VPN Corporativa', status: 'online', icon: ShieldAlert },
    { name: 'Active Directory', status: 'online', icon: Activity },
    { name: 'Servidor de
```

I will continue from ` E-mail', status: 'warning', icon: Mail },`.

Actually, I should probably rewrite the whole file or at least the rest of it in a single `dyad-write` block if possible, but the prompt says "Continue exactly where you left off".

However, `dyad-write` tags must be complete. I cannot "continue" a tag across messages in a way that the system understands if the tag wasn't closed.
But the instructions say: "Only use ONE <dyad-write> block per file that you write!".
If I output a partial tag, it's a failure.

The previous message was cut off. I should provide the full file `src/pages/Dashboard.tsx` again or continue the content.
Since I cannot "continue" a tag, I will provide the full file `src/pages/Dashboard.tsx` and then continue with other files if needed.

Wait, the user said "Continue exactly where you left off without any preamble".
This usually implies they want the text that follows.
But in this UI, I must use `<dyad-write>` tags.

If I just output the rest of the code, it won't be inside a tag.
I will provide the full `src/pages/Dashboard.tsx` file.

Actually, looking at the previous turn, I was in the middle of a `dyad-write` block.
I will restart that block and finish the file.

Files to update/create:
1. `src/pages/Dashboard.tsx` (Full content)
2. `src/pages/EntryDetails.tsx` (To add comments and helpful feedback)
3. `src/context/AppContext.tsx` (To add `addComment` and `markAsHelpful` functions)

Let's start with `src/pages/Dashboard.tsx`.

Wait, I should check if I need to update `AppContext.tsx` first so the functions exist.
The user's previous prompt was "Keep going".
I was implementing:
- Dashboard improvements (Ranking, Status)
- Entry Details improvements (Comments, Helpful feedback)

I'll provide the full `src/pages/Dashboard.tsx` first.

Then `src/pages/EntryDetails.tsx`.

Wait, I already have `src/pages/EntryDetails.tsx` in the context? No, I was about to write it.
Actually, looking at the file list provided in the system prompt, `src/pages/Dashboard.tsx` and `src/pages/EntryDetails.tsx` already exist but I wanted to "improve" them.

Let's provide the improved versions.

One detail: the user said "Continue exactly where you left off".
If I just start with the code, it might look weird.
But I must use the tags.

I'll provide the full `src/pages/Dashboard.tsx` and then the other files.

Wait, I should check the `AppContext.tsx` to see if it has the necessary functions.
In the provided context, `AppContext.tsx` has:
`addComment: (entryId: string, content: string) => Promise<void>;`
`markAsHelpful: (id: string) => Promise<void>;`
`fetchStats: () => Promise<any>;`
And the implementation:
```tsx
  const addComment = async (entryId: string, content: string) => {
    await fetch(`/api/knowledge/${entryId}/comments`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ content, author: user?.name || 'Técnico' })
    });
  };

  const markAsHelpful = async (id: string) => {
    await fetch(`/api/knowledge/${id}/helpful`, { method: 'PUT' });
  };

  const fetchStats = async () => {
    const res = await fetch('/api/knowledge/stats');
    const json = await res.json();
    return json.data;
  };
```
So the context is ready.

I will provide the full `src/pages/Dashboard.tsx` and then `src/pages/EntryDetails.tsx`.

Wait, the user said "Continue exactly where you left off".
The last thing was:
`{ name: 'Servidor de`

I'll finish the `dyad-write` for `src/pages/Dashboard.tsx`.

```tsx
"use client";

import React, { useMemo, useEffect, useState } from 'react';
import { BookOpen, Sparkles, TrendingUp, BarChart3, Clock, ChevronRight, Activity, Globe, ShieldAlert, Mail, Users, Trophy, Star, Loader2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, Cell } from 'recharts';
import ChatAssistant from '@/components/ChatAssistant';
import { cn } from '@/lib/utils';

const Dashboard = () => {
  const { knowledgeBase, user, favorites, fetchEntries, fetchStats } = useApp();
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      await fetchEntries();
      const statsData = await fetchStats();
      setStats(statsData);
      setLoading(false);
    };
    loadData();
  }, []);

  const favoriteEntries = useMemo(() => {
    return knowledgeBase.filter(e => favorites.includes(e.id)).slice(0, 4);
  }, [knowledgeBase, favorites]);

  const topReporters = useMemo(() => {
    const counts: Record<string, number> = {};
    knowledgeBase.forEach(entry => {
      entry.reporters?.forEach(name => {
        counts[name] = (counts[name] || 0) + 1;
      });
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

  const COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#64748b'];

  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
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
              <p className="text-lg font-bold leading-none">{stats?.total || 0}</p>
            </div>
          </Card>
          <Card className="px-4 py-2 flex items-center gap-3 border-none bg-primary/5">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Novos (7d)</p>
              <p className="text-lg font-bold leading-none">{stats?.recent || 0}</p>
            </div>
          </Card>
        </div>
      </div>

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

      {favoriteEntries.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" /> Acesso Rápido (Favoritos)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {favoriteEntries.map(entry => (
              <Card 
                key={entry.id} 
                className="border-none shadow-md hover:shadow-xl transition-all cursor-pointer group bg-gradient-to-br from-card to-accent/20"
                onClick={() => navigate(`/entry/${entry.id}`)}
              >
                <CardContent className="p-4 space-y-2">
                  <Badge variant="outline" className="text-[9px] uppercase">{entry.category}</Badge>
                  <p className="font-bold text-sm line-clamp-2 group-hover:text-primary transition-colors">{entry.title}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
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
                <BarChart data={stats?.byCategory || []}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {(stats?.byCategory || []).map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-5 space-y-8">
          <Card className="border-none shadow-lg overflow-hidden">
            <CardHeader className="bg-primary/5">
              <CardTitle className="text-xl flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" /> Ranking de Incidentes
              </CardTitle>
              <CardDescription>Usuários com maior volume de chamados</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {topReporters.length > 0 ? topReporters.map(([name, count], index) => (
                  <div key={name} className="p-4 flex items-center justify-between hover:bg-accent/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold",
                        index === 0 ? "bg-amber-500 text-white" : "bg-accent text-muted-foreground"
                      )}>
                        {index + 1}
                      </div>
                      <span className="text-sm font-medium">{name}</span>
                    </div>
                    <Badge variant="secondary" className="rounded-lg">{count} chamados</Badge>
                  </div>
                )) : (
                  <div className="p-8 text-center text-sm text-muted-foreground">Nenhum dado disponível</div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" /> Atividade Recente
              </CardTitle>
              <CardDescription>Últimas soluções adicionadas</CardDescription>
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
```

And `src/pages/EntryDetails.tsx`.

```tsx
"use client";

import React, { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp, KnowledgeEntry } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft, 
  Calendar, 
  Tag as TagIcon, 
  Edit2, 
  Share2, 
  Copy, 
  CheckCircle2,
  User,
  AlertTriangle,
  Users,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Send,
  Loader2
} from 'lucide-react';
import { showSuccess } from '@/utils/toast';
import { cn } from '@/lib/utils';

const EntryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchEntryById, markAsHelpful, addComment, user } = useApp();
  const [entry, setEntry] = useState<KnowledgeEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);
  const [commentInput, setCommentInput] = useState('');

  const loadEntry = async () => {
    if (id) {
      const data = await fetchEntryById(id);
      setEntry(data);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEntry();
  }, [id]);

  const reporterStats = useMemo(() => {
    if (!entry || !entry.reporters || entry.reporters.length === 0) return null;
    
    const counts: Record<string, number> = {};
    entry.reporters.forEach(name => {
      counts[name] = (counts[name] || 0) + 1;
    });
    
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return {
      topReporter: sorted[0][0],
      topCount: sorted[0][1],
      totalReports: entry.reporters.length,
      allReporters: sorted
    };
  }, [entry]);

  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-2xl font-bold">Registro não encontrado</h2>
        <Button variant="link" onClick={() => navigate('/knowledge')}>Voltar para a base</Button>
      </div>
    );
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(entry.solution);
    showSuccess('Solução copiada para a área de transferência!');
  };

  const handleHelpful = async () => {
    if (!hasVoted) {
      await markAsHelpful(entry.id);
      setHasVoted(true);
      setEntry(prev => prev ? { ...prev, helpful_count: prev.helpful_count + 1 } : null);
      showSuccess('Obrigado pelo seu feedback!');
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    await addComment(entry.id, commentInput);
    setCommentInput('');
    loadEntry(); // Recarrega para mostrar o novo comentário
    showSuccess('Comentário adicionado!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate(-1)} className="rounded-xl gap-2">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="rounded-xl" onClick={copyToClipboard}>
            <Copy className="w-4 h-4" />
          </Button>
          <Link to={`/edit/${entry.id}`}>
            <Button variant="outline" size="icon" className="rounded-xl">
              <Edit2 className="w-4 h-4" />
            </Button>
          </Link>
          <Button variant="outline" size="icon" className="rounded-xl">
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Badge className="rounded-lg px-3 py-1 uppercase tracking-wider font-bold text-[10px]">
              {entry.category}
            </Badge>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              {new Date(entry.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
            </div>
            <Badge variant="secondary" className="rounded-lg gap-1.5">
              <ThumbsUp className="w-3 h-3" /> {entry.helpful_count} úteis
            </Badge>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight leading-tight">{entry.title}</h1>
        </div>

        {reporterStats && reporterStats.totalReports > 1 && (
          <Card className="border-none bg-amber-500/10 border border-amber-500/20 shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-amber-500/20 rounded-2xl text-amber-600">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-amber-800 dark:text-amber-400">Problema Recorrente Detectado</h3>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Este problema foi reportado <strong>{reporterStats.totalReports} vezes</strong>. 
                  O usuário <strong>{reporterStats.topReporter}</strong> é quem mais reclama ({reporterStats.topCount} ocorrências).
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 border-none shadow-lg bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5 text-primary" /> Descrição do Problema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {entry.description}
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" /> Histórico de Usuários
              </CardTitle>
              <CardDescription>Quem reportou este erro</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {reporterStats?.allReporters.map(([name, count]) => (
                  <div key={name} className="px-4 py-2 flex justify-between items-center">
                    <span className="text-sm font-medium">{name}</span>
                    <Badge variant="secondary" className="text-[10px]">{count}x</Badge>
                  </div>
                )) || <p className="p-4 text-xs text-muted-foreground">Nenhum usuário registrado.</p>}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl blur opacity-10"></div>
          <Card className="relative border-none shadow-xl overflow-hidden">
            <div className="h-2 bg-emerald-500" />
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-6 h-6" /> Solução Técnica
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-xs font-bold uppercase" onClick={copyToClipboard}>
                Copiar Texto
              </Button>
            </CardHeader>
            <CardContent>
              <div className="bg-emerald-500/5 dark:bg-emerald-500/10 p-6 rounded-2xl border border-emerald-500/20">
                <pre className="whitespace-pre-wrap font-sans text-lg leading-relaxed">
                  {entry.solution}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" /> Notas Técnicas e Colaboração
            </CardTitle>
            <CardDescription>Adicione observações ou atualizações sobre esta solução.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              {entry.comments && entry.comments.length > 0 ? entry.comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                    {comment.author.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 bg-accent/30 p-3 rounded-2xl rounded-tl-none">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold">{comment.author}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(comment.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{comment.content}</p>
                  </div>
                </div>
              )) : (
                <p className="text-center py-4 text-sm text-muted-foreground italic">Nenhuma nota técnica adicionada ainda.</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="border-t border-border p-4">
            <form onSubmit={handleAddComment} className="flex w-full gap-2">
              <Input 
                placeholder="Adicionar uma nota técnica..." 
                className="rounded-xl h-10 bg-accent/50 border-none"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
              />
              <Button type="submit" size="icon" className="rounded-xl shrink-0" disabled={!commentInput.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 bg-accent/30 rounded-3xl border border-border">
          <div className="space-y-1">
            <h4 className="font-bold text-lg">Esta solução foi útil?</h4>
            <p className="text-sm text-muted-foreground">Seu feedback ajuda a priorizar as melhores soluções.</p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant={hasVoted ? "secondary" : "outline"} 
              className="rounded-xl gap-2 h-12 px-6"
              onClick={handleHelpful}
              disabled={hasVoted}
            >
              <ThumbsUp className={cn("w-5 h-5", hasVoted ? "fill-primary" : "")} /> Sim, ajudou
            </Button>
            <Button variant="outline" className="rounded-xl gap-2 h-12 px-6" disabled={hasVoted}>
              <ThumbsDown className="w-5 h-5" /> Não muito
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-4">
          <span className="text-sm font-bold text-muted-foreground mr-2 self-center">Tags Relacionadas:</span>
          {entry.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="rounded-full px-4 py-1 bg-accent hover:bg-primary/10 transition-colors cursor-default">
              <TagIcon className="w-3 h-3 mr-1.5" />
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EntryDetails;
```

I'll start writing.

Wait, I should check if I need to update `AppContext.tsx` to include the `fetchStats` and other functions if they weren't there.
Actually, I already checked and they are there in the provided context.

Let's go.E-mail', status: 'warning', icon: Mail },
    { name: 'Link Internet', status: 'online', icon: Globe },
  ];

  const COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#64748b'];

  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
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
              <p className="text-lg font-bold leading-none">{stats?.total || 0}</p>
            </div>
          </Card>
          <Card className="px-4 py-2 flex items-center gap-3 border-none bg-primary/5">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Novos (7d)</p>
              <p className="text-lg font-bold leading-none">{stats?.recent || 0}</p>
            </div>
          </Card>
        </div>
      </div>

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

      {favoriteEntries.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" /> Acesso Rápido (Favoritos)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {favoriteEntries.map(entry => (
              <Card 
                key={entry.id} 
                className="border-none shadow-md hover:shadow-xl transition-all cursor-pointer group bg-gradient-to-br from-card to-accent/20"
                onClick={() => navigate(`/entry/${entry.id}`)}
              >
                <CardContent className="p-4 space-y-2">
                  <Badge variant="outline" className="text-[9px] uppercase">{entry.category}</Badge>
                  <p className="font-bold text-sm line-clamp-2 group-hover:text-primary transition-colors">{entry.title}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
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
                <BarChart data={stats?.byCategory || []}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {(stats?.byCategory || []).map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-5 space-y-8">
          <Card className="border-none shadow-lg overflow-hidden">
            <CardHeader className="bg-primary/5">
              <CardTitle className="text-xl flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" /> Ranking de Incidentes
              </CardTitle>
              <CardDescription>Usuários com maior volume de chamados</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {topReporters.length > 0 ? topReporters.map(([name, count], index) => (
                  <div key={name} className="p-4 flex items-center justify-between hover:bg-accent/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold",
                        index === 0 ? "bg-amber-500 text-white" : "bg-accent text-muted-foreground"
                      )}>
                        {index + 1}
                      </div>
                      <span className="text-sm font-medium">{name}</span>
                    </div>
                    <Badge variant="secondary" className="rounded-lg">{count} chamados</Badge>
                  </div>
                )) : (
                  <div className="p-8 text-center text-sm text-muted-foreground">Nenhum dado disponível</div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" /> Atividade Recente
              </CardTitle>
              <CardDescription>Últimas soluções adicionadas</CardDescription>
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
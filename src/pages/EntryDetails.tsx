"use client";

import React, { useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Calendar, 
  Tag as TagIcon, 
  Edit2, 
  Share2, 
  Copy, 
  CheckCircle2,
  Clock,
  User,
  AlertTriangle,
  Users
} from 'lucide-react';
import { showSuccess } from '@/utils/toast';

const EntryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { knowledgeBase } = useApp();
  
  const entry = knowledgeBase.find(e => e.id === id);

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

  if (!entry) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-2xl font-bold">Registro não encontrado</h2>
        <Button variant="link" onClick={() => navigate('/knowledge')}>Voltar para a base</Button>
      </div>
    );
  }

  const relatedEntries = knowledgeBase
    .filter(e => e.id !== entry.id && (e.category === entry.category || e.tags.some(t => entry.tags.includes(t))))
    .slice(0, 3);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(entry.solution);
    showSuccess('Solução copiada para a área de transferência!');
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
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight leading-tight">{entry.title}</h1>
        </div>

        {/* Alerta de Recorrência */}
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
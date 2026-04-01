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
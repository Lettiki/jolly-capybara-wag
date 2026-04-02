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
  Loader2,
  ChevronRight,
  Printer,
  Link as LinkIcon,
  Sparkles
} from 'lucide-react';
import { showSuccess } from '@/utils/toast';
import { cn } from '@/lib/utils';

const EntryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchEntryById, markAsHelpful, addComment, knowledgeBase, fetchEntries } = useApp();
  const [entry, setEntry] = useState<KnowledgeEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);
  const [commentInput, setCommentInput] = useState('');

  const loadEntry = async () => {
    if (id) {
      const data = await fetchEntryById(id);
      setEntry(data);
      setLoading(false);
      
      // Se a base global estiver vazia (acesso direto), carrega para os relacionados
      if (knowledgeBase.length === 0) {
        fetchEntries();
      }
    }
  };

  useEffect(() => {
    loadEntry();
    window.scrollTo(0, 0);
  }, [id]);

  const relatedEntries = useMemo(() => {
    if (!entry) return [];
    return knowledgeBase
      .filter(e => e.id !== entry.id && (e.category === entry.category || e.tags.some(t => entry.tags.includes(t))))
      .slice(0, 3);
  }, [entry, knowledgeBase]);

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

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    showSuccess('Link da solução copiado!');
  };

  const handlePrint = () => {
    window.print();
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
    loadEntry();
    showSuccess('Comentário adicionado!');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 px-4 md:px-0 print:p-0 print:max-w-none">
      <div className="flex items-center justify-between print:hidden">
        <Button variant="ghost" onClick={() => navigate(-1)} className="rounded-xl gap-2">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="rounded-xl" onClick={copyLink} title="Copiar Link">
            <LinkIcon className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-xl" onClick={handlePrint} title="Imprimir">
            <Printer className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-xl" onClick={copyToClipboard} title="Copiar Solução">
            <Copy className="w-4 h-4" />
          </Button>
          <Link to={`/edit/${entry.id}`}>
            <Button variant="outline" size="icon" className="rounded-xl" title="Editar">
              <Edit2 className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8 print:col-span-12">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3 print:hidden">
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
            
            <div className="hidden print:block border-b pb-4 mb-6">
              <h2 className="text-sm font-bold uppercase text-primary">Base de Conhecimento Técnica</h2>
              <p className="text-xs text-muted-foreground">Documento gerado em {new Date().toLocaleString('pt-BR')}</p>
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">{entry.title}</h1>
          </div>

          {reporterStats && reporterStats.totalReports > 1 && (
            <Card className="border-none bg-amber-500/10 border border-amber-500/20 shadow-sm print:bg-white print:border-amber-500">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-amber-500/20 rounded-2xl text-amber-600 print:hidden">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-amber-800 dark:text-amber-400">Problema Recorrente Detectado</h3>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    Este problema foi reportado <strong>{reporterStats.totalReports} vezes</strong>. 
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm print:shadow-none print:bg-white print:border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5 text-primary print:hidden" /> Descrição do Problema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed print:text-black">
                {entry.description}
              </p>
            </CardContent>
          </Card>

          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl blur opacity-10 print:hidden"></div>
            <Card className="relative border-none shadow-xl overflow-hidden print:shadow-none print:border">
              <div className="h-2 bg-emerald-500 print:hidden" />
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl flex items-center gap-2 text-emerald-600 dark:text-emerald-400 print:text-emerald-700">
                  <CheckCircle2 className="w-6 h-6 print:hidden" /> Solução Técnica
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-emerald-500/5 dark:bg-emerald-500/10 p-6 rounded-2xl border border-emerald-500/20 print:bg-white print:border-emerald-700">
                  <pre className="whitespace-pre-wrap font-sans text-lg leading-relaxed print:text-black print:text-base">
                    {entry.solution}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm print:hidden">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" /> Notas Técnicas
              </CardTitle>
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
                  <p className="text-center py-4 text-sm text-muted-foreground italic">Nenhuma nota técnica adicionada.</p>
                )}
              </div>
            </CardContent>
            <CardFooter className="border-t border-border p-4">
              <form onSubmit={handleAddComment} className="flex w-full gap-2">
                <Input 
                  placeholder="Adicionar nota..." 
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
        </div>

        <div className="lg:col-span-4 space-y-8 print:hidden">
          <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" /> Usuários Afetados
              </CardTitle>
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

          <div className="space-y-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" /> Soluções Relacionadas
            </h3>
            <div className="space-y-3">
              {relatedEntries.length > 0 ? relatedEntries.map(rel => (
                <Link key={rel.id} to={`/entry/${rel.id}`}>
                  <Card className="border-none shadow-sm hover:shadow-md transition-all group cursor-pointer bg-card/50">
                    <CardContent className="p-4">
                      <Badge variant="outline" className="text-[9px] mb-2 uppercase">{rel.category}</Badge>
                      <p className="text-sm font-bold line-clamp-2 group-hover:text-primary transition-colors">{rel.title}</p>
                      <div className="flex items-center justify-end mt-2">
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )) : (
                <p className="text-sm text-muted-foreground italic">Nenhuma solução similar encontrada.</p>
              )}
            </div>
          </div>

          <div className="p-6 bg-accent/30 rounded-3xl border border-border space-y-4">
            <h4 className="font-bold">Ajudou você?</h4>
            <div className="flex gap-2">
              <Button 
                variant={hasVoted ? "secondary" : "outline"} 
                className="flex-1 rounded-xl gap-2"
                onClick={handleHelpful}
                disabled={hasVoted}
              >
                <ThumbsUp className={cn("w-4 h-4", hasVoted && "fill-primary")} /> Sim
              </Button>
              <Button variant="outline" className="flex-1 rounded-xl gap-2" disabled={hasVoted}>
                <ThumbsDown className="w-4 h-4" /> Não
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntryDetails;
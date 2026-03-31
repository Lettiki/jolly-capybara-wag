"use client";

import React, { useState, useMemo } from 'react';
import { Search, MessageSquare, ArrowRight, Sparkles, Plus, BookOpen, AlertCircle } from 'lucide-react';
import { useApp, KnowledgeEntry } from '@/context/AppContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { knowledgeBase, user } = useApp();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<KnowledgeEntry[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    const filtered = knowledgeBase.filter(entry => 
      entry.title.toLowerCase().includes(query.toLowerCase()) ||
      entry.description.toLowerCase().includes(query.toLowerCase()) ||
      entry.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );

    setResults(filtered);
    setHasSearched(true);
  };

  const stats = useMemo(() => ({
    total: knowledgeBase.length,
    recent: knowledgeBase.filter(e => {
      const date = new Date(e.createdAt);
      const now = new Date();
      return (now.getTime() - date.getTime()) < (7 * 24 * 60 * 60 * 1000);
    }).length,
    categories: new Set(knowledgeBase.map(e => e.category)).size
  }), [knowledgeBase]);

  return (
    <div className="space-y-10 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Olá, {user?.name}! 👋</h1>
          <p className="text-muted-foreground text-lg mt-1">Como posso ajudar você hoje?</p>
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

      {/* Search Assistant */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
        <Card className="relative border-none shadow-2xl rounded-3xl overflow-hidden">
          <CardContent className="p-8 md:p-12">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Assistente Inteligente</h2>
                <p className="text-muted-foreground">Descreva o problema técnico para encontrar uma solução imediata.</p>
              </div>
              
              <form onSubmit={handleSearch} className="relative group">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                  <Search className="w-6 h-6" />
                </div>
                <Input 
                  placeholder="Ex: VPN não conecta, Outlook travado, Reset de senha..." 
                  className="h-16 pl-14 pr-36 text-lg rounded-2xl border-2 border-muted focus-visible:ring-primary focus-visible:border-primary transition-all shadow-inner"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <Button 
                  type="submit"
                  className="absolute right-2 top-2 bottom-2 px-6 rounded-xl font-bold text-base shadow-lg shadow-primary/20"
                >
                  Buscar Solução
                </Button>
              </form>

              <div className="flex flex-wrap justify-center gap-2">
                <span className="text-sm text-muted-foreground mr-2 self-center">Sugestões:</span>
                {['VPN', 'Outlook', 'AD', 'Rede'].map(tag => (
                  <Button 
                    key={tag} 
                    variant="outline" 
                    size="sm" 
                    className="rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => { setQuery(tag); handleSearch(); }}
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results Section */}
      {hasSearched && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              {results.length > 0 ? `Encontramos ${results.length} soluções` : 'Nenhuma solução encontrada'}
            </h3>
            {results.length === 0 && (
              <Link to="/new">
                <Button variant="outline" className="gap-2 rounded-xl">
                  <Plus className="w-4 h-4" />
                  Cadastrar Novo Problema
                </Button>
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.map((entry) => (
              <Card key={entry.id} className="group hover:shadow-xl transition-all duration-300 border-none bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="rounded-lg px-3 py-1 bg-primary/10 text-primary border-none">
                      {entry.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(entry.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">{entry.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground line-clamp-2 text-sm">{entry.description}</p>
                  <div className="p-4 bg-accent/50 rounded-xl border border-border/50">
                    <p className="text-xs font-bold uppercase text-primary mb-1">Solução Sugerida:</p>
                    <p className="text-sm font-medium leading-relaxed">{entry.solution}</p>
                  </div>
                  <div className="flex flex-wrap gap-1 pt-2">
                    {entry.tags.map(tag => (
                      <span key={tag} className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {results.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 bg-accent/20 rounded-3xl border-2 border-dashed border-muted">
              <div className="p-4 bg-background rounded-full shadow-sm">
                <AlertCircle className="w-12 h-12 text-muted-foreground" />
              </div>
              <div className="max-w-md space-y-2">
                <h4 className="text-lg font-bold">Não encontramos o que você procura</h4>
                <p className="text-muted-foreground">
                  Tente usar palavras-chave diferentes ou cadastre este novo problema para ajudar outros técnicos no futuro.
                </p>
              </div>
              <Link to="/new">
                <Button className="rounded-xl h-11 px-8">Cadastrar Solução</Button>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Quick Actions */}
      {!hasSearched && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-none bg-blue-500/5 hover:bg-blue-500/10 transition-colors cursor-pointer group">
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
              <div className="p-3 bg-blue-500/20 rounded-2xl text-blue-600 group-hover:scale-110 transition-transform">
                <BookOpen className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-lg">Explorar Base</h3>
                <p className="text-sm text-muted-foreground">Navegue por todas as soluções cadastradas no sistema.</p>
              </div>
              <Link to="/knowledge" className="w-full">
                <Button variant="ghost" className="w-full gap-2 group-hover:translate-x-1 transition-transform">
                  Ver Tudo <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-none bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors cursor-pointer group">
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
              <div className="p-3 bg-emerald-500/20 rounded-2xl text-emerald-600 group-hover:scale-110 transition-transform">
                <Plus className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-lg">Novo Registro</h3>
                <p className="text-sm text-muted-foreground">Encontrou uma solução nova? Registre-a agora mesmo.</p>
              </div>
              <Link to="/new" className="w-full">
                <Button variant="ghost" className="w-full gap-2 group-hover:translate-x-1 transition-transform">
                  Criar Agora <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-none bg-purple-500/5 hover:bg-purple-500/10 transition-colors cursor-pointer group">
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
              <div className="p-3 bg-purple-500/20 rounded-2xl text-purple-600 group-hover:scale-110 transition-transform">
                <Settings className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-lg">Configurações</h3>
                <p className="text-sm text-muted-foreground">Ajuste suas preferências e dados de perfil técnico.</p>
              </div>
              <Link to="/profile" className="w-full">
                <Button variant="ghost" className="w-full gap-2 group-hover:translate-x-1 transition-transform">
                  Acessar Perfil <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
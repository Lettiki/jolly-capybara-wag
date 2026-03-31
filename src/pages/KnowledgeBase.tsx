"use client";

import React, { useState, useEffect } from 'react';
import { useApp, Category } from '@/context/AppContext';
import { useSearchParams, Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Edit2, 
  Trash2, 
  Plus, 
  ChevronRight,
  Calendar,
  Tag as TagIcon,
  MoreVertical,
  Star,
  Copy
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { showSuccess } from '@/utils/toast';
import { cn } from '@/lib/utils';

const KnowledgeBase = () => {
  const { knowledgeBase, deleteEntry, favorites, toggleFavorite } = useApp();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'Todas' | 'Favoritos'>('Todas');

  useEffect(() => {
    const query = searchParams.get('search');
    if (query) setSearchTerm(query);
  }, [searchParams]);

  const categories: (Category | 'Todas' | 'Favoritos')[] = ['Todas', 'Favoritos', 'Rede', 'Sistema', 'AD', 'Email', 'Hardware', 'Outros'];

  const filteredEntries = knowledgeBase.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    
    let matchesCategory = true;
    if (selectedCategory === 'Favoritos') {
      matchesCategory = favorites.includes(entry.id);
    } else if (selectedCategory !== 'Todas') {
      matchesCategory = entry.category === selectedCategory;
    }

    return matchesSearch && matchesCategory;
  });

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este registro?')) {
      deleteEntry(id);
      showSuccess('Registro excluído com sucesso.');
    }
  };

  const copySolution = (solution: string) => {
    navigator.clipboard.writeText(solution);
    showSuccess('Solução copiada!');
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Base de Conhecimento</h1>
          <p className="text-muted-foreground">Gerencie e consulte todas as soluções técnicas registradas.</p>
        </div>
        <Link to="/new">
          <Button className="gap-2 rounded-xl h-11 px-6 shadow-lg shadow-primary/20">
            <Plus className="w-5 h-5" />
            Novo Registro
          </Button>
        </Link>
      </div>

      <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar por título, descrição ou tags..." 
                className="pl-10 h-11 rounded-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
              {categories.map(cat => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? 'default' : 'outline'}
                  size="sm"
                  className={cn(
                    "rounded-full px-4 h-11 whitespace-nowrap",
                    cat === 'Favoritos' && selectedCategory === 'Favoritos' ? "bg-amber-500 hover:bg-amber-600 text-white border-none" : ""
                  )}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat === 'Favoritos' && <Star className={cn("w-4 h-4 mr-2", selectedCategory === 'Favoritos' ? "fill-current" : "")} />}
                  {cat}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4">
        {filteredEntries.length > 0 ? (
          filteredEntries.map((entry) => (
            <Card key={entry.id} className="group hover:border-primary/50 transition-all duration-300 border-border/50 shadow-sm overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className={cn(
                  "w-2 md:w-3",
                  entry.category === 'Rede' ? 'bg-blue-500' :
                  entry.category === 'Sistema' ? 'bg-purple-500' :
                  entry.category === 'AD' ? 'bg-amber-500' :
                  entry.category === 'Email' ? 'bg-emerald-500' : 'bg-slate-500'
                )} />
                <div className="flex-1 p-6">
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="rounded-md font-bold text-[10px] uppercase tracking-wider">
                          {entry.category}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {new Date(entry.createdAt).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                      <h3 className="text-xl font-bold group-hover:text-primary transition-colors flex items-center gap-2">
                        {entry.title}
                        {favorites.includes(entry.id) && <Star className="w-4 h-4 fill-amber-500 text-amber-500" />}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="rounded-full text-muted-foreground hover:text-amber-500"
                        onClick={() => toggleFavorite(entry.id)}
                      >
                        <Star className={cn("w-4 h-4", favorites.includes(entry.id) ? "fill-amber-500 text-amber-500" : "")} />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-full">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl">
                          <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => copySolution(entry.solution)}>
                            <Copy className="w-4 h-4" /> Copiar Solução
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 cursor-pointer" asChild>
                            <Link to={`/edit/${entry.id}`}>
                              <Edit2 className="w-4 h-4" /> Editar
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="gap-2 text-destructive focus:text-destructive cursor-pointer"
                            onClick={() => handleDelete(entry.id)}
                          >
                            <Trash2 className="w-4 h-4" /> Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mt-3 text-sm leading-relaxed line-clamp-2">
                    {entry.description}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-2">
                      {entry.tags.map(tag => (
                        <div key={tag} className="flex items-center gap-1 text-xs font-medium text-muted-foreground bg-accent px-2 py-1 rounded-lg">
                          <TagIcon className="w-3 h-3" />
                          {tag}
                        </div>
                      ))}
                    </div>
                    <Link to={`/entry/${entry.id}`}>
                      <Button variant="ghost" size="sm" className="gap-1 text-primary font-bold hover:bg-primary/10 rounded-lg">
                        Ver Detalhes <ChevronRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-20 bg-accent/10 rounded-3xl border-2 border-dashed border-muted">
            <p className="text-muted-foreground">Nenhum registro encontrado com os filtros atuais.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KnowledgeBase;
"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, Category } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { showSuccess } from '@/utils/toast';
import { Save, X, Tag as TagIcon, AlertCircle, Users } from 'lucide-react';

const NewEntry = () => {
  const { addEntry } = useApp();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [solution, setSolution] = useState('');
  const [category, setCategory] = useState<Category>('Sistema');
  const [tagsInput, setTagsInput] = useState('');
  const [reportersInput, setReportersInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const tags = tagsInput.split(',').map(t => t.trim()).filter(t => t !== '');
    const reporters = reportersInput.split(',').map(r => r.trim()).filter(r => r !== '');
    
    addEntry({
      title,
      description,
      solution,
      category,
      tags,
      reporters
    });

    showSuccess('Solução cadastrada com sucesso na base!');
    navigate('/knowledge');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Novo Registro</h1>
          <p className="text-muted-foreground">Documente um novo problema e sua respectiva solução.</p>
        </div>
        <Button variant="ghost" onClick={() => navigate(-1)} className="rounded-xl">
          <X className="w-5 h-5 mr-2" /> Cancelar
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="border-none shadow-xl overflow-hidden">
          <div className="h-2 bg-primary" />
          <CardHeader>
            <CardTitle>Informações Técnicas</CardTitle>
            <CardDescription>Seja claro e objetivo para facilitar buscas futuras.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Título do Problema</Label>
              <Input 
                id="title" 
                placeholder="Ex: Erro de autenticação no Proxy" 
                className="h-11 rounded-xl"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Select value={category} onValueChange={(value) => setCategory(value as Category)}>
                  <SelectTrigger className="h-11 rounded-xl">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="Rede">Rede</SelectItem>
                    <SelectItem value="Sistema">Sistema</SelectItem>
                    <SelectItem value="AD">Active Directory</SelectItem>
                    <SelectItem value="Email">E-mail / Office</SelectItem>
                    <SelectItem value="Hardware">Hardware</SelectItem>
                    <SelectItem value="Outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
                <div className="relative">
                  <TagIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="tags" 
                    placeholder="proxy, internet, acesso" 
                    className="pl-10 h-11 rounded-xl"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reporters">Usuários Afetados (separados por vírgula)</Label>
              <div className="relative">
                <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="reporters" 
                  placeholder="João Silva, Maria Souza..." 
                  className="pl-10 h-11 rounded-xl"
                  value={reportersInput}
                  onChange={(e) => setReportersInput(e.target.value)}
                />
              </div>
              <p className="text-[10px] text-muted-foreground">Repita o nome se o mesmo usuário teve o problema várias vezes.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição Detalhada</Label>
              <Textarea 
                id="description" 
                placeholder="Descreva o cenário onde o problema ocorre..." 
                className="min-h-[100px] rounded-xl resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="solution" className="text-primary font-bold">Solução Passo-a-Passo</Label>
              <Textarea 
                id="solution" 
                placeholder="1. Abra o terminal... 2. Digite o comando..." 
                className="min-h-[150px] rounded-xl resize-none border-primary/30 focus-visible:border-primary"
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="bg-accent/30 p-6 flex justify-end">
            <Button type="submit" className="h-11 px-8 rounded-xl gap-2 font-bold shadow-lg shadow-primary/20">
              <Save className="w-5 h-5" />
              Salvar na Base
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default NewEntry;
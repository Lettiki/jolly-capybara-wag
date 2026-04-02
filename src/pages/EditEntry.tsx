"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp, Category } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { showSuccess, showError } from '@/utils/toast';
import { Save, X, Tag as TagIcon, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';

const EditEntry = () => {
  const { id } = useParams();
  const { knowledgeBase, updateEntry, fetchEntryById } = useApp();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [solution, setSolution] = useState('');
  const [category, setCategory] = useState<Category>('Sistema');
  const [tagsInput, setTagsInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadEntry = async () => {
      try {
        let entry = knowledgeBase.find(e => e.id === id);
        
        if (!entry && id) {
          entry = await fetchEntryById(id);
        }

        if (entry) {
          setTitle(entry.title);
          setDescription(entry.description);
          setSolution(entry.solution);
          setCategory(entry.category);
          setTagsInput(entry.tags.join(', '));
        } else {
          showError("Registro não encontrado.");
          navigate('/knowledge');
        }
      } catch (err) {
        showError("Erro ao carregar o registro.");
      } finally {
        setLoading(false);
      }
    };

    loadEntry();
  }, [id, knowledgeBase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setIsSaving(true);
    try {
      const tags = tagsInput.split(',').map(t => t.trim()).filter(t => t !== '');
      
      await updateEntry(id, {
        title,
        description,
        solution,
        category,
        tags
      });

      showSuccess('Registro atualizado com sucesso!');
      navigate(`/entry/${id}`);
    } catch (err) {
      showError("Erro ao salvar as alterações.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Editar Registro</h1>
            <p className="text-muted-foreground">Atualize as informações técnicas desta solução.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="border-none shadow-xl overflow-hidden">
          <div className="h-2 bg-amber-500" />
          <CardHeader>
            <CardTitle>Modificar Conteúdo</CardTitle>
            <CardDescription>Mantenha a base de conhecimento sempre atualizada.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Título do Problema</Label>
              <Input 
                id="title" 
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
                    className="pl-10 h-11 rounded-xl"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição Detalhada</Label>
              <Textarea 
                id="description" 
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
                className="min-h-[150px] rounded-xl resize-none border-primary/30 focus-visible:border-primary"
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="bg-accent/30 p-6 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => navigate(-1)} className="rounded-xl" disabled={isSaving}>
              Descartar
            </Button>
            <Button type="submit" className="h-11 px-8 rounded-xl gap-2 font-bold shadow-lg shadow-primary/20" disabled={isSaving}>
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Salvar Alterações
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default EditEntry;
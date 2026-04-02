"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Shield, Globe, Database, Save, Trash2, Loader2 } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { useApp } from '@/context/AppContext';

const Settings = () => {
  const { toggleDarkMode, isDarkMode } = useApp();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showSuccess('Configurações salvas com sucesso!');
    }, 800);
  };

  const handleClearCache = () => {
    if (confirm('Isso removerá todos os dados locais e desconectará você. Deseja continuar?')) {
      localStorage.clear();
      window.location.href = '/login';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">Gerencie as preferências globais da plataforma de suporte.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" /> Notificações
            </CardTitle>
            <CardDescription>Escolha como você deseja ser alertado sobre novos registros.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Alertas de Novos Problemas</Label>
                <p className="text-xs text-muted-foreground">Receba notificações quando um colega cadastrar uma nova solução.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Relatórios Semanais</Label>
                <p className="text-xs text-muted-foreground">Receba um resumo das atividades da base de conhecimento por e-mail.</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" /> Preferências do Sistema
            </CardTitle>
            <CardDescription>Ajuste o comportamento padrão da interface.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Modo Escuro</Label>
                <div className="flex items-center gap-3 p-3 bg-accent/30 rounded-xl">
                  <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />
                  <span className="text-sm font-medium">{isDarkMode ? 'Ativado' : 'Desativado'}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Idioma da Interface</Label>
                <Select defaultValue="pt-br">
                  <SelectTrigger className="rounded-xl h-11">
                    <SelectValue placeholder="Selecione o idioma" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="pt-br">Português (Brasil)</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg border-destructive/20 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Database className="w-5 h-5" /> Gerenciamento de Dados
            </CardTitle>
            <CardDescription>Ações críticas relacionadas aos dados da aplicação.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-background/50 rounded-xl border border-destructive/10 flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-sm font-bold text-destructive">Limpar Cache Local</p>
                <p className="text-xs text-muted-foreground">Isso removerá todos os dados salvos no navegador e forçará o logout.</p>
              </div>
              <Button variant="destructive" size="sm" className="rounded-lg gap-2" onClick={handleClearCache}>
                <Trash2 className="w-4 h-4" /> Limpar Tudo
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="ghost" className="rounded-xl">Descartar</Button>
          <Button onClick={handleSave} className="rounded-xl gap-2 px-8 shadow-lg shadow-primary/20" disabled={isSaving}>
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Salvar Configurações
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
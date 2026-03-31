"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Shield, Globe, Database, Save, Trash2 } from 'lucide-react';
import { showSuccess } from '@/utils/toast';

const Settings = () => {
  const handleSave = () => {
    showSuccess('Configurações salvas com sucesso!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">Gerencie as preferências globais da plataforma de suporte.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="border-none shadow-lg">
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

        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" /> Preferências do Sistema
            </CardTitle>
            <CardDescription>Ajuste o comportamento padrão da interface.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Idioma da Interface</Label>
                <Select defaultValue="pt-br">
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Selecione o idioma" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="pt-br">Português (Brasil)</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Categoria Padrão para Novos Registros</Label>
                <Select defaultValue="Sistema">
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="Rede">Rede</SelectItem>
                    <SelectItem value="Sistema">Sistema</SelectItem>
                    <SelectItem value="AD">Active Directory</SelectItem>
                    <SelectItem value="Email">E-mail / Office</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg border-destructive/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Database className="w-5 h-5" /> Gerenciamento de Dados
            </CardTitle>
            <CardDescription>Ações críticas relacionadas aos dados da aplicação.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-destructive/5 rounded-xl border border-destructive/10 flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-sm font-bold text-destructive">Limpar Cache Local</p>
                <p className="text-xs text-muted-foreground">Isso removerá todos os dados salvos no navegador, incluindo a base mock.</p>
              </div>
              <Button variant="destructive" size="sm" className="rounded-lg gap-2">
                <Trash2 className="w-4 h-4" /> Limpar Tudo
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="ghost" className="rounded-xl">Descartar</Button>
          <Button onClick={handleSave} className="rounded-xl gap-2 px-8 shadow-lg shadow-primary/20">
            <Save className="w-4 h-4" /> Salvar Configurações
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
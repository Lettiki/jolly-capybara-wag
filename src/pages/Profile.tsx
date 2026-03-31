"use client";

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { User, Mail, Shield, Lock, Save, Bell } from 'lucide-react';
import { showSuccess } from '@/utils/toast';

const Profile = () => {
  const { user } = useApp();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showSuccess('Perfil atualizado com sucesso!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Meu Perfil</h1>
        <p className="text-muted-foreground">Gerencie suas informações e preferências de conta.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <Card className="border-none shadow-lg overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-primary to-blue-600" />
            <CardContent className="pt-0 flex flex-col items-center -mt-12">
              <div className="w-24 h-24 rounded-full border-4 border-background bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold shadow-xl">
                {user?.name.charAt(0).toUpperCase()}
              </div>
              <div className="mt-4 text-center">
                <h3 className="text-xl font-bold">{user?.name}</h3>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                <Badge className="mt-2 rounded-full px-3">Técnico Nível 2</Badge>
              </div>
            </CardContent>
          </Card>

          <nav className="space-y-1">
            <Button variant="secondary" className="w-full justify-start gap-3 rounded-xl h-12">
              <User className="w-4 h-4" /> Dados Pessoais
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl h-12">
              <Shield className="w-4 h-4" /> Segurança
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl h-12">
              <Bell className="w-4 h-4" /> Notificações
            </Button>
          </nav>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle>Informações da Conta</CardTitle>
              <CardDescription>Atualize seus dados de identificação no sistema.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="profile-name">Nome Completo</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="profile-name" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10 h-11 rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profile-email">E-mail Corporativo</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="profile-email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-11 rounded-xl"
                        disabled
                      />
                    </div>
                  </div>
                </div>
                <Button type="submit" className="gap-2 rounded-xl h-11 px-6">
                  <Save className="w-4 h-4" /> Salvar Alterações
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle>Alterar Senha</CardTitle>
              <CardDescription>Mantenha sua conta segura com uma senha forte.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Senha Atual</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="current-password" type="password" className="pl-10 h-11 rounded-xl" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nova Senha</Label>
                  <Input id="new-password" type="password" className="h-11 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                  <Input id="confirm-password" type="password" className="h-11 rounded-xl" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-accent/30 p-6 flex justify-end">
              <Button variant="outline" className="rounded-xl h-11 px-6">Atualizar Senha</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
"use client";

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { User, Mail, Shield, Lock, Save, Bell, Loader2 } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

const Profile = () => {
  const { user, token } = useApp();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    showSuccess('Perfil atualizado com sucesso!');
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return showError('As senhas não coincidem');
    }

    setIsUpdating(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const json = await res.json();
      if (json.success) {
        showSuccess('Senha alterada com sucesso!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        showError(json.message);
      }
    } catch (err) {
      showError('Erro ao alterar senha');
    } finally {
      setIsUpdating(false);
    }
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
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle>Informações da Conta</CardTitle>
              <CardDescription>Atualize seus dados de identificação no sistema.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-4">
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
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Senha Atual</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="current-password" 
                      type="password" 
                      className="pl-10 h-11 rounded-xl"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Nova Senha</Label>
                    <Input 
                      id="new-password" 
                      type="password" 
                      className="h-11 rounded-xl"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                    <Input 
                      id="confirm-password" 
                      type="password" 
                      className="h-11 rounded-xl"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <Button type="submit" className="rounded-xl h-11 px-6" disabled={isUpdating}>
                    {isUpdating && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                    Atualizar Senha
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
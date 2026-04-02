"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { 
  User, 
  Mail, 
  Shield, 
  Lock, 
  Save, 
  Bell, 
  Loader2, 
  FileText, 
  MessageSquare, 
  ThumbsUp,
  History,
  ChevronRight
} from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, token, knowledgeBase, fetchEntries } = useApp();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [loading, setLoading] = useState(knowledgeBase.length === 0);

  useEffect(() => {
    const loadData = async () => {
      if (knowledgeBase.length === 0) {
        try {
          await fetchEntries();
        } catch (err) {
          console.error("Erro ao carregar dados do perfil");
        } finally {
          setLoading(false);
        }
      }
    };
    loadData();
  }, []);

  const userStats = useMemo(() => {
    const created = knowledgeBase.filter(e => e.reporters?.includes(user?.name || '')).length;
    const helpful = knowledgeBase.reduce((acc, curr) => acc + (curr.helpful_count || 0), 0);
    return { created, helpful };
  }, [knowledgeBase, user]);

  const userActivity = useMemo(() => {
    return [...knowledgeBase]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [knowledgeBase]);

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

  if (loading && knowledgeBase.length === 0) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meu Perfil</h1>
          <p className="text-muted-foreground">Gerencie suas informações e acompanhe sua contribuição na base.</p>
        </div>
        <Badge variant="outline" className="h-8 px-4 rounded-full border-primary/20 bg-primary/5 text-primary font-bold">
          Técnico Nível 2
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-none shadow-xl overflow-hidden bg-card/50 backdrop-blur-sm">
            <div className="h-32 bg-gradient-to-br from-primary via-blue-600 to-indigo-600" />
            <CardContent className="pt-0 flex flex-col items-center -mt-16">
              <div className="w-32 h-32 rounded-3xl border-8 border-background bg-primary/10 flex items-center justify-center text-primary text-4xl font-bold shadow-2xl">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="mt-6 text-center space-y-1">
                <h3 className="text-2xl font-bold">{user?.name || 'Usuário'}</h3>
                <p className="text-muted-foreground">{user?.email || 'email@empresa.com'}</p>
              </div>
              
              <div className="grid grid-cols-2 w-full gap-4 mt-8">
                <div className="p-4 bg-accent/50 rounded-2xl text-center">
                  <p className="text-2xl font-bold text-primary">{userStats.created}</p>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground">Soluções</p>
                </div>
                <div className="p-4 bg-accent/50 rounded-2xl text-center">
                  <p className="text-2xl font-bold text-emerald-500">{userStats.helpful}</p>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground">Feedbacks</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <History className="w-5 h-5 text-primary" /> Atividade Recente
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {userActivity.length > 0 ? userActivity.map((activity) => (
                  <div 
                    key={activity.id} 
                    className="p-4 hover:bg-accent/50 transition-colors cursor-pointer group"
                    onClick={() => navigate(`/entry/${activity.id}`)}
                  >
                    <p className="text-sm font-bold line-clamp-1 group-hover:text-primary transition-colors">{activity.title}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(activity.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                      <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                )) : (
                  <p className="p-8 text-center text-xs text-muted-foreground italic">Nenhuma atividade recente.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>Mantenha seus dados de contato atualizados.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="profile-name">Nome Completo</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="profile-name" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10 h-11 rounded-xl bg-accent/30 border-none"
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
                        className="pl-10 h-11 rounded-xl bg-accent/30 border-none"
                        disabled
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button type="submit" className="gap-2 rounded-xl h-11 px-8 shadow-lg shadow-primary/20">
                    <Save className="w-4 h-4" /> Salvar Alterações
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Segurança da Conta</CardTitle>
              <CardDescription>Recomendamos a troca de senha a cada 90 dias.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Senha Atual</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="current-password" 
                      type="password" 
                      className="pl-10 h-11 rounded-xl bg-accent/30 border-none"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Nova Senha</Label>
                    <Input 
                      id="new-password" 
                      type="password" 
                      className="h-11 rounded-xl bg-accent/30 border-none"
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
                      className="h-11 rounded-xl bg-accent/30 border-none"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button type="submit" className="rounded-xl h-11 px-8" disabled={isUpdating}>
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
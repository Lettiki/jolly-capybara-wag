"use client";

import React, { useEffect, useState } from 'react';
import { useApp, User, UserRole } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Shield, Users, Loader2, Mail, Calendar } from 'lucide-react';
import { Navigate } from 'react-router-dom';

const Admin = () => {
  const { user, fetchAllUsers, updateUserRole } = useApp();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      const data = await fetchAllUsers();
      setUsers(data);
      setLoading(false);
    };
    if (user?.role === 'admin') loadUsers();
  }, [user]);

  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    await updateUserRole(userId, newRole);
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Administração</h1>
          <p className="text-muted-foreground">Gerencie os usuários e permissões do sistema.</p>
        </div>
        <Badge variant="outline" className="h-10 px-4 rounded-xl border-primary/20 bg-primary/5 text-primary font-bold gap-2">
          <Shield className="w-4 h-4" /> Painel de Controle
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-2xl text-primary">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase">Total de Usuários</p>
              <p className="text-2xl font-bold">{users.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm overflow-hidden">
        <CardHeader>
          <CardTitle>Usuários Cadastrados</CardTitle>
          <CardDescription>Altere as funções dos técnicos para conceder ou revogar acesso administrativo.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-accent/30">
              <TableRow>
                <TableHead className="pl-6">Nome</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Função (Role)</TableHead>
                <TableHead className="pr-6 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id} className="hover:bg-accent/20 transition-colors">
                  <TableCell className="pl-6 font-medium">{u.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="w-3 h-3" /> {u.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={u.role === 'admin' ? "bg-primary" : "bg-secondary text-secondary-foreground"}>
                      {u.role.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-6 text-right">
                    <Select 
                      defaultValue={u.role} 
                      onValueChange={(val) => handleRoleChange(u.id, val as UserRole)}
                      disabled={u.id === user.id}
                    >
                      <SelectTrigger className="w-[140px] h-9 rounded-lg ml-auto">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="gestor">Gestor</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Admin;
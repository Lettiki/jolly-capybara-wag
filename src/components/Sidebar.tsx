"use client";

import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  PlusCircle, 
  User, 
  LogOut, 
  Search,
  Settings,
  Moon,
  Sun,
  ShieldCheck,
  Command
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, isDarkMode, toggleDarkMode, user } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: BookOpen, label: 'Base de Conhecimento', path: '/knowledge' },
    { icon: PlusCircle, label: 'Novo Problema', path: '/new' },
    { icon: User, label: 'Perfil', path: '/profile' },
    { icon: Settings, label: 'Configurações', path: '/settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/knowledge?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col h-screen sticky top-0">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-primary p-2 rounded-lg">
          <ShieldCheck className="text-primary-foreground w-6 h-6" />
        </div>
        <h1 className="font-bold text-xl tracking-tight">TechSupport</h1>
      </div>

      <div className="px-4 mb-4">
        <form onSubmit={handleGlobalSearch} className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Busca rápida..." 
            className="pl-9 h-10 bg-accent/50 border-none rounded-xl text-sm focus-visible:ring-1 focus-visible:ring-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 px-1.5 py-0.5 rounded border border-border bg-background text-[10px] text-muted-foreground">
            <Command className="w-2.5 h-2.5" /> K
          </div>
        </form>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group",
              location.pathname === item.path 
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                : "hover:bg-accent text-muted-foreground hover:text-foreground"
            )}
          >
            <item.icon className={cn(
              "w-5 h-5",
              location.pathname === item.path ? "text-primary-foreground" : "group-hover:scale-110 transition-transform"
            )} />
            <span className="font-medium text-sm">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-border space-y-4">
        <div className="flex items-center justify-between px-4 py-2 bg-accent/50 rounded-xl">
          <span className="text-xs font-medium text-muted-foreground">Tema</span>
          <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="rounded-full h-8 w-8">
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
        </div>

        <div className="flex items-center gap-3 px-4 py-2">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate">{user?.name}</p>
            <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>

        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl h-10"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          <span className="font-medium text-sm">Sair</span>
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
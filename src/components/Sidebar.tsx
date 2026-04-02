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
  Command,
  Bell,
  Menu,
  CheckCheck,
  Activity
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';

const SidebarContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, isDarkMode, toggleDarkMode, user, notifications, markNotificationAsRead } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const unreadCount = notifications.filter(n => !n.read).length;

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Activity, label: 'Status do Sistema', path: '/status' },
    { icon: BookOpen, label: 'Base de Conhecimento', path: '/knowledge' },
    { icon: PlusCircle, label: 'Novo Problema', path: '/new' },
    { icon: User, label: 'Perfil', path: '/profile' },
    { icon: Settings, label: 'Configurações', path: '/settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleMarkAllAsRead = () => {
    notifications.forEach(n => {
      if (!n.read) markNotificationAsRead(n.id);
    });
  };

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/knowledge?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-card">
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-2 rounded-lg">
            <ShieldCheck className="text-primary-foreground w-6 h-6" />
          </div>
          <h1 className="font-bold text-xl tracking-tight">TechSupport</h1>
        </div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative rounded-full h-9 w-9">
              <Bell className="w-5 h-5 text-muted-foreground" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-destructive text-[10px] font-bold text-white rounded-full flex items-center justify-center border-2 border-card">
                  {unreadCount}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0 rounded-2xl shadow-2xl border-border" align="start">
            <div className="p-4 border-b border-border flex items-center justify-between bg-accent/30">
              <h3 className="font-bold text-sm">Notificações</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 text-[10px] gap-1.5 rounded-lg hover:bg-primary/10 hover:text-primary"
                onClick={handleMarkAllAsRead}
                disabled={unreadCount === 0}
              >
                <CheckCheck className="w-3 h-3" /> Marcar todas
              </Button>
            </div>
            <ScrollArea className="h-[300px]">
              <div className="divide-y divide-border">
                {notifications.length > 0 ? notifications.map((n) => (
                  <div 
                    key={n.id} 
                    className={cn(
                      "p-4 hover:bg-accent/50 transition-colors cursor-pointer group relative",
                      !n.read && "bg-primary/5"
                    )}
                    onClick={() => markNotificationAsRead(n.id)}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className={cn(
                        "text-[10px] font-bold uppercase",
                        n.type === 'success' ? "text-emerald-500" : n.type === 'warning' ? "text-amber-500" : "text-blue-500"
                      )}>
                        {n.title}
                      </span>
                      {!n.read && <div className="w-2 h-2 bg-primary rounded-full" />}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed pr-4">{n.description}</p>
                    <p className="text-[9px] text-muted-foreground mt-2">
                      {new Date(n.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                )) : (
                  <div className="p-8 text-center text-sm text-muted-foreground">Nenhuma notificação.</div>
                )}
              </div>
            </ScrollArea>
          </PopoverContent>
        </Popover>
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
    </div>
  );
};

const Sidebar = () => {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  if (isMobile) {
    return (
      <div className="fixed top-4 left-4 z-50">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-xl shadow-lg bg-card">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col h-screen sticky top-0">
      <SidebarContent />
    </aside>
  );
};

export default Sidebar;
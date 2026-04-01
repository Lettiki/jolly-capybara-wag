"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { showError } from '@/utils/toast';

export type Category = 'Rede' | 'Sistema' | 'AD' | 'Email' | 'Hardware' | 'Outros';

export interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface KnowledgeEntry {
  id: string;
  title: string;
  description: string;
  solution: string;
  category: Category;
  tags: string[];
  reporters: string[];
  helpful_count: number;
  comments: Comment[];
  createdAt: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  type: 'info' | 'success' | 'warning';
  read: boolean;
  createdAt: string;
}

interface AppContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  knowledgeBase: KnowledgeEntry[];
  favorites: string[];
  toggleFavorite: (id: string) => void;
  fetchEntries: (params?: { category?: string, search?: string }) => Promise<void>;
  fetchEntryById: (id: string) => Promise<KnowledgeEntry | null>;
  addEntry: (entry: any) => Promise<void>;
  updateEntry: (id: string, entry: any) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  addComment: (entryId: string, content: string) => Promise<void>;
  markAsHelpful: (id: string) => Promise<void>;
  fetchStats: () => Promise<any>;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isLoading: boolean;
  notifications: Notification[];
  markNotificationAsRead: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('support_token'));
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeEntry[]>([]);
  const [favorites, setFavorites] = useState<string[]>(JSON.parse(localStorage.getItem('support_favorites') || '[]'));
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Bem-vindo!',
      description: 'Você acessou a plataforma de suporte técnico.',
      type: 'info',
      read: false,
      createdAt: new Date().toISOString()
    }
  ]);

  useEffect(() => {
    if (token) {
      fetchMe();
    }
  }, [token]);

  useEffect(() => {
    localStorage.setItem('support_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  const fetchMe = async () => {
    try {
      const res = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await res.json();
      if (json.success) setUser(json.data);
      else logout();
    } catch (err) {
      logout();
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const json = await res.json();
      if (json.success) {
        setToken(json.data.token);
        setUser(json.data.user);
        localStorage.setItem('support_token', json.data.token);
      } else {
        throw new Error(json.message);
      }
    } catch (err: any) {
      showError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const json = await res.json();
      if (json.success) {
        setToken(json.data.token);
        setUser(json.data.user);
        localStorage.setItem('support_token', json.data.token);
      } else {
        throw new Error(json.message);
      }
    } catch (err: any) {
      showError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('support_token');
  };

  const fetchEntries = async (params?: { category?: string, search?: string }) => {
    setIsLoading(true);
    try {
      const query = new URLSearchParams(params as any).toString();
      const res = await fetch(`/api/knowledge?${query}`);
      const json = await res.json();
      if (json.success) setKnowledgeBase(json.data);
    } catch (err) {
      showError('Erro ao carregar base de conhecimento');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEntryById = async (id: string) => {
    try {
      const res = await fetch(`/api/knowledge/${id}`);
      const json = await res.json();
      if (json.success) return json.data;
      return null;
    } catch (err) {
      return null;
    }
  };

  const addEntry = async (entry: any) => {
    const res = await fetch('/api/knowledge', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(entry)
    });
    if (res.ok) {
      fetchEntries();
      setNotifications(prev => [{
        id: Date.now().toString(),
        title: 'Novo Registro',
        description: `A solução "${entry.title}" foi adicionada à base.`,
        type: 'success',
        read: false,
        createdAt: new Date().toISOString()
      }, ...prev]);
    }
  };

  const updateEntry = async (id: string, entry: any) => {
    await fetch(`/api/knowledge/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(entry)
    });
    fetchEntries();
  };

  const deleteEntry = async (id: string) => {
    await fetch(`/api/knowledge/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchEntries();
  };

  const addComment = async (entryId: string, content: string) => {
    await fetch(`/api/knowledge/${entryId}/comments`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ content, author: user?.name || 'Técnico' })
    });
  };

  const markAsHelpful = async (id: string) => {
    await fetch(`/api/knowledge/${id}/helpful`, { method: 'PUT' });
  };

  const fetchStats = async () => {
    const res = await fetch('/api/knowledge/stats');
    const json = await res.json();
    return json.data;
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
    );
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <AppContext.Provider value={{ 
      user, token, login, register, logout, knowledgeBase, favorites, toggleFavorite, 
      fetchEntries, fetchEntryById, addEntry, updateEntry, deleteEntry, addComment, markAsHelpful, fetchStats,
      isDarkMode, toggleDarkMode, isLoading, notifications, markNotificationAsRead
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
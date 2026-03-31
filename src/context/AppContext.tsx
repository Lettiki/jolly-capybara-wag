"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

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
  helpfulCount: number;
  comments: Comment[]; // Novo campo para colaboração
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  type: 'info' | 'success' | 'warning';
  read: boolean;
  createdAt: string;
}

export interface User {
  name: string;
  email: string;
}

interface AppContextType {
  user: User | null;
  login: (email: string, name: string) => void;
  logout: () => void;
  knowledgeBase: KnowledgeEntry[];
  favorites: string[];
  notifications: Notification[];
  toggleFavorite: (id: string) => void;
  addEntry: (entry: Omit<KnowledgeEntry, 'id' | 'createdAt' | 'helpfulCount' | 'comments'>) => void;
  updateEntry: (id: string, entry: Partial<KnowledgeEntry>) => void;
  deleteEntry: (id: string) => void;
  markAsHelpful: (id: string) => void;
  addComment: (entryId: string, content: string) => void;
  markNotificationAsRead: (id: string) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const MOCK_DATA: KnowledgeEntry[] = [
  {
    id: '1',
    title: 'Erro de conexão VPN',
    description: 'Usuário não consegue conectar na VPN corporativa apresentando erro 807.',
    solution: 'Verificar se o relógio do sistema está sincronizado e reiniciar o serviço de Isolamento de Chave CNG.',
    category: 'Rede',
    tags: ['vpn', 'conexão', 'remoto'],
    reporters: ['Carlos Oliveira', 'Carlos Oliveira', 'Mariana Santos', 'Carlos Oliveira'],
    helpfulCount: 12,
    comments: [
      { id: 'c1', author: 'Admin', content: 'Funciona também para o erro 800 em alguns casos.', createdAt: new Date().toISOString() }
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Reset de senha AD',
    description: 'Solicitação de desbloqueio de conta e reset de senha no Active Directory.',
    solution: 'Acessar o AD Users and Computers, localizar o usuário, clicar com botão direito > Reset Password e desmarcar "Account is locked".',
    category: 'AD',
    tags: ['senha', 'acesso', 'bloqueio'],
    reporters: ['Ricardo Silva', 'Ana Paula', 'Ricardo Silva'],
    helpfulCount: 45,
    comments: [],
    createdAt: new Date().toISOString(),
  }
];

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n1', title: 'Nova Solução', description: 'Uma nova solução para Outlook foi adicionada.', type: 'success', read: false, createdAt: new Date().toISOString() },
  { id: 'n2', title: 'Manutenção', description: 'O servidor de AD passará por manutenção hoje às 22h.', type: 'warning', read: false, createdAt: new Date().toISOString() }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('support_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeEntry[]>(() => {
    const saved = localStorage.getItem('knowledge_base');
    return saved ? JSON.parse(saved) : MOCK_DATA;
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('support_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('support_notifications');
    return saved ? JSON.parse(saved) : MOCK_NOTIFICATIONS;
  });

  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    localStorage.setItem('knowledge_base', JSON.stringify(knowledgeBase));
  }, [knowledgeBase]);

  useEffect(() => {
    localStorage.setItem('support_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('support_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const login = (email: string, name: string) => {
    const newUser = { email, name };
    setUser(newUser);
    localStorage.setItem('support_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('support_user');
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
    );
  };

  const addEntry = (entry: Omit<KnowledgeEntry, 'id' | 'createdAt' | 'helpfulCount' | 'comments'>) => {
    const newEntry: KnowledgeEntry = {
      ...entry,
      id: Math.random().toString(36).substr(2, 9),
      helpfulCount: 0,
      comments: [],
      createdAt: new Date().toISOString(),
    };
    setKnowledgeBase(prev => [newEntry, ...prev]);
    
    // Adicionar notificação de nova entrada
    const newNotif: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'Novo Registro',
      description: `"${entry.title}" foi adicionado à base.`,
      type: 'info',
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const updateEntry = (id: string, updatedFields: Partial<KnowledgeEntry>) => {
    setKnowledgeBase(prev => prev.map(entry => 
      entry.id === id ? { ...entry, ...updatedFields } : entry
    ));
  };

  const deleteEntry = (id: string) => {
    setKnowledgeBase(prev => prev.filter(entry => entry.id !== id));
    setFavorites(prev => prev.filter(favId => favId !== id));
  };

  const markAsHelpful = (id: string) => {
    setKnowledgeBase(prev => prev.map(entry => 
      entry.id === id ? { ...entry, helpfulCount: entry.helpfulCount + 1 } : entry
    ));
  };

  const addComment = (entryId: string, content: string) => {
    const newComment: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      author: user?.name || 'Técnico',
      content,
      createdAt: new Date().toISOString()
    };
    setKnowledgeBase(prev => prev.map(entry => 
      entry.id === entryId ? { ...entry, comments: [...entry.comments, newComment] } : entry
    ));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <AppContext.Provider value={{ 
      user, login, logout, knowledgeBase, favorites, notifications, toggleFavorite, addEntry, updateEntry, deleteEntry, markAsHelpful, addComment, markNotificationAsRead, isDarkMode, toggleDarkMode 
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
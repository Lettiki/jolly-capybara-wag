"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Category = 'Rede' | 'Sistema' | 'AD' | 'Email' | 'Hardware' | 'Outros';

export interface KnowledgeEntry {
  id: string;
  title: string;
  description: string;
  solution: string;
  category: Category;
  tags: string[];
  createdAt: string;
  upvotes: number;
  downvotes: number;
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
  toggleFavorite: (id: string) => void;
  addEntry: (entry: Omit<KnowledgeEntry, 'id' | 'createdAt' | 'upvotes' | 'downvotes'>) => void;
  updateEntry: (id: string, entry: Partial<KnowledgeEntry>) => void;
  deleteEntry: (id: string) => void;
  voteEntry: (id: string, type: 'up' | 'down') => void;
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
    createdAt: new Date().toISOString(),
    upvotes: 12,
    downvotes: 1,
  },
  {
    id: '2',
    title: 'Reset de senha AD',
    description: 'Solicitação de desbloqueio de conta e reset de senha no Active Directory.',
    solution: 'Acessar o AD Users and Computers, localizar o usuário, clicar com botão direito > Reset Password e desmarcar "Account is locked".',
    category: 'AD',
    tags: ['senha', 'acesso', 'bloqueio'],
    createdAt: new Date().toISOString(),
    upvotes: 45,
    downvotes: 0,
  },
  {
    id: '3',
    title: 'Outlook não abre',
    description: 'O Outlook fica travado na tela de "Processando" ou "Carregando Perfil".',
    solution: 'Executar o comando outlook.exe /safe. Se abrir, desabilitar suplementos de terceiros.',
    category: 'Email',
    tags: ['outlook', 'office', 'email'],
    createdAt: new Date().toISOString(),
    upvotes: 28,
    downvotes: 2,
  }
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

  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    localStorage.setItem('knowledge_base', JSON.stringify(knowledgeBase));
  }, [knowledgeBase]);

  useEffect(() => {
    localStorage.setItem('support_favorites', JSON.stringify(favorites));
  }, [favorites]);

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

  const addEntry = (entry: Omit<KnowledgeEntry, 'id' | 'createdAt' | 'upvotes' | 'downvotes'>) => {
    const newEntry: KnowledgeEntry = {
      ...entry,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      upvotes: 0,
      downvotes: 0,
    };
    setKnowledgeBase(prev => [newEntry, ...prev]);
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

  const voteEntry = (id: string, type: 'up' | 'down') => {
    setKnowledgeBase(prev => prev.map(entry => {
      if (entry.id === id) {
        return {
          ...entry,
          upvotes: type === 'up' ? entry.upvotes + 1 : entry.upvotes,
          downvotes: type === 'down' ? entry.downvotes + 1 : entry.downvotes,
        };
      }
      return entry;
    }));
  };

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <AppContext.Provider value={{ 
      user, login, logout, knowledgeBase, favorites, toggleFavorite, addEntry, updateEntry, deleteEntry, voteEntry, isDarkMode, toggleDarkMode 
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
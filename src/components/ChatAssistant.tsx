"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, ArrowRight, Search, Plus, MessageSquare } from 'lucide-react';
import { useApp, KnowledgeEntry } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  results?: KnowledgeEntry[];
}

const ChatAssistant = () => {
  const { knowledgeBase } = useApp();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Olá! Sou seu assistente técnico. Descreva o problema que você está enfrentando e eu buscarei a melhor solução na nossa base.'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    const query = input.toLowerCase();
    setInput('');
    setIsTyping(true);

    // Simulação de processamento do "bot"
    setTimeout(() => {
      const filtered = knowledgeBase.filter(entry => 
        entry.title.toLowerCase().includes(query) ||
        entry.description.toLowerCase().includes(query) ||
        entry.tags.some(tag => tag.toLowerCase().includes(query))
      );

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: filtered.length > 0 
          ? `Encontrei ${filtered.length} solução(ões) que podem ajudar:` 
          : 'Infelizmente não encontrei uma solução exata na base. Você gostaria de cadastrar esse novo problema?',
        results: filtered
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[600px] bg-card rounded-3xl shadow-2xl border border-border overflow-hidden">
      <div className="p-4 bg-primary text-primary-foreground flex items-center gap-3">
        <div className="p-2 bg-white/20 rounded-xl">
          <Bot className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold">Suporte Inteligente</h3>
          <p className="text-xs opacity-80">Online agora</p>
        </div>
      </div>

      <ScrollArea className="flex-1 p-6">
        <div className="space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={cn(
              "flex gap-3 max-w-[85%]",
              msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
            )}>
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                msg.role === 'assistant' ? "bg-primary/10 text-primary" : "bg-blue-600 text-white"
              )}>
                {msg.role === 'assistant' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
              </div>
              <div className="space-y-3">
                <div className={cn(
                  "p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                  msg.role === 'assistant' 
                    ? "bg-accent text-foreground rounded-tl-none" 
                    : "bg-blue-600 text-white rounded-tr-none"
                )}>
                  {msg.content}
                </div>

                {msg.results && msg.results.length > 0 && (
                  <div className="grid grid-cols-1 gap-3 mt-2">
                    {msg.results.map(entry => (
                      <div 
                        key={entry.id}
                        onClick={() => navigate(`/entry/${entry.id}`)}
                        className="p-3 bg-background border border-border rounded-xl hover:border-primary transition-colors cursor-pointer group"
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-[10px] font-bold uppercase text-primary">{entry.category}</span>
                          <ArrowRight className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1" />
                        </div>
                        <p className="font-bold text-sm line-clamp-1">{entry.title}</p>
                      </div>
                    ))}
                  </div>
                )}

                {msg.role === 'assistant' && !msg.results && msg.content.includes('cadastrar') && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="rounded-xl gap-2"
                    onClick={() => navigate('/new')}
                  >
                    <Plus className="w-4 h-4" /> Cadastrar Solução
                  </Button>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-accent p-4 rounded-2xl rounded-tl-none flex gap-1">
                <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <form onSubmit={handleSend} className="p-4 bg-accent/30 border-t border-border">
        <div className="relative">
          <Input 
            placeholder="Digite sua dúvida técnica..." 
            className="h-12 pr-12 rounded-xl bg-background border-none shadow-inner"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button 
            type="submit" 
            size="icon" 
            className="absolute right-1 top-1 bottom-1 rounded-lg"
            disabled={!input.trim() || isTyping}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatAssistant;
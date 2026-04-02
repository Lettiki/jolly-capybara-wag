"use client";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useApp } from "@/context/AppContext";
import { BookOpen, PlusCircle, LayoutDashboard, Settings, User, Search } from "lucide-react";

const CommandMenu = () => {
  const [open, setOpen] = useState(false);
  const { knowledgeBase } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="O que você está procurando?" />
      <CommandList>
        <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
        <CommandGroup heading="Sugestões">
          <CommandItem onSelect={() => runCommand(() => navigate("/"))}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/knowledge"))}>
            <BookOpen className="mr-2 h-4 w-4" />
            <span>Base de Conhecimento</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/new"))}>
            <PlusCircle className="mr-2 h-4 w-4" />
            <span>Novo Registro</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Soluções Recentes">
          {knowledgeBase.slice(0, 5).map((entry) => (
            <CommandItem
              key={entry.id}
              onSelect={() => runCommand(() => navigate(`/entry/${entry.id}`))}
            >
              <Search className="mr-2 h-4 w-4" />
              <span>{entry.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Configurações">
          <CommandItem onSelect={() => runCommand(() => navigate("/profile"))}>
            <User className="mr-2 h-4 w-4" />
            <span>Perfil</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/settings"))}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Configurações</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

export default CommandMenu;
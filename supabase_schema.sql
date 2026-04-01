-- Tabela de Usuários
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Registros de Conhecimento
CREATE TABLE knowledge_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  solution TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  reporters TEXT[] DEFAULT '{}',
  helpful_count INTEGER DEFAULT 0,
  user_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Comentários/Notas Técnicas
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id UUID REFERENCES knowledge_entries(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Função RPC para estatísticas de categoria
CREATE OR REPLACE FUNCTION get_category_counts()
RETURNS TABLE (name TEXT, value INTEGER) AS $$
BEGIN
  RETURN QUERY
  SELECT category as name, count(*)::integer as value
  FROM knowledge_entries
  GROUP BY category;
END;
$$ LANGUAGE plpgsql;
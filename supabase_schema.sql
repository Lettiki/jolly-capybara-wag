-- Tabela de Usuários
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela da Base de Conhecimento
CREATE TABLE IF NOT EXISTS knowledge_entries (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  solution TEXT NOT NULL,
  category TEXT NOT NULL,
  tags JSONB DEFAULT '[]',
  reporters JSONB DEFAULT '[]',
  helpful_count INTEGER DEFAULT 0,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Comentários
CREATE TABLE IF NOT EXISTS comments (
  id SERIAL PRIMARY KEY,
  entry_id INTEGER REFERENCES knowledge_entries(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Função para estatísticas de categoria
CREATE OR REPLACE FUNCTION get_category_counts()
RETURNS TABLE (name text, value bigint) AS $$
BEGIN
  RETURN QUERY
  SELECT category as name, count(*) as value
  FROM knowledge_entries
  GROUP BY category;
END;
$$ LANGUAGE plpgsql;
const db = require('./db');
const bcrypt = require('bcryptjs');

async function seed() {
  const password = await bcrypt.hash('admin123', 10);
  
  // Criar usuário admin
  const userStmt = db.prepare('INSERT OR IGNORE INTO users (name, email, password) VALUES (?, ?, ?)');
  userStmt.run('Administrador', 'admin@empresa.com', password);
  
  const user = db.prepare('SELECT id FROM users WHERE email = ?').get('admin@empresa.com');

  // Criar entradas de exemplo
  const entries = [
    {
      title: 'Erro de conexão VPN (807)',
      description: 'Usuário não consegue conectar na VPN corporativa.',
      solution: 'Reiniciar o serviço de Isolamento de Chave CNG e verificar sincronia de horário.',
      category: 'Rede',
      tags: JSON.stringify(['vpn', 'rede', 'remoto']),
      reporters: JSON.stringify(['Carlos Oliveira', 'Mariana Santos'])
    },
    {
      title: 'Reset de Senha AD',
      description: 'Procedimento padrão para desbloqueio de conta.',
      solution: 'Acessar AD Users and Computers e resetar a senha marcando a opção de troca no primeiro login.',
      category: 'AD',
      tags: JSON.stringify(['senha', 'acesso', 'ad']),
      reporters: JSON.stringify(['Ricardo Silva'])
    }
  ];

  const entryStmt = db.prepare(`
    INSERT INTO knowledge_entries (title, description, solution, category, tags, reporters, user_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  for (const entry of entries) {
    entryStmt.run(entry.title, entry.description, entry.solution, entry.category, entry.tags, entry.reporters, user.id);
  }

  console.log('Banco de dados populado com sucesso!');
}

seed();
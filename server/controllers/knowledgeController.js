const db = require('../db');

exports.getAll = (req, res) => {
  const { category, search } = req.query;
  let query = 'SELECT * FROM knowledge_entries';
  const params = [];

  if (category || search) {
    query += ' WHERE 1=1';
    if (category && category !== 'Todas') {
      query += ' AND category = ?';
      params.push(category);
    }
    if (search) {
      query += ' AND (title LIKE ? OR description LIKE ? OR tags LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }
  }

  query += ' ORDER BY created_at DESC';
  
  const entries = db.prepare(query).all(...params).map(entry => ({
    ...entry,
    tags: JSON.parse(entry.tags || '[]'),
    reporters: JSON.parse(entry.reporters || '[]')
  }));

  res.json({ success: true, data: entries });
};

exports.getById = (req, res) => {
  const entry = db.prepare('SELECT * FROM knowledge_entries WHERE id = ?').get(req.params.id);
  if (!entry) return res.status(404).json({ success: false, message: 'Não encontrado' });

  const comments = db.prepare('SELECT * FROM comments WHERE entry_id = ? ORDER BY created_at DESC').all(req.params.id);

  res.json({ 
    success: true, 
    data: { 
      ...entry, 
      tags: JSON.parse(entry.tags || '[]'), 
      reporters: JSON.parse(entry.reporters || '[]'),
      comments 
    } 
  });
};

exports.create = (req, res) => {
  const { title, description, solution, category, tags, reporters } = req.body;
  const stmt = db.prepare(`
    INSERT INTO knowledge_entries (title, description, solution, category, tags, reporters, user_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  
  const info = stmt.run(
    title, 
    description, 
    solution, 
    category, 
    JSON.stringify(tags || []), 
    JSON.stringify(reporters || []), 
    req.userId
  );

  res.status(201).json({ success: true, data: { id: info.lastInsertRowid } });
};

exports.update = (req, res) => {
  const { title, description, solution, category, tags, reporters } = req.body;
  const stmt = db.prepare(`
    UPDATE knowledge_entries 
    SET title = ?, description = ?, solution = ?, category = ?, tags = ?, reporters = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);
  
  stmt.run(
    title, 
    description, 
    solution, 
    category, 
    JSON.stringify(tags || []), 
    JSON.stringify(reporters || []), 
    req.params.id
  );

  res.json({ success: true, message: 'Atualizado com sucesso' });
};

exports.delete = (req, res) => {
  db.prepare('DELETE FROM knowledge_entries WHERE id = ?').run(req.params.id);
  res.json({ success: true, message: 'Excluído com sucesso' });
};

exports.addComment = (req, res) => {
  const { content, author } = req.body;
  const stmt = db.prepare('INSERT INTO comments (entry_id, author, content) VALUES (?, ?, ?)');
  const info = stmt.run(req.params.id, author, content);
  res.json({ success: true, data: { id: info.lastInsertRowid } });
};

exports.markHelpful = (req, res) => {
  db.prepare('UPDATE knowledge_entries SET helpful_count = helpful_count + 1 WHERE id = ?').run(req.params.id);
  res.json({ success: true, message: 'Marcado como útil' });
};

exports.getStats = (req, res) => {
  const total = db.prepare('SELECT COUNT(*) as count FROM knowledge_entries').get().count;
  const recent = db.prepare("SELECT COUNT(*) as count FROM knowledge_entries WHERE created_at > datetime('now', '-7 days')").get().count;
  const byCategory = db.prepare('SELECT category as name, COUNT(*) as value FROM knowledge_entries GROUP BY category').all();
  
  res.json({ 
    success: true, 
    data: { total, recent, byCategory } 
  });
};
const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const stmt = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
    const info = stmt.run(name, email, hashedPassword);
    
    const token = jwt.sign({ id: info.lastInsertRowid }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    res.status(201).json({ 
      success: true, 
      data: { token, user: { id: info.lastInsertRowid, name, email } },
      message: 'Usuário criado com sucesso' 
    });
  } catch (err) {
    res.status(400).json({ success: false, message: 'E-mail já cadastrado ou dados inválidos' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ success: false, message: 'Credenciais inválidas' });
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  
  res.json({ 
    success: true, 
    data: { token, user: { id: user.id, name: user.name, email: user.email } } 
  });
};

exports.me = (req, res) => {
  const user = db.prepare('SELECT id, name, email FROM users WHERE id = ?').get(req.userId);
  res.json({ success: true, data: user });
};
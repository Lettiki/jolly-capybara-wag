import { supabase } from '../lib/supabase.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { name, email, password } = req.body;
  
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const { data, error } = await supabase
      .from('users')
      .insert([
        { 
          name, 
          email, 
          password: hashedPassword,
          role: 'gestor', // Sempre gestor por padrão no registro público
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return res.status(400).json({ success: false, message: 'Este e-mail já está em uso.' });
      }
      return res.status(400).json({ success: false, message: error.message });
    }

    const token = jwt.sign(
      { id: data.id, email: data.email, role: data.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );

    return res.status(201).json({ 
      success: true, 
      data: { 
        token, 
        user: { id: data.id, name: data.name, email: data.email, role: data.role } 
      } 
    });

  } catch (err) {
    return res.status(500).json({ success: false, message: 'Erro interno ao processar o cadastro.' });
  }
}
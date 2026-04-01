import { supabase } from '../lib/supabase.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from('users')
    .insert([{ name, email, password: hashedPassword }])
    .select()
    .single();

  if (error) return res.status(400).json({ success: false, message: 'Erro ao criar usuário' });

  const token = jwt.sign({ id: data.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

  res.status(201).json({ 
    success: true, 
    data: { token, user: { id: data.id, name: data.name, email: data.email } } 
  });
}
import { supabase } from '../lib/supabase.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { email, password } = req.body;

  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ success: false, message: 'Credenciais inválidas' });
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

  res.json({ 
    success: true, 
    data: { token, user: { id: user.id, name: user.name, email: user.email } } 
  });
}
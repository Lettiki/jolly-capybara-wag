import { supabase } from '../lib/supabase.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { name, email, password } = req.body;
  console.log(`[Register] Tentativa de registro para: ${email}`);
  
  try {
    // Gerando o hash da senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(`[Register] Hash gerado com sucesso para ${email}`);

    const { data, error } = await supabase
      .from('users')
      .insert([{ name, email, password: hashedPassword }])
      .select()
      .single();

    if (error) {
      console.error(`[Register] Erro no Supabase:`, error);
      if (error.code === '23505') return res.status(400).json({ success: false, message: 'E-mail já cadastrado' });
      throw error;
    }

    console.log(`[Register] Usuário criado com ID: ${data.id}`);

    const token = jwt.sign({ id: data.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({ 
      success: true, 
      data: { token, user: { id: data.id, name: data.name, email: data.email } } 
    });
  } catch (err) {
    console.error(`[Register] Erro interno:`, err);
    res.status(500).json({ success: false, message: 'Erro interno no servidor' });
  }
}
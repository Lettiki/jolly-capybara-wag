import { supabase } from '../lib/supabase.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { email, password } = req.body;
  console.log(`[Login] Tentativa de acesso para: ${email}`);

  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (error) {
      console.error('[Login] Erro ao consultar Supabase:', JSON.stringify(error, null, 2));
      return res.status(500).json({ success: false, message: 'Erro interno no banco de dados' });
    }

    if (!user) {
      console.log(`[Login] Usuário não encontrado: ${email}`);
      return res.status(401).json({ success: false, message: 'E-mail ou senha incorretos' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(`[Login] Senha incorreta para: ${email}`);
      return res.status(401).json({ success: false, message: 'E-mail ou senha incorretos' });
    }

    console.log(`[Login] Sucesso! Gerando token para: ${user.id}`);

    const token = jwt.sign(
      { id: user.id, email: user.email }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );

    res.json({ 
      success: true, 
      data: { 
        token, 
        user: { id: user.id, name: user.name, email: user.email } 
      } 
    });
  } catch (err) {
    console.error('[Login] Erro inesperado:', err);
    res.status(500).json({ success: false, message: 'Erro interno no servidor' });
  }
}
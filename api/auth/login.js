import { supabase } from '../lib/supabase.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { email, password } = req.body;
  console.log(`[Login] Tentativa para: ${email}`);

  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (error) {
      console.error(`[Login] Erro banco:`, error);
      return res.status(500).json({ success: false, message: 'Erro ao consultar banco' });
    }

    if (!user) {
      console.log(`[Login] Usuário não encontrado: ${email}`);
      return res.status(401).json({ success: false, message: 'Credenciais inválidas' });
    }

    console.log(`[Login] Usuário encontrado. Hash no banco: ${user.password}`);
    
    // Comparação explícita
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    
    console.log(`[Login] Resultado da comparação bcrypt: ${isPasswordMatch}`);

    if (!isPasswordMatch) {
      console.log(`[Login] Senha não confere para: ${email}`);
      return res.status(401).json({ success: false, message: 'Credenciais inválidas' });
    }

    console.log(`[Login] Sucesso! Gerando token para: ${email}`);

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ 
      success: true, 
      data: { 
        token, 
        user: { id: user.id, name: user.name, email: user.email } 
      } 
    });
  } catch (err) {
    console.error(`[Login] Erro crítico:`, err);
    res.status(500).json({ success: false, message: 'Erro interno no servidor' });
  }
}
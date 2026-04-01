import { supabase } from '../lib/supabase.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { email, password } = req.body;
  console.log(`[Login] Tentativa de login para: ${email}`);

  try {
    // Busca o usuário pelo email
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle(); // Usando maybeSingle para evitar erro se não encontrar

    if (error) {
      console.error(`[Login] Erro ao buscar usuário no Supabase:`, error);
      return res.status(500).json({ success: false, message: 'Erro ao consultar banco de dados' });
    }

    if (!user) {
      console.log(`[Login] Usuário não encontrado: ${email}`);
      return res.status(401).json({ success: false, message: 'Credenciais inválidas' });
    }

    console.log(`[Login] Usuário encontrado. Comparando senhas...`);

    // Compara a senha fornecida com o hash do banco
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    
    if (!isPasswordMatch) {
      console.log(`[Login] Senha incorreta para o usuário: ${email}`);
      return res.status(401).json({ success: false, message: 'Credenciais inválidas' });
    }

    console.log(`[Login] Login bem-sucedido para: ${email}`);

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ 
      success: true, 
      data: { 
        token, 
        user: { id: user.id, name: user.name, email: user.email } 
      } 
    });
  } catch (err) {
    console.error(`[Login] Erro crítico no processo de login:`, err);
    res.status(500).json({ success: false, message: 'Erro interno no servidor' });
  }
}
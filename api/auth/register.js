import { supabase } from '../lib/supabase.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { name, email, password } = req.body;
  console.log(`[Register] Tentando cadastrar usuário: ${email}`);
  
  try {
    // 1. Gerar Hash da Senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // 2. Inserir no Supabase (Tabela 'users')
    // Certifique-se que a tabela 'users' existe no seu banco de dados
    const { data, error } = await supabase
      .from('users')
      .insert([
        { 
          name, 
          email, 
          password: hashedPassword,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      console.error(`[Register] Erro ao inserir no Supabase:`, error);
      
      // Erro de duplicidade (E-mail já existe)
      if (error.code === '23505') {
        return res.status(400).json({ success: false, message: 'Este e-mail já está em uso.' });
      }
      
      return res.status(400).json({ 
        success: false, 
        message: `Erro no banco de dados: ${error.message}`,
        details: error.details 
      });
    }

    if (!data) {
      console.error(`[Register] Inserção concluída mas nenhum dado foi retornado.`);
      return res.status(500).json({ success: false, message: 'Erro ao confirmar criação do usuário.' });
    }

    console.log(`[Register] Usuário salvo com sucesso! ID: ${data.id}`);

    // 3. Gerar Token JWT
    const token = jwt.sign(
      { id: data.id, email: data.email }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );

    return res.status(201).json({ 
      success: true, 
      message: 'Conta criada com sucesso!',
      data: { 
        token, 
        user: { id: data.id, name: data.name, email: data.email } 
      } 
    });

  } catch (err) {
    console.error(`[Register] Erro Crítico:`, err);
    return res.status(500).json({ 
      success: false, 
      message: 'Erro interno ao processar o cadastro.',
      error: err.message 
    });
  }
}
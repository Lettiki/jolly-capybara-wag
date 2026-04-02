import { supabase } from '../lib/supabase.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const { name, email, password } = req.body;
  console.log(`[Register] Iniciando cadastro para: ${email}`);
  
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    console.log(`[Register] Tentando inserir na tabela 'users'...`);
    
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
      // Log detalhado do erro para depuração no Vercel/Logs
      console.error('[Register] Erro retornado pelo Supabase:', JSON.stringify(error, null, 2));
      
      if (error.code === '23505') {
        return res.status(400).json({ success: false, message: 'Este e-mail já está em uso.' });
      }
      
      return res.status(400).json({ 
        success: false, 
        message: `Erro no banco de dados: ${error.message}`,
        code: error.code
      });
    }

    if (!data) {
      console.error('[Register] Inserção concluída mas nenhum dado retornado.');
      return res.status(500).json({ success: false, message: 'Erro ao confirmar criação do usuário.' });
    }

    console.log(`[Register] Usuário criado com sucesso. ID: ${data.id}`);

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
    console.error('[Register] Erro inesperado no servidor:', err);
    return res.status(500).json({ 
      success: false, 
      message: 'Erro interno ao processar o cadastro.',
      error: err.message 
    });
  }
}
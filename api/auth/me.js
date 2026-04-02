import { supabase } from '../lib/supabase.js';
import { verifyToken } from '../lib/auth.js';

export default async function handler(req, res) {
  const decoded = verifyToken(req);
  if (!decoded) return res.status(401).json({ success: false, message: 'Não autorizado' });

  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, email')
      .eq('id', decoded.id)
      .single();

    if (error) {
      console.error('[AuthMe] Erro ao buscar usuário:', JSON.stringify(error, null, 2));
      return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
    }

    res.json({ success: true, data: user });
  } catch (err) {
    console.error('[AuthMe] Erro inesperado:', err);
    res.status(500).json({ success: false, message: 'Erro interno no servidor' });
  }
}
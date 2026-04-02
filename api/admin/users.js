import { supabase } from '../lib/supabase.js';
import { verifyToken } from '../lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });

  const decoded = verifyToken(req);
  if (!decoded || decoded.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Acesso negado. Apenas administradores.' });
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, role, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erro ao buscar usuários' });
  }
}
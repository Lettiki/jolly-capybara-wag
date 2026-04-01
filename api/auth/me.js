import { supabase } from '../lib/supabase.js';
import { verifyToken } from '../lib/auth.js';

export default async function handler(req, res) {
  const decoded = verifyToken(req);
  if (!decoded) return res.status(401).json({ success: false, message: 'Não autorizado' });

  const { data: user, error } = await supabase
    .from('users')
    .select('id, name, email')
    .eq('id', decoded.id)
    .single();

  if (error) return res.status(404).json({ success: false, message: 'Usuário não encontrado' });

  res.json({ success: true, data: user });
}
import { supabase } from '../../lib/supabase.js';
import { verifyToken } from '../../lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'PUT') return res.status(405).json({ message: 'Method not allowed' });

  const { id } = req.query;
  const { role } = req.body;

  const decoded = verifyToken(req);
  if (!decoded || decoded.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Acesso negado. Apenas administradores.' });
  }

  if (!['admin', 'gestor'].includes(role)) {
    return res.status(400).json({ success: false, message: 'Role inválido' });
  }

  try {
    const { error } = await supabase
      .from('users')
      .update({ role })
      .eq('id', id);

    if (error) throw error;
    res.json({ success: true, message: 'Role atualizado com sucesso' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erro ao atualizar role' });
  }
}
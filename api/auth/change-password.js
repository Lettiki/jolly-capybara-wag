import { supabase } from '../lib/supabase.js';
import { verifyToken } from '../lib/auth.js';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'PUT') return res.status(405).json({ message: 'Method not allowed' });

  const decoded = verifyToken(req);
  if (!decoded) return res.status(401).json({ success: false, message: 'Não autorizado' });

  const { currentPassword, newPassword } = req.body;

  const { data: user, error: fetchError } = await supabase
    .from('users')
    .select('*')
    .eq('id', decoded.id)
    .single();

  if (fetchError || !user || !(await bcrypt.compare(currentPassword, user.password))) {
    return res.status(401).json({ success: false, message: 'Senha atual incorreta' });
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, 10);

  const { error: updateError } = await supabase
    .from('users')
    .update({ password: hashedNewPassword })
    .eq('id', decoded.id);

  if (updateError) return res.status(400).json({ success: false, message: 'Erro ao atualizar senha' });

  res.json({ success: true, message: 'Senha alterada com sucesso' });
}
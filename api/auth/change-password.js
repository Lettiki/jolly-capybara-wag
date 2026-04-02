import { supabase } from '../lib/supabase.js';
import { verifyToken } from '../lib/auth.js';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'PUT') return res.status(405).json({ message: 'Method not allowed' });

  const decoded = verifyToken(req);
  if (!decoded) return res.status(401).json({ success: false, message: 'Não autorizado' });

  const { currentPassword, newPassword } = req.body;

  try {
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', decoded.id)
      .single();

    if (fetchError || !user) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Senha atual incorreta' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    const { error: updateError } = await supabase
      .from('users')
      .update({ password: hashedNewPassword })
      .eq('id', decoded.id);

    if (updateError) throw updateError;

    res.json({ success: true, message: 'Senha alterada com sucesso' });
  } catch (err) {
    console.error(`[ChangePassword] Erro:`, err);
    res.status(500).json({ success: false, message: 'Erro ao processar alteração' });
  }
}
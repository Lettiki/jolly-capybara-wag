import { supabase } from '../lib/supabase.js';
import { verifyToken } from '../lib/auth.js';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    const { data: entry, error } = await supabase
      .from('knowledge_entries')
      .select('*, comments(*)')
      .eq('id', id)
      .single();

    if (error) return res.status(404).json({ success: false, message: 'Não encontrado' });
    res.json({ success: true, data: entry });
  }

  if (req.method === 'PUT') {
    const decoded = verifyToken(req);
    if (!decoded) return res.status(401).json({ success: false, message: 'Não autorizado' });

    const { title, description, solution, category, tags, reporters } = req.body;
    const { error } = await supabase
      .from('knowledge_entries')
      .update({ title, description, solution, category, tags, reporters, updated_at: new Date() })
      .eq('id', id);

    if (error) return res.status(400).json({ success: false, message: error.message });
    res.json({ success: true, message: 'Atualizado com sucesso' });
  }

  if (req.method === 'DELETE') {
    const decoded = verifyToken(req);
    if (!decoded) return res.status(401).json({ success: false, message: 'Não autorizado' });

    const { error } = await supabase.from('knowledge_entries').delete().eq('id', id);
    if (error) return res.status(400).json({ success: false, message: error.message });
    res.json({ success: true, message: 'Excluído com sucesso' });
  }
}
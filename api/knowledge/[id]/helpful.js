import { supabase } from '../../lib/supabase.js';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method !== 'PUT') return res.status(405).json({ message: 'Method not allowed' });

  // No Supabase, para incrementar um valor de forma atômica, usamos rpc ou um select seguido de update.
  // Aqui faremos um select + update simples para manter a compatibilidade.
  const { data: entry, error: fetchError } = await supabase
    .from('knowledge_entries')
    .select('helpful_count')
    .eq('id', id)
    .single();

  if (fetchError) return res.status(404).json({ success: false, message: 'Registro não encontrado' });

  const { error: updateError } = await supabase
    .from('knowledge_entries')
    .update({ helpful_count: (entry.helpful_count || 0) + 1 })
    .eq('id', id);

  if (updateError) return res.status(400).json({ success: false, message: updateError.message });

  res.json({ success: true, message: 'Feedback registrado' });
}
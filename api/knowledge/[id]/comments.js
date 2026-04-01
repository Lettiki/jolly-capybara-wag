import { supabase } from '../../lib/supabase.js';
import { verifyToken } from '../../lib/auth.js';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const decoded = verifyToken(req);
  if (!decoded) return res.status(401).json({ success: false, message: 'Não autorizado' });

  const { content, author } = req.body;

  const { data, error } = await supabase
    .from('comments')
    .insert([{ entry_id: id, content, author }])
    .select()
    .single();

  if (error) return res.status(400).json({ success: false, message: error.message });

  res.status(201).json({ success: true, data });
}
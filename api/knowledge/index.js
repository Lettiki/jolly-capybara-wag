import { supabase } from '../lib/supabase.js';
import { verifyToken } from '../lib/auth.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { category, search } = req.query;
    
    // Iniciamos a query básica
    let query = supabase
      .from('knowledge_entries')
      .select('*')
      .order('created_at', { ascending: false });

    // Filtro de Categoria: Só aplica se for uma categoria válida e diferente de 'Todas' ou 'undefined'
    if (category && category !== 'Todas' && category !== 'undefined' && category !== '') {
      query = query.eq('category', category);
    }

    // Filtro de Busca: Só aplica se houver texto real para buscar
    if (search && search.trim() !== '' && search !== 'undefined') {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data, error } = await query;
    
    if (error) {
      console.error('[API Knowledge] Erro na busca:', error);
      return res.status(500).json({ success: false, message: error.message });
    }

    return res.json({ success: true, data: data || [] });
  } 
  
  if (req.method === 'POST') {
    const decoded = verifyToken(req);
    if (!decoded) return res.status(401).json({ success: false, message: 'Não autorizado' });

    const { title, description, solution, category, tags, reporters } = req.body;
    const { data, error } = await supabase
      .from('knowledge_entries')
      .insert([{ 
        title, 
        description, 
        solution, 
        category, 
        tags: tags || [], 
        reporters: reporters || [], 
        user_id: decoded.id 
      }])
      .select()
      .single();

    if (error) return res.status(400).json({ success: false, message: error.message });
    res.status(201).json({ success: true, data });
  }
}
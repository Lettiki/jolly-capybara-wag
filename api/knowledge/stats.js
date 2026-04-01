import { supabase } from '../lib/supabase.js';

export default async function handler(req, res) {
  try {
    const { count: total } = await supabase.from('knowledge_entries').select('*', { count: 'exact', head: true });
    
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const { count: recent } = await supabase
      .from('knowledge_entries')
      .select('*', { count: 'exact', head: true })
      .gt('created_at', lastWeek.toISOString());

    // Tenta usar a função RPC, se falhar faz o agrupamento manual
    const { data: rpcData, error: rpcError } = await supabase.rpc('get_category_counts');
    
    let byCategory = [];
    if (!rpcError && rpcData) {
      byCategory = rpcData;
    } else {
      const { data: allEntries } = await supabase.from('knowledge_entries').select('category');
      const counts = (allEntries || []).reduce((acc, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + 1;
        return acc;
      }, {});
      byCategory = Object.entries(counts).map(([name, value]) => ({ name, value }));
    }

    res.json({ success: true, data: { total: total || 0, recent: recent || 0, byCategory } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Erro ao buscar estatísticas' });
  }
}
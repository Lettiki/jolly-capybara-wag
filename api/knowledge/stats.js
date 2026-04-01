import { supabase } from '../lib/supabase.js';

export default async function handler(req, res) {
  const { count: total } = await supabase.from('knowledge_entries').select('*', { count: 'exact', head: true });
  
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);
  const { count: recent } = await supabase
    .from('knowledge_entries')
    .select('*', { count: 'exact', head: true })
    .gt('created_at', lastWeek.toISOString());

  const { data: categories } = await supabase.rpc('get_category_counts'); 
  // Nota: Se não quiser usar RPC, pode fazer um select e agrupar no JS
  const { data: allEntries } = await supabase.from('knowledge_entries').select('category');
  const counts = allEntries.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + 1;
    return acc;
  }, {});
  
  const byCategory = Object.entries(counts).map(([name, value]) => ({ name, value }));

  res.json({ success: true, data: { total, recent, byCategory } });
}
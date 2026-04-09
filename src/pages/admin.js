import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Admin() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const { data } = await supabase.from('testing_responses').select('*').order('created_at', { ascending: false });
    setResults(data || []);
  }

  const exportCSV = () => {
    const headers = "Name,Rating,Feedback,ImageURL\n";
    const rows = results.map(r => `${r.name},${r.rating},${r.feedback},${r.image_url}`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Gully_Bowls_Testing.csv';
    a.click();
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-black text-gully-teal">ADMIN HUB</h1>
        <button onClick={exportCSV} className="bg-black text-white px-8 py-3 rounded-full font-bold shadow-lg">
          DOWNLOAD DATA (EXCEL)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {results.map((item) => (
          <div key={item.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-200">
            {item.image_url && <img src={item.image_url} className="w-full h-56 object-cover" />}
            <div className="p-6">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-xl">{item.name}</span>
                <span className="bg-gully-red text-white px-3 py-1 rounded-full text-xs font-bold">★ {item.rating}</span>
              </div>
              <p className="text-gray-500 italic">{item.feedback}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

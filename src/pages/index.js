import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', rating: 5, feedback: '' });
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let imageUrl = '';

    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `testing/${fileName}`;

      let { error: uploadError } = await supabase.storage
        .from('bowl-images') // Make sure you created this bucket in Supabase!
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('bowl-images').getPublicUrl(filePath);
      imageUrl = data.publicUrl;
    }

    const { error } = await supabase
      .from('testing_responses')
      .insert([{ ...formData, image_url: imageUrl }]);

    if (!error) {
      alert("Feedback submitted successfully!");
      setFormData({ name: '', rating: 5, feedback: '' });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-gully-red p-6 flex justify-center">
           <h1 className="text-white font-bold text-2xl uppercase tracking-widest">Gully Bowls</h1>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Tester Name</label>
            <input type="text" className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-gully-teal outline-none transition" 
              onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">How was the taste? (1-10)</label>
            <input type="range" min="1" max="10" className="w-full accent-gully-teal" 
              onChange={(e) => setFormData({...formData, rating: e.target.value})} />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Feedback</label>
            <textarea className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-gully-teal outline-none transition" rows="3"
              onChange={(e) => setFormData({...formData, feedback: e.target.value})}></textarea>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Upload Photo</label>
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="text-xs" />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-gully-red text-white py-4 rounded-2xl font-black text-lg shadow-lg hover:scale-[1.02] active:scale-95 transition-all">
            {loading ? "SENDING..." : "SUBMIT REVIEW"}
          </button>
        </form>
      </div>
    </div>
  );
}

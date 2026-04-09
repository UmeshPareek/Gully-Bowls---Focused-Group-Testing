import { useState } from 'react';
import { db, storage } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', rating: 5, feedback: '' });
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let imageUrl = "";

    if (image) {
      const storageRef = ref(storage, `testing/${Date.now()}_${image.name}`);
      await uploadBytes(storageRef, image);
      imageUrl = await getDownloadURL(storageRef);
    }

    await addDoc(collection(db, "focus_group_data"), {
      ...formData,
      imageUrl,
      date: new Date().toISOString()
    });

    alert("Data Submitted Successfully!");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gully-bg flex flex-col items-center p-6">
      <img src="/logo.png" alt="Gully Bowls" className="w-40 mb-8" />
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-gully-red text-center">Focus Group Testing</h2>
        <input type="text" placeholder="Your Name" className="w-full border p-3 rounded-lg" 
          onChange={(e) => setFormData({...formData, name: e.target.value})} required />
        
        <label className="block text-sm font-medium">Rate the Item (1-10)</label>
        <input type="range" min="1" max="10" className="w-full accent-gully-teal" 
          onChange={(e) => setFormData({...formData, rating: e.target.value})} />
        
        <textarea placeholder="Your Feedback" className="w-full border p-3 rounded-lg"
          onChange={(e) => setFormData({...formData, feedback: e.target.value})}></textarea>
        
        <input type="file" onChange={(e) => setImage(e.target.files[0])} className="text-sm" />
        
        <button type="submit" disabled={loading} className="w-full bg-gully-red text-white py-3 rounded-xl font-bold hover:opacity-90 transition">
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
}

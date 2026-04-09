import { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

export default function AdminDashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const q = query(collection(db, "focus_group_data"), orderBy("date", "desc"));
      const querySnapshot = await getDocs(q);
      setData(querySnapshot.docs.map(doc => doc.data()));
    };
    fetchData();
  }, []);

  const exportToCSV = () => {
    const csvRows = [["Name", "Rating", "Feedback", "Date", "ImageURL"]];
    data.forEach(item => {
      csvRows.push([item.name, item.rating, item.feedback, item.date, item.imageUrl]);
    });
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.map(e => e.join(",")).join("\n");
    window.open(encodeURI(csvContent));
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gully-teal">Admin Control Center</h1>
        <button onClick={exportToCSV} className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold">
          Export to Excel (CSV)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.map((item, idx) => (
          <div key={idx} className="bg-white p-4 rounded-xl shadow border-t-4 border-gully-red">
            {item.imageUrl && <img src={item.imageUrl} className="w-full h-48 object-cover rounded-lg mb-4" />}
            <h3 className="font-bold text-lg">{item.name}</h3>
            <p className="text-gully-red font-semibold">Rating: {item.rating}/10</p>
            <p className="text-gray-600 italic mt-2">"{item.feedback}"</p>
            <p className="text-xs text-gray-400 mt-4">{new Date(item.date).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

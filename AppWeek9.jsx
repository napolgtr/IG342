import React, { useState } from 'react';
import { db } from './db';
import { useLiveQuery } from 'dexie-react-hooks';

function App() {
  //ตัวแปรเก็บชื่อ
  const [name, setName] = useState('');
  //ตัวแปรเก็บจำนวน
  const [quantity, setQuantity] = useState(0);
  //บอกระบบว่าจะใช้ตัวนี้ในการเก็บข้อมูลนะ
  const items = useLiveQuery(() => db.items.toArray());

  //คำสั่งในการเพิ่มสินค้า
  const addItem = async (e) => {
    e.preventDefault();
    await db.items.add({ name, quantity: Number(quantity) });
    setName('');
    setQuantity(0);
  };
  //คำสั่งในการลบสินค้า
  const deleteItem = async (id) => {
    await db.items.delete(id);
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-blue-600">Inventory (IndexedDB)</h1>

      <form onSubmit={addItem} className="space-y-3 mb-8 bg-gray-50 p-4 rounded-lg shadow">
        <input
          type="text" placeholder="ชื่อสินค้า"
          className="w-full p-2 border rounded"
          value={name} onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number" placeholder="จำนวน"
          className="w-full p-2 border rounded"
          value={quantity} onChange={(e) => setQuantity(e.target.value)}
        />
        <button className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          บันทึกลง Browser
        </button>
      </form>

      <ul className="space-y-2">
        {items?.map(item => (
          <li key={item.id} className="flex justify-between items-center bg-white border p-3 rounded shadow-sm">
            <span>{item.name} ({item.quantity})</span>
            <button
              onClick={() => deleteItem(item.id)}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              ลบ
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
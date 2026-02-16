import { useState } from "react";

export default function Home()
{
  const [count, setCount] = useState(0);

  return (
    <div className="p-4 text-center">
      <h1 className="mb-4 text-2xl">
        จำนวน : {count}
      </h1>
      <button
        onClick={() => setCount(count + 1)}
        className="px-4 text-white bg-green-600">
        เพิ่ม
      </button>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { auth, googleProvider, db, signInWithPopup, signOut, onAuthStateChanged, doc, setDoc, getDoc } from "./firebase";

export default function App() {
  const [user, setUser] = useState(null);
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. ตรวจสอบสถานะการ Login
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await syncAndFetchTasks(currentUser);
      } else {
        setUser(null);
        setTasks([]); // ล้าง Task เมื่อ Logout
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Logic การซิงค์ Local Storage และดึงข้อมูลจาก Firebase
  const syncAndFetchTasks = async (currentUser) => {
    const localData = JSON.parse(localStorage.getItem("tasks") || "[]");
    const docRef = doc(db, "userTasks", currentUser.uid);
    const docSnap = await getDoc(docRef);

    if (localData.length > 0) {
      // ถ้าในเครื่องมีข้อมูล ให้เอาขึ้น Cloud (Merge หรือ Overwrite ตามสะดวก)
      await setDoc(docRef, { tasks: localData }, { merge: true });
      setTasks(localData);
      localStorage.removeItem("tasks"); // ย้ายขึ้น Cloud แล้วลบในเครื่อง
    } else if (docSnap.exists()) {
      // ถ้าในเครื่องไม่มี แต่ใน Cloud มี ให้ดึงลงมา
      setTasks(docSnap.data().tasks);
    }
  };

  // 3. ฟังก์ชันบันทึกข้อมูลไป Firebase ทุกครั้งที่ tasks เปลี่ยนแปลง
  const saveToFirebase = async (newTasks) => {
    if (user) {
      await setDoc(doc(db, "userTasks", user.uid), { tasks: newTasks });
    }
  };

  const addTask = async () => {
    if (task.trim() === "") return;
    const newTasks = [...tasks, { text: task, done: false }];
    setTasks(newTasks);
    setTask("");
    await saveToFirebase(newTasks);
  };

  const toggleTask = async (index) => {
    const newTasks = [...tasks];
    newTasks[index].done = !newTasks[index].done;
    setTasks(newTasks);
    await saveToFirebase(newTasks);
  };

  const handleLogin = () => signInWithPopup(auth, googleProvider);
  const handleLogout = () => signOut(auth);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  // --- ถ้ายังไม่ Login ให้แสดงหน้า Login ---
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
          <h2 className="text-2xl font-bold mb-4">ยินดีต้อนรับสู่ My Task</h2>
          <p className="mb-6 text-gray-600">กรุณาเข้าสู่ระบบเพื่อจัดการรายการของคุณ</p>
          <button 
            onClick={handleLogin}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition shadow-md"
          >
            Login with Google
          </button>
        </div>
      </div>
    );
  }

  // --- ถ้า Login แล้วแสดงหน้า My Task ---
  return (
    <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md relative">
        <button onClick={handleLogout} className="absolute top-4 right-4 text-xs text-red-500 hover:underline">Logout</button>
        
        <h1 className="text-2xl font-bold text-center mb-1">สิ่งที่ต้องทำวันนี้</h1>
        <p className="text-center text-sm text-gray-500 mb-4 italic">สวัสดีคุณ {user.displayName}</p>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="ระบุเรื่องที่จะทำ..."
            value={task}
            onChange={(e) => setTask(e.target.value)}
            className="flex-1 p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600" onClick={addTask}>
            เพิ่ม
          </button>
        </div>

        <ul className="space-y-2">
          {tasks.map((t, index) => (
            <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-xl shadow-sm">
              <span onClick={() => toggleTask(index)} className={`cursor-pointer flex-1 ${t.done ? "line-through text-gray-400" : ""}`}>
                {t.text}
              </span>
              <button onClick={() => toggleTask(index)} className={`px-3 py-1 text-sm rounded-xl ${t.done ? "bg-green-400 text-white" : "bg-gray-200"}`}>
                {t.done ? "Done" : "Mark"}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
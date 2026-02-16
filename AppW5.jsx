
import { Link, Route, Routes} from "react-router-dom";
import Home from "./Home.jsx";
import Page1 from "./Page1.jsx";
import Page2 from "./Page2.jsx";
export default function App() {

  return (
    <div className="flex flex-col min-h-screen font-sans text-gray-800 bg-gray-50">

      <header className="px-4 py-6 bg-white border-b border-gray-200 sm:px-8">
        <div className="flex items-center justify-between mx-auto max-w-7xl">
          <h1 className="text-2xl font-bold tracking-tight text-indigo-600">
            IG342 Template
          </h1>
          <nav className="hidden space-x-8 text-sm font-medium text-gray-600 md:flex">
            <Link to="/" className="transition hover:text-indigo-500">Home</Link>
            <Link to="/page1" className="transition hover:text-indigo-500">Features</Link>
            <Link to="/page2" className="transition hover:text-indigo-500">About</Link>
          </nav>
        </div>
      </header>

      <main className="flex items-center justify-center flex-grow p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/page1" element={<Page1 />} />
          <Route path="/page2" element={<Page2 />} />
        </Routes>
      </main>

      <footer className="py-8 bg-white border-t border-gray-200">
        <div className="px-4 mx-auto text-center max-w-7xl">
          <p className="text-sm tracking-widest text-gray-400 uppercase">
            Copyright 2026 DPU
          </p>
        </div>
      </footer>

    </div>
  )
}
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="text-gray-700">
      <BrowserRouter>
        <Navbar />
        <div className="bg-gradient-to-br from-teal-50 to-white min-h-screen md:px-30 px-3 py-5">
          <Routes>
            <Route 
              path="/"
              element={<Home />}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App

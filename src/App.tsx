import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from "./pages/LandingPage";
import About from "./pages/About";
import Login from "./pages/Login";

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
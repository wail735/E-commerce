import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Loader from "./components/Loader";

import { Toaster } from 'react-hot-toast';

function App() {
  const [loading, setLoading] = useState(true);

  const handleLoaderComplete = () => {
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B1120] text-gray-900 dark:text-white transition-colors duration-300 relative overflow-x-hidden">
      <Toaster position="top-right" />
      {loading && <Loader onComplete={handleLoaderComplete} />}
      
      {/* Animation d'apparition de la page (Fade-in + Slide-up) */}
      <div 
        className={`transition-all duration-1000 ease-out transform ${
          loading ? "opacity-0 translate-y-10 scale-95" : "opacity-100 translate-y-0 scale-100"
        }`}
      >
        <Router>
          <AppRoutes />
        </Router>
      </div>
    </div>
  );
}

export default App;

import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Loader from "./components/Loader";

function App() {
  const [loading, setLoading] = useState(() => {
    const seen = sessionStorage.getItem('moexpress_loaded');
    return !seen;
  });

  const handleLoaderComplete = () => {
    sessionStorage.setItem('moexpress_loaded', 'true');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B1120] text-gray-900 dark:text-white transition-colors duration-300">
      {loading && <Loader onComplete={handleLoaderComplete} />}
      <Router>
        <AppRoutes />
      </Router>
    </div>
  );
}

export default App;

import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import AllProducts from "./pages/AllProducts";
import Cart from "./pages/Cart";
import NotFound from "./pages/NotFound";
import CategoryPage from "./pages/CategoryPage";

function App() {
  return (
    <div className="bg-white dark:bg-gray-900 dark:text-white duration-200 min-h-screen flex flex-col">
      <Navbar />
      <div className="grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<AllProducts />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/category/:categoryName" element={<CategoryPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;

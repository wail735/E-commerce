import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Products from "../pages/Products";
import Profile from "../pages/Profile";
import NotFound from "../pages/NotFound";
import Cart from "../pages/Cart";
import CategoryPage from "../pages/CategoryPage";
import ProductDetails from "../pages/ProductDetails";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Checkout from "../pages/Checkout";
import SearchResults from '../pages/SearchResults';
import FlashDeals from '../pages/FlashDeals';
import Wishlist from '../pages/Wishlist';

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="products" element={<Products />} />
                <Route path="category/:slug" element={<CategoryPage />} />
                <Route path="product/:slug" element={<ProductDetails />} />
                <Route path="cart" element={<Cart />} />
                <Route path="checkout" element={<Checkout />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="profile" element={<Profile />} />
                <Route path="wishlist" element={<Wishlist />} />
                <Route path="search" element={<SearchResults />} />
                <Route path="flash-deals" element={<FlashDeals />} />
                <Route path="*" element={<NotFound />} />
                
            </Route>
        </Routes>
    )
}

export default AppRoutes

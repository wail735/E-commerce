import { Routes, Route, Navigate, useParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import SellerCenterLayout from "../layouts/SellerCenterLayout";
import Home from "../pages/Home";
import Products from "../pages/Products";
import ProfileLayout from "../layouts/ProfileLayout";
import Profile from "../pages/Profile";
import MyOrders from "../pages/profile/MyOrders";
import MyAds from "../pages/MyAds";
import DashboardPlaceholder from "../pages/profile/DashboardPlaceholder";
import Settings from "../pages/profile/Settings";
import Addresses from "../pages/profile/Addresses";
import PaymentMethods from "../pages/profile/PaymentMethods";
import NotFound from "../pages/NotFound";
import Cart from "../pages/Cart";
import CategoryPage from "../pages/CategoryPage";
import ProductDetails from "../pages/ProductDetails";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Checkout from "../pages/Checkout";
import PaymentSuccess from '../pages/PaymentSuccess';
import PaymentCancel from '../pages/PaymentCancel';
import SearchResults from '../pages/SearchResults';
import FlashDeals from '../pages/FlashDeals';
import SupportPage from '../pages/profile/SupportPage';
import Wishlist from '../pages/Wishlist';
import VerifyOtp from '../pages/VerifyOtp';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import ContactUs from '../pages/ContactUs';
import MyWallet from '../pages/profile/MyWallet.jsx';
import MySubscription from '../pages/profile/MySubscription.jsx';
import SellerOnboarding from '../pages/SellerOnboarding';
import Messenger from '../components/Messenger';
import SellerStorePage from '../pages/SellerStorePage';
import StaticPage from '../pages/StaticPage';

// Seller Center pages
import SellerDashboardPage from '../pages/seller/SellerDashboardPage';
import SellerProductsPage from '../pages/seller/SellerProductsPage';
import SellerOrdersPage from '../pages/seller/SellerOrdersPage';
import SellerDisputesPage from '../pages/seller/SellerDisputesPage';
import SellerMarketingPage from '../pages/seller/SellerMarketingPage';
import SellerPlaceholderPage from '../pages/seller/SellerPlaceholderPage';
import SellerReportsPage from '../pages/seller/SellerReportsPage';
import SellerShippingPage from '../pages/seller/SellerShippingPage';

// Admin Panel pages
import AdminLayout from '../layouts/AdminLayout';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminProShops from '../pages/admin/AdminProShops';
import AdminDisputes from '../pages/admin/AdminDisputes';
import AdminSupport from '../pages/admin/AdminSupport';
import AdminContact from '../pages/admin/AdminContact';
import AdminNewsletter from '../pages/admin/AdminNewsletter';
import AdminAds from '../pages/admin/AdminAds';
import MyDisputes from '../pages/profile/MyDisputes';
import AdminSettings from '../pages/admin/AdminSettings';

// Legacy Chat Redirect
function LegacyChatRedirect() {
    const { roomId } = useParams();
    return <Navigate to={`/profile/messages?room=${roomId}`} replace />;
}

function AppRoutes() {
    return (
        <Routes>
            {/* Main Shop Routes */}
            <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="products" element={<Products />} />
                <Route path="category/:slug" element={<CategoryPage />} />
                <Route path="product/:slug" element={<ProductDetails />} />
                <Route path="store/:id" element={<SellerStorePage />} />
                <Route path="contact" element={<ContactUs />} />
                <Route path="cart" element={<Cart />} />
                <Route path="checkout" element={<Checkout />} />
                <Route path="payment/success" element={<PaymentSuccess />} />
                <Route path="payment/cancel" element={<PaymentCancel />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="verify-otp" element={<VerifyOtp />} />
                <Route path="forgot-password" element={<ForgotPassword />} />
                <Route path="reset-password" element={<ResetPassword />} />
                <Route path="wishlist" element={<Wishlist />} />
                <Route path="search" element={<SearchResults />} />
                <Route path="flash-deals" element={<FlashDeals />} />
                <Route path="my-ads" element={<MyAds />} />

                {/* Static / Informational Pages */}
                <Route path="help" element={<StaticPage pageKey="help" />} />
                <Route path="returns" element={<StaticPage pageKey="returns" />} />
                <Route path="about" element={<StaticPage pageKey="about" />} />
                <Route path="careers" element={<StaticPage pageKey="careers" />} />
                <Route path="press" element={<StaticPage pageKey="press" />} />
                <Route path="affiliate" element={<StaticPage pageKey="affiliate" />} />
                <Route path="terms" element={<StaticPage pageKey="terms" />} />
                <Route path="privacy" element={<StaticPage pageKey="privacy" />} />
                <Route path="cookies" element={<StaticPage pageKey="cookies" />} />
                <Route path="ip" element={<StaticPage pageKey="ip" />} />

                <Route path="*" element={<NotFound />} />
            </Route>

            {/* Profile Dashboard Layout */}
            <Route path="/profile" element={<ProfileLayout />}>
                <Route index element={<MyOrders />} />
                <Route path="orders" element={<MyOrders />} />
                <Route path="disputes" element={<MyDisputes />} />
                <Route path="dashboard" element={<DashboardPlaceholder title="Dashboard" />} />
                <Route path="messages" element={<Messenger />} />
                <Route path="wishlist" element={<Wishlist />} />
                <Route path="addresses" element={<Addresses />} />
                <Route path="payments" element={<PaymentMethods />} />
                <Route path="support" element={<SupportPage />} />
                <Route path="wallet" element={<MyWallet />} />
                <Route path="subscription" element={<MySubscription />} />
                <Route path="settings" element={<Settings />} />
            </Route>

            {/* Seller Onboarding (standalone, no sidebar) */}
            <Route path="/seller/onboarding" element={<SellerOnboarding />} />

            {/* Seller Center (with dedicated sidebar layout) */}
            <Route path="/seller" element={<SellerCenterLayout />}>
                <Route path="dashboard" element={<SellerDashboardPage />} />
                <Route path="products" element={<SellerProductsPage />} />
                <Route path="products/new" element={<SellerProductsPage />} />
                <Route path="orders" element={<SellerOrdersPage />} />
                <Route path="sales" element={<SellerPlaceholderPage title="Sales Analytics" />} />
                <Route path="disputes" element={<SellerDisputesPage />} />
                <Route path="messages" element={<Messenger />} />
                <Route path="store" element={<SellerPlaceholderPage title="seller_store" />} />
                <Route path="marketing" element={<SellerMarketingPage />} />
                <Route path="reports" element={<SellerReportsPage />} />
                <Route path="shipping" element={<SellerShippingPage />} />
                <Route path="support" element={<SupportPage />} />
                <Route path="wallet" element={<MyWallet />} />
                <Route path="subscription" element={<MySubscription />} />
                <Route path="settings" element={<SellerPlaceholderPage title="seller_settings" />} />
            </Route>

            {/* Redirect Legacy Chat Links */}
            <Route path="/chat/room/:roomId" element={<LegacyChatRedirect />} />

            {/* Admin Panel */}
            <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="pro-shops" element={<AdminProShops />} />
                <Route path="disputes" element={<AdminDisputes />} />
                <Route path="support" element={<AdminSupport />} />
                <Route path="contact" element={<AdminContact />} />
                <Route path="newsletter" element={<AdminNewsletter />} />
                <Route path="ads" element={<AdminAds />} />
                <Route path="settings" element={<AdminSettings />} />
            </Route>
        </Routes>
    )
}

export default AppRoutes

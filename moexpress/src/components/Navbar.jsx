import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, User, ShoppingCart, Package, MapPin, Menu, X, ChevronRight, Heart, Moon, Sun, Globe, Store, Shield } from "lucide-react";
import logo from "../assets/logos/logo.png";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import NotificationBell from './NotificationBell';
import { useNavigate } from "react-router-dom";
import logoF from "../assets/logos/logof.png";
function Navbar() {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { cartCount } = useCart();
    const { wishlistCount } = useWishlist();
    const { theme, toggleTheme } = useTheme();
    const { language, changeLanguage, t } = useLanguage();
    const { user, logout } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const [viewedCart, setViewedCart] = useState(Number(localStorage.getItem('moexpress_viewedCart')) || 0);
    const [viewedWishlist, setViewedWishlist] = useState(Number(localStorage.getItem('moexpress_viewedWishlist')) || 0);

    useEffect(() => {
        if (cartCount < viewedCart) {
            setViewedCart(cartCount);
            localStorage.setItem('moexpress_viewedCart', cartCount);
        }
    }, [cartCount, viewedCart]);

    useEffect(() => {
        if (wishlistCount < viewedWishlist) {
            setViewedWishlist(wishlistCount);
            localStorage.setItem('moexpress_viewedWishlist', wishlistCount);
        }
    }, [wishlistCount, viewedWishlist]);

    const handleCartClick = () => {
        setViewedCart(cartCount);
        localStorage.setItem('moexpress_viewedCart', cartCount);
        closeMenu();
    };

    const handleWishlistClick = () => {
        setViewedWishlist(wishlistCount);
        localStorage.setItem('moexpress_viewedWishlist', wishlistCount);
        closeMenu();
    };
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery("");
        }
        
    }
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [open]);

    useEffect(() => {
        const handleResize = () => { if (window.innerWidth >= 1024) setOpen(false); };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const closeMenu = () => setOpen(false);

    return (
        <>
            <nav className={`sticky top-0 z-50 bg-white/95 dark:bg-[#0B1120]/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 transition-shadow duration-300 ${scrolled ? "shadow-md" : "shadow-sm"}`}>
                <div className="container mx-auto px-3 sm:px-4 lg:px-6">

                    <div className="h-[64px] sm:h-[70px] flex items-center gap-2 sm:gap-3 lg:gap-5">

                        <Link to="/" onClick={closeMenu} className="flex items-center shrink-0 mr-1 sm:mr-2">
                            {theme === 'dark' ? <img src={logoF} alt="MoExpress" className="w-[92px] sm:w-[115px] md:w-[135px] lg:w-[145px] xl:w-[160px] h-auto object-contain text-white" /> :
                                <img src={logo} alt="MoExpress" className="w-[92px] sm:w-[115px] md:w-[135px] lg:w-[145px] xl:w-[160px] h-auto object-contain" />
                            }
                        </Link>

                        <button className="hidden lg:flex items-center gap-2 shrink-0 px-2 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <MapPin size={20} className="text-gray-500 dark:text-gray-400" />
                            <div className="flex flex-col items-start">
                                <span className="text-[10px] text-gray-500 dark:text-gray-400 leading-none mb-1">{t('deliver_to')}</span>
                                <div className="flex items-center gap-1.5">
                                    <img src="https://flagcdn.com/w20/dz.png" alt="Algeria flag" className="w-5 h-3 object-cover rounded-[2px]" />
                                    <span className="text-sm font-semibold text-gray-800 dark:text-white whitespace-nowrap">Algeria</span>
                                </div>
                            </div>
                        </button>

                        <form onSubmit={handleSearch} className="hidden md:flex flex-1 min-w-0 max-w-[720px] mx-auto relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e)=>setSearchQuery(e.target.value)}
                                placeholder={t('search_placeholder')}
                                className="w-full h-10 sm:h-11 border border-gray-300 dark:border-gray-700 rounded-full py-2 pl-5 pr-12 text-sm bg-gray-50 dark:bg-gray-800/50 dark:text-white placeholder:text-gray-400 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                            <button aria-label="Search" className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-primary text-white hover:bg-orange transition-colors">
                                <Search size={18} />
                            </button>
                        </form>

                        <div className="flex items-center gap-1 sm:gap-2 lg:gap-4 ml-auto shrink-0">
                            
                            {/* Theme & Language */}
                            <div className="hidden lg:flex items-center gap-1 mr-2 border-r border-gray-200 dark:border-gray-700 pr-4">
                                <button onClick={toggleTheme} className="w-9 h-9 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                    {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                                </button>
                                <div className="relative group">
                                    <button className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-semibold text-sm transition-colors">
                                        <Globe size={18} />
                                        {language.toUpperCase()}
                                    </button>
                                    <div className="absolute top-full right-0 mt-2 w-24 bg-white dark:bg-gray-800 shadow-card rounded-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                        <button onClick={() => changeLanguage('en')} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white">EN</button>
                                        <button onClick={() => changeLanguage('fr')} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white">FR</button>
                                        <button onClick={() => changeLanguage('ar')} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white">AR</button>
                                    </div>
                                </div>
                            </div>

                            <Link to={user ? "/profile" : "/login"} className="hidden lg:flex items-center gap-2 px-2 py-1.5 rounded-lg text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                {user?.profilePicture ? (
                                    <img src={user.profilePicture} alt="Profile" className="w-7 h-7 rounded-full object-cover shrink-0" />
                                ) : (
                                    <User size={21} />
                                )}
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-gray-500 dark:text-gray-400 leading-none mb-1">
                                        {user ? `Bonjour, ${user.name.split(' ')[0]}` : t('hello_sign_in')}
                                    </span>
                                    <span className="text-sm font-semibold leading-none whitespace-nowrap flex items-center gap-1.5">
                                        {user ? t('my_account') : t('account')}
                                        {user?.role === 'seller' && (
                                          <span className="text-[9px] font-black bg-[#FF4D20] text-white px-1.5 py-0.5 rounded-full leading-none">SELLER</span>
                                        )}
                                    </span>
                                </div>
                            </Link>

                            {/* Lien Seller Center (visible seulement pour les vendeurs) */}
                            {user?.role === 'seller' && (
                              <Link to="/seller/dashboard" className="hidden lg:flex items-center gap-2 px-2 py-1.5 rounded-lg text-[#FF4D20] hover:bg-orange-50 dark:hover:bg-[#FF4D20]/10 transition-colors">
                                <Store size={20} />
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-orange-400 leading-none mb-1">Espace</span>
                                    <span className="text-sm font-bold leading-none">Seller</span>
                                </div>
                              </Link>
                            )}

                            {/* Lien Admin Panel (visible seulement pour les superAdmins) */}
                            {user?.role === 'superAdmin' && (
                              <Link to="/admin/dashboard" className="hidden lg:flex items-center gap-2 px-2 py-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-500/10 transition-colors">
                                <Shield size={20} />
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-blue-500 dark:text-blue-400 leading-none mb-1">Panneau</span>
                                    <span className="text-sm font-bold leading-none">Admin</span>
                                </div>
                              </Link>
                            )}

                            <Link to="/profile/orders" className="hidden lg:flex items-center gap-2 px-2 py-1.5 rounded-lg text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                <Package size={21} />
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-gray-500 dark:text-gray-400 leading-none mb-1">{t('track')}</span>
                                    <span className="text-sm font-semibold leading-none">{t('orders')}</span>
                                </div>
                            </Link>
                            
                            <NotificationBell />

                            <Link to="/wishlist" onClick={handleWishlistClick} className="flex items-center gap-1.5 sm:gap-2 px-1.5 sm:px-2 py-1.5 rounded-lg text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group">
                                <div className="relative">
                                    <Heart size={22} className="sm:w-6 sm:h-6 group-hover:scale-105 transition-transform" />
                                    {wishlistCount > viewedWishlist && (
                                        <span className="absolute -top-2 -right-2 bg-primary text-white text-[9px] sm:text-[10px] font-bold rounded-full h-[17px] w-[17px] sm:h-[18px] sm:w-[18px] flex items-center justify-center border-2 border-white dark:border-[#0B1120]">
                                            {wishlistCount - viewedWishlist > 99 ? "99+" : wishlistCount - viewedWishlist}
                                        </span>
                                    )}
                                </div>
                            </Link>

                            <Link to="/cart" onClick={handleCartClick} className="flex items-center gap-1.5 sm:gap-2 px-1.5 sm:px-2 py-1.5 rounded-lg text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group">
                                <div className="relative">
                                    <ShoppingCart size={22} className="sm:w-6 sm:h-6 group-hover:scale-105 transition-transform" />
                                    {cartCount > viewedCart && (
                                        <span className="absolute -top-2 -right-2 bg-primary text-white text-[9px] sm:text-[10px] font-bold rounded-full h-[17px] w-[17px] sm:h-[18px] sm:w-[18px] flex items-center justify-center border-2 border-white dark:border-[#0B1120]">
                                            {cartCount - viewedCart > 99 ? "99+" : cartCount - viewedCart}
                                        </span>
                                    )}
                                </div>
                                <span className="hidden lg:block text-sm font-semibold">{t('cart')}</span>
                            </Link>

                            {/* Hamburger (Mobile) */}
                            <button
                                onClick={() => setOpen(!open)}
                                aria-label={open ? "Close menu" : "Open menu"}
                                className="lg:hidden relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary transition-colors"
                            >
                                <Menu size={24} className={`absolute transition-all duration-200 ${open ? "opacity-0 rotate-90 scale-75" : "opacity-100"}`} />
                                <X size={24} className={`absolute transition-all duration-200 ${open ? "opacity-100" : "opacity-0 -rotate-90 scale-75"}`} />
                            </button>
                        </div>
                    </div>

                    {/* Barre de recherche (Mobile) */}
                    <div className="md:hidden pb-3">
                        <form onSubmit={handleSearch} className="relative w-full">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={t('search_placeholder')}
                                className="w-full h-10 border border-gray-300 dark:border-gray-700 rounded-full py-2 pl-5 pr-12 text-sm bg-gray-50 dark:bg-gray-800/50 dark:text-white focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                            <button type="submit" aria-label="Search" className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-primary text-white hover:bg-orange transition-colors">
                                <Search size={18} />
                            </button>
                        </form>
                    </div>
                </div>
            </nav>

            {/* SIDEBAR MOBILE */}
            <div className={`fixed inset-0 z-[100] flex lg:hidden transition-all duration-300 ${open ? "opacity-100 visible" : "opacity-0 invisible"}`}>
                <div className="fixed inset-0 bg-black/60 transition-opacity duration-300" onClick={closeMenu}></div>
                <div className={`relative w-4/5 max-w-sm bg-white dark:bg-[#0B1120] h-full shadow-2xl flex flex-col transition-transform duration-300 ease-out ${open ? "translate-x-0" : "-translate-x-full"}`}>
                    <div className="bg-dark text-white p-4 flex items-center gap-3">
                        {user?.profilePicture ? (
                            <img src={user.profilePicture} alt="Profile" className="w-10 h-10 rounded-full object-cover shrink-0 border-2 border-primary" />
                        ) : (
                            <div className="bg-primary p-2 rounded-full"><User size={22} /></div>
                        )}
                        <span className="text-base font-bold">
                            {user ? `Bonjour, ${user.name.split(' ')[0]}` : t('hello_sign_in')}
                        </span>
                        <button onClick={closeMenu} className="ml-auto text-white"><X size={24} /></button>
                    </div>
                    <div className="flex-1 overflow-y-auto py-2">
                        {/* Mobile Theme & Language Toggles */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                            <button onClick={toggleTheme} className="flex items-center gap-2 text-sm font-semibold dark:text-white">
                                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                            </button>
                            <select 
                                value={language} 
                                onChange={(e) => changeLanguage(e.target.value)}
                                className="bg-gray-100 dark:bg-gray-800 text-sm font-semibold rounded-lg px-2 py-1 outline-none dark:text-white"
                            >
                                <option value="en">EN</option>
                                <option value="fr">FR</option>
                                <option value="ar">AR</option>
                            </select>
                        </div>
                        
                        <Link to="/" onClick={closeMenu} className="flex items-center justify-between px-5 py-3.5 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary border-b border-gray-100 dark:border-gray-800">
                            <span className="font-medium">{t('home')}</span><ChevronRight size={18} className="text-gray-400" />
                        </Link>
                        <Link to="/products" onClick={closeMenu} className="flex items-center justify-between px-5 py-3.5 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary border-b border-gray-100 dark:border-gray-800">
                            <span className="font-medium">{t('products')}</span><ChevronRight size={18} className="text-gray-400" />
                        </Link>
                        <Link to="/flash-deals" onClick={closeMenu} className="flex items-center justify-between px-5 py-3.5 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary border-b border-gray-100 dark:border-gray-800">
                            <span className="font-medium">{t('flash_deals')}</span><ChevronRight size={18} className="text-gray-400" />
                        </Link>
                        <Link to="/profile/orders" onClick={closeMenu} className="flex items-center justify-between px-5 py-3.5 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary border-b border-gray-100 dark:border-gray-800">
                            <span className="font-medium">{t('my_orders')}</span><ChevronRight size={18} className="text-gray-400" />
                        </Link>
                        <Link to="/profile" onClick={closeMenu} className="flex items-center justify-between px-5 py-3.5 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary border-b border-gray-100 dark:border-gray-800">
                            <span className="font-medium">{t('my_account')}</span><ChevronRight size={18} className="text-gray-400" />
                        </Link>
                        <Link to="/cart" onClick={handleCartClick} className="flex items-center justify-between px-5 py-3.5 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary border-b border-gray-100 dark:border-gray-800">
                            <span className="font-medium">{t('my_cart')}</span>
                            {cartCount > viewedCart && (
                                <span className="bg-primary text-white text-xs font-bold rounded-full px-2 py-0.5">
                                    {cartCount - viewedCart > 99 ? "99+" : cartCount - viewedCart}
                                </span>
                            )}
                        </Link>
                        <Link to="/wishlist" onClick={handleWishlistClick} className="flex items-center justify-between px-5 py-3.5 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-primary border-b border-gray-100 dark:border-gray-800">
                            <span className="font-medium">{t('my_wishlist')}</span>
                            {wishlistCount > viewedWishlist && (
                                <span className="bg-primary text-white text-xs font-bold rounded-full px-2 py-0.5">
                                    {wishlistCount - viewedWishlist > 99 ? "99+" : wishlistCount - viewedWishlist}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Navbar;
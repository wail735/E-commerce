import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Box, Percent, Truck, ShieldCheck, Loader2, CheckCircle } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTiktok, FaYoutube, FaGooglePlay, FaApple } from "react-icons/fa";
import axios from 'axios';
import logof from "../assets/logos/logof.png";
import { useLanguage } from '../context/LanguageContext';

const footerI18n = {
  en: {
    whyShop: "Why Shop with MoExpress?",
    millionsProducts: "Millions of Products",
    allCategories: "All categories in one place",
    bestPrices: "Best Prices",
    unbeatableDeals: "Unbeatable deals",
    fastDelivery: "Fast Delivery",
    toAllWilayas: "Across Algeria & worldwide",
    securePayments: "Buyer Protection",
    protected: "Safe shopping guaranteed",
    joinNewsletter: "Subscribe to our newsletter",
    newsletterDesc: "Get the latest deals and offers",
    emailPlaceholder: "Enter your email",
    subscribe: "Subscribe",
    shopMore: "Shop More, Live Better!",
    customerService: "Customer Service",
    helpCenter: "Help Center",
    trackOrder: "Track Order",
    returnsRefunds: "Returns & Refunds",
    contactUs: "Contact Us",
    aboutMo: "About MoExpress",
    aboutUs: "About Us",
    careers: "Careers",
    pressCenter: "Press Center",
    affiliate: "Affiliate Program",
    legal: "Legal",
    terms: "Terms of Service",
    privacy: "Privacy Policy",
    cookies: "Cookie Policy",
    ip: "Intellectual Property",
    downloadApp: "Download App",
    getItOn: "GET IT ON",
    googlePlay: "Google Play",
    downloadOnThe: "Download on the",
    appStore: "App Store",
    followUs: "Follow Us",
    allRightsReserved: "MoExpress. All rights reserved."
  },
  fr: {
    whyShop: "Pourquoi choisir MoExpress ?",
    millionsProducts: "Des millions de produits",
    allCategories: "Toutes les catégories",
    bestPrices: "Meilleurs Prix",
    unbeatableDeals: "Des offres imbattables",
    fastDelivery: "Livraison Rapide",
    toAllWilayas: "Vers les 58 wilayas",
    securePayments: "Protection Acheteur",
    protected: "Shopping 100% sécurisé",
    joinNewsletter: "Rejoignez notre Newsletter",
    newsletterDesc: "Recevez nos dernières offres",
    emailPlaceholder: "Entrez votre email",
    subscribe: "S'abonner",
    shopMore: "Achetez plus, vivez mieux !",
    customerService: "Service Client",
    helpCenter: "Centre d'Aide",
    trackOrder: "Suivre ma commande",
    returnsRefunds: "Retours & Remboursements",
    contactUs: "Nous Contacter",
    aboutMo: "À propos de MoExpress",
    aboutUs: "Qui sommes-nous",
    careers: "Carrières",
    pressCenter: "Espace Presse",
    affiliate: "Programme d'Affiliation",
    legal: "Légal",
    terms: "Conditions d'utilisation",
    privacy: "Politique de confidentialité",
    cookies: "Politique des cookies",
    ip: "Propriété intellectuelle",
    downloadApp: "Télécharger l'App",
    getItOn: "DISPONIBLE SUR",
    googlePlay: "Google Play",
    downloadOnThe: "Télécharger dans l'",
    appStore: "App Store",
    followUs: "Suivez-nous",
    allRightsReserved: "MoExpress. Tous droits réservés."
  },
  ar: {
    whyShop: "لماذا تتسوق مع MoExpress؟",
    millionsProducts: "ملايين المنتجات",
    allCategories: "جميع الفئات في مكان واحد",
    bestPrices: "أفضل الأسعار",
    unbeatableDeals: "عروض لا تقبل المنافسة",
    fastDelivery: "توصيل سريع",
    toAllWilayas: "إلى جميع 58 ولاية",
    securePayments: "حماية المشتري",
    protected: "تسوق آمن ومضمون",
    joinNewsletter: "اشترك في نشرتنا الإخبارية",
    newsletterDesc: "احصل على أحدث العروض والصفقات",
    emailPlaceholder: "أدخل بريدك الإلكتروني",
    subscribe: "اشتراك",
    shopMore: "تسوق أكثر، عش أفضل!",
    customerService: "خدمة العملاء",
    helpCenter: "مركز المساعدة",
    trackOrder: "تتبع الطلب",
    returnsRefunds: "المرتجعات والمستردات",
    contactUs: "اتصل بنا",
    aboutMo: "حول MoExpress",
    aboutUs: "معلومات عنا",
    careers: "الوظائف",
    pressCenter: "المركز الإعلامي",
    affiliate: "برنامج التسويق",
    legal: "قانوني",
    terms: "شروط الخدمة",
    privacy: "سياسة الخصوصية",
    cookies: "سياسة ملفات تعريف الارتباط",
    ip: "الملكية الفكرية",
    downloadApp: "حمل التطبيق",
    getItOn: "احصل عليه من",
    googlePlay: "Google Play",
    downloadOnThe: "تنزيل من",
    appStore: "App Store",
    followUs: "تابعنا",
    allRightsReserved: "MoExpress. جميع الحقوق محفوظة."
  }
};

const Footer = () => {
    const { language } = useLanguage();
    const currentLang = language || 'fr';
    const tFooter = footerI18n[currentLang] || footerI18n['en'];

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);
    const [message, setMessage] = useState('');

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!email) return;
        setLoading(true);
        setStatus(null);

        try {
            const res = await axios.post(import.meta.env.VITE_API_URL + '/api/v1/newsletter/subscribe', { email });
            setStatus('success');
            setMessage(res.data.message || 'Inscription réussie !');
            setEmail('');
        } catch (err) {
            console.error(err);
            setStatus('error');
            setMessage(err.response?.data?.message || 'Erreur lors de l\'inscription.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <footer className="w-full bg-[#080d1a] text-sm text-[#e5e7eb] border-t border-gray-800">

            <div className="border-b border-gray-800">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">

                        <div className="w-full lg:w-3/5">
                            <h3 className="text-white font-semibold mb-5 text-sm tracking-wide">{tFooter.whyShop}</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                                <div className="flex items-start gap-2.5">
                                    <div className="p-1 rounded text-[#FF5000]">
                                        <Box size={22} strokeWidth={2} />
                                    </div>
                                    <div>
                                        <p className="text-white font-medium text-xs leading-tight">{tFooter.millionsProducts}</p>
                                        <p className="text-[#d1d5db] text-[11px] mt-1 leading-tight">{tFooter.allCategories}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2.5">
                                    <div className="p-1 rounded text-[#FF5000]">
                                        <Percent size={22} strokeWidth={2} />
                                    </div>
                                    <div>
                                        <p className="text-white font-medium text-xs leading-tight">{tFooter.bestPrices}</p>
                                        <p className="text-[#d1d5db] text-[11px] mt-1 leading-tight">{tFooter.unbeatableDeals}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2.5">
                                    <div className="p-1 rounded text-[#FF5000]">
                                        <Truck size={22} strokeWidth={2} />
                                    </div>
                                    <div>
                                        <p className="text-white font-medium text-xs leading-tight">{tFooter.fastDelivery}</p>
                                        <p className="text-[#d1d5db] text-[11px] mt-1 leading-tight">{tFooter.toAllWilayas}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2.5">
                                    <div className="p-1 rounded text-[#FF5000]">
                                        <ShieldCheck size={22} strokeWidth={2} />
                                    </div>
                                    <div>
                                        <p className="text-white font-medium text-xs leading-tight">{tFooter.securePayments}</p>
                                        <p className="text-[#d1d5db] text-[11px] mt-1 leading-tight">{tFooter.protected}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full lg:w-2/5 lg:pl-6">
                            <h3 className="text-white font-semibold mb-1 text-sm">{tFooter.joinNewsletter}</h3>
                            <p className="text-[#d1d5db] text-xs mb-3">{tFooter.newsletterDesc}</p>
                            <form onSubmit={handleSubscribe} className="flex flex-col gap-2 max-w-md">
                                <div className="flex shadow-sm">
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder={tFooter.emailPlaceholder}
                                        className="flex-1 h-10 bg-white text-gray-900 placeholder:text-gray-400 px-4 rounded-l-lg focus:outline-none text-sm border-0"
                                    />
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-[#FF5000] hover:bg-[#e04500] text-white font-semibold h-10 px-6 rounded-r-lg transition-colors whitespace-nowrap text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : tFooter.subscribe}
                                    </button>
                                </div>
                                {status === 'success' && <p className="text-green-400 text-xs flex items-center gap-1 mt-1"><CheckCircle size={12} /> {message}</p>}
                                {status === 'error' && <p className="text-red-400 text-xs mt-1">{message}</p>}
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-b border-[#374151]">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">

                        <div className="col-span-2 md:col-span-3 lg:col-span-2 flex flex-col justify-start">
                            <Link to="/" className="flex items-center gap-2 mb-2 group">
                                <img src={logof} alt="MoExpress" className="w-32 md:w-36 h-auto object-contain" />
                            </Link>
                            <p className="text-[#9ca3af] italic text-sm font-medium mt-1">
                                {tFooter.shopMore}
                            </p>
                        </div>

                        {/* Customer Service */}
                        <div>
                            <h4 className="text-white font-semibold mb-4 text-xs tracking-wider">{tFooter.customerService}</h4>
                            <ul className="space-y-2.5">
                                <li><Link to="/help" className="text-[#9ca3af] hover:text-[#FF5000] transition-colors text-xs">{tFooter.helpCenter}</Link></li>
                                <li><Link to="/profile/orders" className="text-[#9ca3af] hover:text-[#FF5000] transition-colors text-xs">{tFooter.trackOrder}</Link></li>
                                <li><Link to="/returns" className="text-[#9ca3af] hover:text-[#FF5000] transition-colors text-xs">{tFooter.returnsRefunds}</Link></li>
                                <li><Link to="/contact" className="text-[#9ca3af] hover:text-[#FF5000] transition-colors text-xs">{tFooter.contactUs}</Link></li>
                            </ul>
                        </div>

                        {/* About MoExpress */}
                        <div>
                            <h4 className="text-white font-semibold mb-4 text-xs tracking-wider">{tFooter.aboutMo}</h4>
                            <ul className="space-y-2.5">
                                <li><Link to="/about" className="text-[#9ca3af] hover:text-[#FF5000] transition-colors text-xs">{tFooter.aboutUs}</Link></li>
                                <li><Link to="/careers" className="text-[#9ca3af] hover:text-[#FF5000] transition-colors text-xs">{tFooter.careers}</Link></li>
                                <li><Link to="/press" className="text-[#9ca3af] hover:text-[#FF5000] transition-colors text-xs">{tFooter.pressCenter}</Link></li>
                                <li><Link to="/affiliate" className="text-[#9ca3af] hover:text-[#FF5000] transition-colors text-xs">{tFooter.affiliate}</Link></li>
                            </ul>
                        </div>

                        {/* Legal */}
                        <div>
                            <h4 className="text-white font-semibold mb-4 text-xs tracking-wider">{tFooter.legal}</h4>
                            <ul className="space-y-2.5">
                                <li><Link to="/terms" className="text-[#9ca3af] hover:text-[#FF5000] transition-colors text-xs">{tFooter.terms}</Link></li>
                                <li><Link to="/privacy" className="text-[#9ca3af] hover:text-[#FF5000] transition-colors text-xs">{tFooter.privacy}</Link></li>
                                <li><Link to="/cookies" className="text-[#9ca3af] hover:text-[#FF5000] transition-colors text-xs">{tFooter.cookies}</Link></li>
                                <li><Link to="/ip" className="text-[#9ca3af] hover:text-[#FF5000] transition-colors text-xs">{tFooter.ip}</Link></li>
                            </ul>
                        </div>

                        {/* Download App + Follow Us */}
                        <div className="space-y-6">
                            {/* Download App */}
                            <div>
                                <h4 className="text-white font-semibold mb-3 text-xs tracking-wider">{tFooter.downloadApp}</h4>
                                <div className="flex flex-col gap-2">
                                    <a href="#" className="flex items-center gap-2.5 bg-black/90 border border-gray-700 hover:border-gray-500 rounded-md px-3 py-1.5 transition-colors w-[130px]">
                                        <FaGooglePlay size={16} className="text-white shrink-0" />
                                        <div className="flex flex-col">
                                            <span className="text-[8px] text-[#9ca3af] leading-none">{tFooter.getItOn}</span>
                                            <span className="text-[11px] font-bold text-white leading-tight">{tFooter.googlePlay}</span>
                                        </div>
                                    </a>
                                    <a href="#" className="flex items-center gap-2.5 bg-black/90 border border-gray-700 hover:border-gray-500 rounded-md px-3 py-1.5 transition-colors w-[130px]">
                                        <FaApple size={18} className="text-white shrink-0" />
                                        <div className="flex flex-col">
                                            <span className="text-[8px] text-[#9ca3af] leading-none">{tFooter.downloadOnThe}</span>
                                            <span className="text-[11px] font-bold text-white leading-tight">{tFooter.appStore}</span>
                                        </div>
                                    </a>
                                </div>
                            </div>

                            {/* Follow Us */}
                            <div>
                                <h4 className="text-white font-semibold mb-3 text-xs tracking-wider">{tFooter.followUs}</h4>
                                <div className="flex items-center gap-2">
                                    <a href="#" aria-label="Facebook" className="w-7 h-7 rounded-md bg-[#1877F2] flex items-center justify-center text-white hover:opacity-90 transition-opacity">
                                        <FaFacebookF size={12} />
                                    </a>
                                    <a href="#" aria-label="Instagram" className="w-7 h-7 rounded-md bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] flex items-center justify-center text-white hover:opacity-90 transition-opacity">
                                        <FaInstagram size={13} />
                                    </a>
                                    <a href="#" aria-label="TikTok" className="w-7 h-7 rounded-md bg-black border border-gray-700 flex items-center justify-center text-white hover:opacity-90 transition-opacity">
                                        <FaTiktok size={12} />
                                    </a>
                                    <a href="#" aria-label="YouTube" className="w-7 h-7 rounded-md bg-[#FF0000] flex items-center justify-center text-white hover:opacity-90 transition-opacity">
                                        <FaYoutube size={12} />
                                    </a>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* ===== SECTION 3 : Copyright & Paiements ===== */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-5">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#9ca3af]">
                    <p>© 2026 {tFooter.allRightsReserved}</p>

                    {/* Payment badges */}
                    <div className="flex items-center gap-2 flex-wrap justify-center">
                        <span className="px-2 py-0.5 bg-white text-blue-900 font-extrabold rounded text-[10px] tracking-wider border border-gray-200">
                            VISA
                        </span>
                        <div className="px-2 py-0.5 bg-white rounded flex items-center gap-0.5 border border-gray-200">
                            <span className="w-2.5 h-2.5 bg-red-500 rounded-full inline-block"></span>
                            <span className="w-2.5 h-2.5 bg-amber-400 rounded-full -ml-1.5 inline-block opacity-90"></span>
                        </div>
                        <div className="px-2 py-0.5 bg-white rounded flex items-center gap-0.5 border border-gray-200">
                            <span className="w-2.5 h-2.5 bg-red-600 rounded-full inline-block"></span>
                            <span className="w-2.5 h-2.5 bg-blue-600 rounded-full -ml-1.5 inline-block opacity-90"></span>
                        </div>
                        <span className="px-2 py-0.5 bg-white text-[#003087] font-bold rounded text-[10px] italic border border-gray-200">
                            PayPal
                        </span>
                        <span className="px-2 py-0.5 bg-gray-800 text-[#d1d5db] font-medium rounded text-[10px] border border-gray-700">
                            CIB / Edahabia
                        </span>
                    </div>
                </div>
            </div>

        </footer>
    );
};

export default Footer;
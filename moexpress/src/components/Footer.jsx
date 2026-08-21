    import React from "react";
    import { Link } from "react-router-dom";
    import { Box, Percent, Truck, ShieldCheck } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTiktok, FaYoutube, FaGooglePlay, FaApple } from "react-icons/fa";
    import logof from "../assets/logos/logof.png"
    const Footer = () => {
        return (
            <footer className="w-full bg-[#080d1a] text-sm text-[#e5e7eb] border-t border-gray-800">

                <div className="border-b border-gray-800">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">

                            <div className="w-full lg:w-3/5">
                                <h3 className="text-white font-semibold mb-5 text-sm tracking-wide">Why Shop with MoExpress?</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                                    <div className="flex items-start gap-2.5">
                                        <div className="p-1 rounded text-[#FF5000]">
                                            <Box size={22} strokeWidth={2} />
                                        </div>
                                        <div>
                                            <p className="text-white font-medium text-xs leading-tight">Millions of Products</p>
                                            <p className="text-[#d1d5db] text-[11px] mt-1 leading-tight">All categories in one place</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-2.5">
                                        <div className="p-1 rounded text-[#FF5000]">
                                            <Percent size={22} strokeWidth={2} />
                                        </div>
                                        <div>
                                            <p className="text-white font-medium text-xs leading-tight">Best Prices</p>
                                            <p className="text-[#d1d5db] text-[11px] mt-1 leading-tight">Unbeatable deals</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-2.5">
                                        <div className="p-1 rounded text-[#FF5000]">
                                            <Truck size={22} strokeWidth={2} />
                                        </div>
                                        <div>
                                            <p className="text-white font-medium text-xs leading-tight">Fast Delivery</p>
                                            <p className="text-[#d1d5db] text-[11px] mt-1 leading-tight">Across Algeria & worldwide</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-2.5">
                                        <div className="p-1 rounded text-[#FF5000]">
                                            <ShieldCheck size={22} strokeWidth={2} />
                                        </div>
                                        <div>
                                            <p className="text-white font-medium text-xs leading-tight">Buyer Protection</p>
                                            <p className="text-[#d1d5db] text-[11px] mt-1 leading-tight">Safe shopping guaranteed</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full lg:w-2/5 lg:pl-6">
                                <h3 className="text-white font-semibold mb-1 text-sm">Subscribe to our newsletter</h3>
                                <p className="text-[#d1d5db] text-xs mb-3">Get the latest deals and offers</p>
                                <form onSubmit={(e) => e.preventDefault()} className="flex max-w-md shadow-sm">
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="flex-1 h-10 bg-white text-gray-900 placeholder:text-gray-400 px-4 rounded-l-lg focus:outline-none text-sm border-0"
                                    />
                                    <button
                                        type="submit"
                                        className="bg-[#FF5000] hover:bg-[#e04500] text-white font-semibold h-10 px-6 rounded-r-lg transition-colors whitespace-nowrap text-sm"
                                    >
                                        Subscribe
                                    </button>
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
                                    Shop More, Live Better!
                                </p>
                            </div>

                            {/* Customer Service */}
                            <div>
                                <h4 className="text-white font-semibold mb-4 text-xs tracking-wider">Customer Service</h4>
                                <ul className="space-y-2.5">
                                    <li><Link to="/help" className="text-[#9ca3af] hover:text-[#FF5000] transition-colors text-xs">Help Center</Link></li>
                                    <li><Link to="/orders" className="text-[#9ca3af] hover:text-[#FF5000] transition-colors text-xs">Track Order</Link></li>
                                    <li><Link to="/returns" className="text-[#9ca3af] hover:text-[#FF5000] transition-colors text-xs">Returns & Refunds</Link></li>
                                    <li><Link to="/contact" className="text-[#9ca3af] hover:text-[#FF5000] transition-colors text-xs">Contact Us</Link></li>
                                </ul>
                            </div>

                            {/* About MoExpress */}
                            <div>
                                <h4 className="text-white font-semibold mb-4 text-xs tracking-wider">About MoExpress</h4>
                                <ul className="space-y-2.5">
                                    <li><Link to="/about" className="text-[#9ca3af] hover:text-[#FF5000] transition-colors text-xs">About Us</Link></li>
                                    <li><Link to="/careers" className="text-[#9ca3af] hover:text-[#FF5000] transition-colors text-xs">Careers</Link></li>
                                    <li><Link to="/press" className="text-[#9ca3af] hover:text-[#FF5000] transition-colors text-xs">Press Center</Link></li>
                                    <li><Link to="/affiliate" className="text-[#9ca3af] hover:text-[#FF5000] transition-colors text-xs">Affiliate Program</Link></li>
                                </ul>
                            </div>

                            {/* Legal */}
                            <div>
                                <h4 className="text-white font-semibold mb-4 text-xs tracking-wider">Legal</h4>
                                <ul className="space-y-2.5">
                                    <li><Link to="/terms" className="text-[#9ca3af] hover:text-[#FF5000] transition-colors text-xs">Terms of Service</Link></li>
                                    <li><Link to="/privacy" className="text-[#9ca3af] hover:text-[#FF5000] transition-colors text-xs">Privacy Policy</Link></li>
                                    <li><Link to="/cookies" className="text-[#9ca3af] hover:text-[#FF5000] transition-colors text-xs">Cookie Policy</Link></li>
                                    <li><Link to="/ip" className="text-[#9ca3af] hover:text-[#FF5000] transition-colors text-xs">Intellectual Property</Link></li>
                                </ul>
                            </div>

                            {/* Download App + Follow Us */}
                            <div className="space-y-6">
                                {/* Download App */}
                                <div>
                                    <h4 className="text-white font-semibold mb-3 text-xs tracking-wider">Download App</h4>
                                    <div className="flex flex-col gap-2">
                                        <a href="#" className="flex items-center gap-2.5 bg-black/90 border border-gray-700 hover:border-gray-500 rounded-md px-3 py-1.5 transition-colors w-[130px]">
                                            <FaGooglePlay size={16} className="text-white shrink-0" />
                                            <div className="flex flex-col">
                                                <span className="text-[8px] text-[#9ca3af] leading-none">GET IT ON</span>
                                                <span className="text-[11px] font-bold text-white leading-tight">Google Play</span>
                                            </div>
                                        </a>
                                        <a href="#" className="flex items-center gap-2.5 bg-black/90 border border-gray-700 hover:border-gray-500 rounded-md px-3 py-1.5 transition-colors w-[130px]">
                                            <FaApple size={18} className="text-white shrink-0" />
                                            <div className="flex flex-col">
                                                <span className="text-[8px] text-[#9ca3af] leading-none">Download on the</span>
                                                <span className="text-[11px] font-bold text-white leading-tight">App Store</span>
                                            </div>
                                        </a>
                                    </div>
                                </div>

                                {/* Follow Us */}
                                <div>
                                    <h4 className="text-white font-semibold mb-3 text-xs tracking-wider">Follow Us</h4>
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
                        <p>© 2026 MoExpress. All rights reserved.</p>

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
import React from "react";
import { Link } from "react-router-dom";

const FooterLinks = [
  { title: "Home", link: "/" },
  { title: "About", link: "/#about" },
  { title: "Contact", link: "/#contact" },
  { title: "Blog", link: "/#blog" },
];

const Footer = () => {
  return (
    <footer
      className="relative text-white mt-14"
      style={{
        backgroundImage: "url('/assets/website/footer-pattern.jpg')",
        backgroundPosition: "bottom",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/55"></div>

      <div className="relative z-10 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-14 pb-44">

          {/* Company Details */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img src="/assets/logo.png" alt="logo" className="w-12" />
              <span className="text-2xl font-bold">Shopsy</span>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed">
              Your ultimate destination for fashion. We provide high-quality products that combine style, comfort, and affordability.
            </p>
          </div>

          {/* Important Links */}
          <div>
            <h2 className="text-lg font-bold mb-4">Important Links</h2>
            <ul className="flex flex-col gap-3">
              {FooterLinks.map((link) => (
                <li key={link.title}>
                  <Link
                    to={link.link}
                    className="text-gray-300 hover:text-orange-400 hover:translate-x-1 inline-block duration-300 text-sm"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h2 className="text-lg font-bold mb-4">Links</h2>
            <ul className="flex flex-col gap-3">
              {FooterLinks.map((link) => (
                <li key={link.title}>
                  <Link
                    to={link.link}
                    className="text-gray-300 hover:text-orange-400 hover:translate-x-1 inline-block duration-300 text-sm"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Contact */}
          <div>
            {/* Social Icons */}
            <div className="flex items-center gap-4 mb-6">
              <a href="#" className="hover:text-orange-400 duration-300 transition-colors">
                <i className="fa-brands fa-instagram text-2xl"></i>
              </a>
              <a href="#" className="hover:text-orange-400 duration-300 transition-colors">
                <i className="fa-brands fa-facebook text-2xl"></i>
              </a>
              <a href="#" className="hover:text-orange-400 duration-300 transition-colors">
                <i className="fa-brands fa-linkedin text-2xl"></i>
              </a>
            </div>
            {/* Contact Info */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 text-gray-300 text-sm">
                <i className="fa-solid fa-location-dot text-orange-400 text-lg w-5"></i>
                <span>Paris, France</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300 text-sm">
                <i className="fa-solid fa-mobile-screen text-orange-400 text-lg w-5"></i>
                <span>+33 1 23 45 67 89</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative z-10 border-t border-white/10 py-4 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} Shopsy. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

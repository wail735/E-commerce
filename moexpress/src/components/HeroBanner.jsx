import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import hero1 from "../assets/images/hero1.jpeg";
import hero2 from "../assets/images/hero2.jpeg";
import hero3 from "../assets/images/hero3.jpeg";
import { useLanguage } from '../context/LanguageContext';

const slides = [
  {
    id: 1,
    titleKey: "banner_1_title",
    descKey: "banner_1_desc",
    buttonTextKey: "shop_now",
    buttonLink: "/products",
    image: hero1,
  },
  {
    id: 2,
    titleKey: "banner_2_title",
    descKey: "banner_2_desc",
    buttonTextKey: "explore_fashion",
    buttonLink: "/fashion",
    image: hero2,
  },
  {
    id: 3,
    titleKey: "banner_3_title",
    descKey: "banner_3_desc",
    buttonTextKey: "shop_tech",
    buttonLink: "/tech",
    image: hero3,
  }
];

const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { t, language } = useLanguage();
  const isRTL = language === 'ar';

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[220px] sm:h-[300px] md:h-[340px] lg:h-full rounded-2xl overflow-hidden group shadow-md">

      {/* Slides Track */}
      <div
        className="flex w-full h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(${isRTL ? currentSlide * 100 : -(currentSlide * 100)}%)` }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="min-w-full h-full relative"
          >
            {/* Full background image */}
            <img
              src={slide.image}
              alt={t(slide.titleKey).replace('\n', ' ')}
              className="absolute inset-0 w-full h-full object-cover object-center"
            />

            <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-10 md:px-12 z-10 text-white w-full sm:w-2/3 md:w-[55%] pb-6">

              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-bold font-display leading-[1.15] mb-3 whitespace-pre-line drop-shadow-md">
                {t(slide.titleKey)}
              </h2>

              <p className="text-xs sm:text-sm md:text-[15px] mb-6 whitespace-pre-line text-white/90 leading-relaxed max-w-[280px]">
                {t(slide.descKey)}
              </p>

              <Link
                to={slide.buttonLink}
                className="inline-flex items-center justify-center px-6 py-2.5 sm:px-7 sm:py-3 rounded-full font-bold text-[13px] sm:text-sm w-fit bg-white text-gray-900 hover:bg-gray-100 transition-all shadow-md hover:scale-105"
              >
                {t(slide.buttonTextKey)}
              </Link>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
        className={`${isRTL ? 'right-3' : 'left-3'} absolute top-1/2 -translate-y-1/2 w-9 h-14 sm:w-11 sm:h-16 bg-black/20 hover:bg-black/50 backdrop-blur-sm rounded flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all z-30`}
        aria-label="Previous slide"
      >
        {isRTL ? <ChevronRight size={28} strokeWidth={1.5} /> : <ChevronLeft size={28} strokeWidth={1.5} />}
      </button>

      <button
        onClick={() => setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))}
        className={`${isRTL ? 'left-3' : 'right-3'} absolute top-1/2 -translate-y-1/2 w-9 h-14 sm:w-11 sm:h-16 bg-black/20 hover:bg-black/50 backdrop-blur-sm rounded flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all z-30`}
        aria-label="Next slide"
      >
        {isRTL ? <ChevronLeft size={28} strokeWidth={1.5} /> : <ChevronRight size={28} strokeWidth={1.5} />}
      </button>

      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-30">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              currentSlide === index
                ? "w-6 h-2 bg-white"
                : "w-2 h-2 bg-white/40 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

    </div>
  );
};

export default HeroBanner;

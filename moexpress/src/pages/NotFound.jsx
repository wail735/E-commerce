import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { Home, ArrowLeft, ShoppingBag } from "lucide-react";
import { useLanguage } from '../context/LanguageContext';

function NotFound() {
  const { t } = useLanguage();
  const containerRef = useRef(null);
  const numRef = useRef(null);
  const titleRef = useRef(null);
  const subRef = useRef(null);
  const btnRef = useRef(null);
  const particle1 = useRef(null);
  const particle2 = useRef(null);
  const particle3 = useRef(null);
  const bagRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([numRef.current, titleRef.current, subRef.current, btnRef.current], {
        opacity: 0,
        y: 40,
      });
      gsap.set(bagRef.current, { opacity: 0, scale: 0, rotate: -20 });
      gsap.set([particle1.current, particle2.current, particle3.current], {
        opacity: 0,
        scale: 0,
      });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.to(bagRef.current, {
        opacity: 1,
        scale: 1,
        rotate: 0,
        duration: 0.7,
        ease: "back.out(1.7)",
      })
        .to(
          numRef.current,
          { opacity: 1, y: 0, duration: 0.8, ease: "power4.out" },
          "-=0.3"
        )
        .to(titleRef.current, { opacity: 1, y: 0, duration: 0.6 }, "-=0.4")
        .to(subRef.current, { opacity: 1, y: 0, duration: 0.6 }, "-=0.4")
        .to(btnRef.current, { opacity: 1, y: 0, duration: 0.6 }, "-=0.3")
        .to(
          [particle1.current, particle2.current, particle3.current],
          { opacity: 1, scale: 1, duration: 0.5, stagger: 0.15 },
          "-=0.5"
        );

      gsap.to(bagRef.current, {
        y: -14,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.7,
      });

      const glitch = () => {
        const tl = gsap.timeline();
        tl.to(numRef.current, { x: -4, skewX: 4, duration: 0.05 })
          .to(numRef.current, { x: 4, skewX: -4, duration: 0.05 })
          .to(numRef.current, { x: -2, skewX: 2, duration: 0.05 })
          .to(numRef.current, { x: 0, skewX: 0, duration: 0.05 });
      };
      const glitchInterval = setInterval(glitch, 3000);

      gsap.to(particle1.current, {
        y: -20,
        x: 10,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(particle2.current, {
        y: 15,
        x: -15,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.5,
      });
      gsap.to(particle3.current, {
        y: -12,
        x: -8,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1,
      });

      return () => clearInterval(glitchInterval);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-white dark:bg-[#0B1120] transition-colors duration-300 flex flex-col items-center justify-center px-4 overflow-hidden relative"
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-orange-50 dark:bg-orange-500/10 opacity-60" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-orange-50 dark:bg-orange-500/10 opacity-40" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-gray-100 dark:border-gray-800" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-gray-50 dark:border-gray-800/50" />
      </div>

      <div
        ref={particle1}
        className="absolute top-[20%] left-[15%] w-4 h-4 rounded-full bg-[#FF4D20] opacity-30"
      />
      <div
        ref={particle2}
        className="absolute bottom-[25%] right-[12%] w-6 h-6 rounded-full bg-orange-300 opacity-40"
      />
      <div
        ref={particle3}
        className="absolute top-[35%] right-[20%] w-3 h-3 rounded-full bg-[#FF4D20] opacity-20"
      />

      <div className="relative z-10 flex flex-col items-center text-center max-w-lg">

        <div ref={bagRef} className="mb-6">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#FF4D20] to-orange-400 flex items-center justify-center shadow-[0_20px_60px_rgba(255,77,32,0.35)]">
            <ShoppingBag size={44} className="text-white" />
          </div>
        </div>

        <div ref={numRef} className="relative mb-2">
          <span className="text-[120px] sm:text-[160px] font-black leading-none tracking-tighter bg-gradient-to-br from-gray-900 via-gray-700 to-gray-500 dark:from-gray-100 dark:via-gray-300 dark:to-gray-500 bg-clip-text text-transparent select-none">
            404
          </span>
          <span
            className="absolute inset-0 text-[120px] sm:text-[160px] font-black leading-none tracking-tighter text-[#FF4D20] opacity-10 select-none"
            style={{ transform: "translate(3px, 3px)" }}
            aria-hidden="true"
          >
            404
          </span>
        </div>

        <h1
          ref={titleRef}
          className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3"
        >
          {t('page_not_found')}
        </h1>

        <p
          ref={subRef}
          className="text-base text-gray-500 dark:text-gray-400 mb-10 leading-relaxed max-w-sm"
        >
          {t('page_not_found_desc')}
        </p>

        <div ref={btnRef} className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Link
            to="/"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-[#FF4D20] text-white font-bold rounded-xl hover:bg-orange-600 transition-all shadow-[0_8px_24px_rgba(255,77,32,0.3)] hover:shadow-[0_12px_32px_rgba(255,77,32,0.4)] hover:-translate-y-0.5 active:translate-y-0 duration-200"
          >
            <Home size={18} />
            {t('back_to_home')}
          </Link>
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all hover:-translate-y-0.5 active:translate-y-0 duration-200"
          >
            <ArrowLeft size={18} />
            {t('go_back')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;

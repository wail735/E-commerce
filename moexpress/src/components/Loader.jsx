import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import logo from "../assets/logos/logof.png";

function Loader({ onComplete }) {
  const overlayRef  = useRef(null);
  const logoWrapRef = useRef(null);
  const logoRef     = useRef(null);
  const glowRef     = useRef(null);
  const ringRef     = useRef(null);
  const taglineRef  = useRef(null);
  const percentRef  = useRef(null);
  const barFillRef  = useRef(null);
  const panel1Ref   = useRef(null);
  const panel2Ref   = useRef(null);

  useEffect(() => {
    /* ── SVG circle setup ── */
    const circle = ringRef.current;
    if (circle) {
      const r   = circle.r.baseVal.value;
      const c   = 2 * Math.PI * r;
      circle.style.strokeDasharray  = c;
      circle.style.strokeDashoffset = c;
    }

    const ctx = gsap.context(() => {
      /* ── Initial states ── */
      gsap.set([logoWrapRef.current, taglineRef.current, percentRef.current],
        { opacity: 0, y: 24 });
      gsap.set(glowRef.current,   { opacity: 0, scale: 0.6 });

      /* ── Entrance timeline ── */
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => {
          // split-panel exit
          gsap.to(panel1Ref.current, {
            yPercent: -100, duration: 0.9, ease: "power4.inOut", delay: 0.15,
          });
          gsap.to(panel2Ref.current, {
            yPercent: 100, duration: 0.9, ease: "power4.inOut", delay: 0.15,
            onComplete: () => onComplete?.(),
          });
        },
      });

      tl
        // glow blooms first
        .to(glowRef.current, { opacity: 1, scale: 1, duration: 1, ease: "power2.out" })
        // logo slides up
        .to(logoWrapRef.current, { opacity: 1, y: 0, duration: 0.7, ease: "back.out(1.4)" }, "-=0.5")
        // tagline
        .to(taglineRef.current,  { opacity: 1, y: 0, duration: 0.55 }, "-=0.2")
        // percent label
        .to(percentRef.current,  { opacity: 1, y: 0, duration: 0.4  }, "-=0.2");

      /* ── SVG ring progress ── */
      if (circle) {
        const r = circle.r.baseVal.value;
        const c = 2 * Math.PI * r;
        gsap.to(circle, {
          strokeDashoffset: 0,
          duration: 1.8,
          ease: "power1.inOut",
          delay: 0.6,
        });
      }

      /* ── Bar fill ── */
      gsap.to(barFillRef.current, {
        scaleX: 1,
        duration: 1.8,
        ease: "power1.inOut",
        delay: 0.6,
        transformOrigin: "left",
      });
      gsap.set(barFillRef.current, { scaleX: 0, transformOrigin: "left" });

      /* ── Percent counter ── */
      const obj = { val: 0 };
      gsap.to(obj, {
        val: 100,
        duration: 1.8,
        ease: "power1.inOut",
        delay: 0.6,
        onUpdate: () => {
          if (percentRef.current)
            percentRef.current.textContent = Math.round(obj.val) + "%";
        },
      });

      /* ── Subtle logo float ── */
      gsap.to(logoWrapRef.current, {
        y: -8, duration: 2.4, repeat: -1, yoyo: true,
        ease: "sine.inOut", delay: 1.2,
      });

    }, overlayRef);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    /* Two-panel container for split exit */
    <div ref={overlayRef} className="fixed inset-0 z-[9999] pointer-events-none">

      {/* Panel top */}
      <div
        ref={panel1Ref}
        className="absolute inset-x-0 top-0 h-1/2 bg-[#0D0D0D] pointer-events-auto"
      />
      {/* Panel bottom */}
      <div
        ref={panel2Ref}
        className="absolute inset-x-0 bottom-0 h-1/2 bg-[#0D0D0D] pointer-events-auto"
      />

      {/* ── Centered content (sits above both panels) ── */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 pointer-events-none">

        {/* Ambient glow */}
        <div
          ref={glowRef}
          className="absolute w-[480px] h-[480px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(255,77,32,0.18) 0%, rgba(255,120,50,0.07) 50%, transparent 75%)",
          }}
        />

        {/* SVG ring + logo */}
        <div className="relative flex items-center justify-center">
          {/* Spinning ring */}
          <svg width="160" height="160" className="-rotate-90 absolute">
            {/* Track */}
            <circle
              cx="80" cy="80" r="72"
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="3"
            />
            {/* Progress */}
            <circle
              ref={ringRef}
              cx="80" cy="80" r="72"
              fill="none"
              stroke="url(#ringGrad)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="#FF4D20" />
                <stop offset="100%" stopColor="#FF9A3C" />
              </linearGradient>
            </defs>
          </svg>

          {/* Logo inside ring */}
          <div ref={logoWrapRef} className="relative z-10">
            <div className="w-28 h-28 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center shadow-2xl">
              <img
                ref={logoRef}
                src={logo}
                alt="MoExpress"
                className="w-20 h-auto object-contain brightness-0 invert"
              />
            </div>
          </div>
        </div>

        {/* Tagline */}
        <p
          ref={taglineRef}
          className="text-[11px] text-white/30 tracking-[0.3em] uppercase font-medium"
        >
          Your smart shopping destination
        </p>

        {/* Bottom progress bar + percent */}
        <div className="w-64 flex flex-col gap-2">
          {/* Thin bar */}
          <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden">
            <div
              ref={barFillRef}
              className="h-full w-full rounded-full"
              style={{
                background: "linear-gradient(90deg, #FF4D20 0%, #FF9A3C 100%)",
              }}
            />
          </div>
          {/* Percent */}
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-white/20 tracking-widest uppercase">
              Loading
            </span>
            <span
              ref={percentRef}
              className="text-[11px] font-bold tabular-nums"
              style={{ color: "#FF4D20" }}
            >
              0%
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Loader;

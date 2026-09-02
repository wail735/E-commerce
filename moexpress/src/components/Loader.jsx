import React, { useEffect, useState } from 'react';
import './Loader.css';

const Loader = ({
  messages = [
    "Connexion à MOExpress...",
    "Chargement des produits...",
    "Préparation de votre session..."
  ],
  onComplete,
  duration = 2500
}) => {
  const [currentText, setCurrentText] = useState(messages[0] || "");

  useEffect(() => {
    if (!messages.length) return;
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % messages.length;
      setCurrentText(messages[index]);
    }, duration / messages.length);

    return () => clearInterval(interval);
  }, [messages, duration]);

  useEffect(() => {
    if (!onComplete) return;
    const timer = setTimeout(() => onComplete(), duration);
    return () => clearTimeout(timer);
  }, [onComplete, duration]);

  return (
    <div className="moe-loader-overlay" role="status" aria-live="polite">
      <div className="moe-loader-content">

        {/* Scène du Camion Modernisé */}
        <div className="moe-truck-scene">

          {/* Lignes de vitesse en arrière-plan */}
          <div className="moe-speed-lines">
            <span className="line l1"></span>
            <span className="line l2"></span>
            <span className="line l3"></span>
          </div>

          {/* SVG du Camion Épuré / Tech */}
          <div className="moe-truck-body">
            <svg viewBox="0 0 160 70" className="moe-truck-svg">
              {/* Conteneur / Caisse arrière */}
              <rect x="5" y="10" width="95" height="42" rx="6" fill="#1e293b" />
              {/* Bande Express sur le conteneur */}
              <path d="M 20 10 L 40 10 L 25 52 L 5 52 Z" fill="#f83d3d" />
              <text x="48" y="35" fill="#ffffff" fontSize="10" fontWeight="800" fontFamily="sans-serif" letterSpacing="0.5">
                MOEXPRESS
              </text>

              {/* Cabine avant */}
              <path d="M 100 22 H 128 C 133 22 138 26 141 31 L 148 42 C 150 45 150 52 145 52 H 100 V 22 Z" fill="#f83d3d" />
              {/* Pare-brise */}
              <path d="M 108 26 H 125 C 128 26 131 29 133 33 L 137 40 H 108 V 26 Z" fill="#0f172a" />

              {/* Phare avant moderne (LED Neon) */}
              <rect x="146" y="44" width="4" height="5" rx="1.5" fill="#facc15" className="moe-headlight-glow" />

              {/* Pare-chocs */}
              <rect x="144" y="49" width="6" height="3" rx="1" fill="#64748b" />
            </svg>

            {/* Micro-particules d'échappement (Fumée fluide) */}
            <div className="moe-exhaust">
              <span className="p1"></span>
              <span className="p2"></span>
              <span className="p3"></span>
            </div>
          </div>

          {/* Roues distinctes animées */}
          <div className="moe-wheels">
            <div className="wheel w-back">
              <div className="rim"></div>
            </div>
            <div className="wheel w-front">
              <div className="rim"></div>
            </div>
          </div>

          {/* Route avec ombre portée et vitesse */}
          <div className="moe-road"></div>
        </div>

        {/* Branding & Message */}
        <div className="moe-text-wrapper">
          <p className="moe-loading-msg">{currentText}</p>
        </div>

      </div>
    </div>
  );
};

export default Loader;
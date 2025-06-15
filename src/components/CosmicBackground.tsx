
'use client';

import React, { useEffect, useRef } from 'react';

// Aurora component remains for general background ambience
const Aurora = () => (
  <div className="aurora-container">
    <div className="aurora-1"></div>
    <div className="aurora-2"></div>
    <div className="aurora-3"></div>
    <div className="aurora-4"></div>
  </div>
);

export const CosmicBackground = () => {
  const mounted = useRef(true);
  const activeOrbs = useRef(0);
  const styleSheetRef = useRef<CSSStyleSheet | null>(null);

  useEffect(() => {
    mounted.current = true;
    // Attempt to get the first stylesheet, assuming it's the one created by Next.js for global styles
    if (document.styleSheets.length > 0) {
        styleSheetRef.current = document.styleSheets[0];
    } else {
        // Fallback: create a new style element if no stylesheets are found (less ideal)
        const styleEl = document.createElement('style');
        document.head.appendChild(styleEl);
        styleSheetRef.current = styleEl.sheet;
    }

    const MAX_ORBS = 7; // Adjusted for potentially more complex orbs

    const createSpiritOrb = () => {
      if (!mounted.current || activeOrbs.current >= MAX_ORBS || !styleSheetRef.current) return;
      activeOrbs.current++;

      const orb = document.createElement('div');
      orb.className = 'spirit-orb';

      const startX = Math.random() * 100; // vw
      const startY = Math.random() * 70 + 30; // vh (start lower, float up)
      
      const driftX = (Math.random() - 0.5) * 30; // -15vw to +15vw drift
      const driftY = -(Math.random() * 40 + 30); // -30vh to -70vh (upwards, more pronounced)
      
      const endX = startX + driftX;
      const endY = startY + driftY;

      const duration = Math.random() * 7 + 8; // 8s to 15s (slower, floatier)
      const initialMaxOpacity = Math.random() * 0.3 + 0.6; // 0.6 to 0.9 (CSS pulse will vary this)

      const animationName = `driftFade-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
      
      const keyframes = `
        @keyframes ${animationName} {
          0% { 
            transform: translate(${startX}vw, ${startY}vh) scale(0.7); 
            opacity: 0; 
          }
          25% { /* Slower fade-in */
            opacity: ${initialMaxOpacity}; 
            transform: translate(${startX + driftX * 0.2}vw, ${startY + driftY * 0.2}vh) scale(1);
          }
          75% { /* Hold opacity longer */
            opacity: ${initialMaxOpacity * 0.6}; 
            transform: translate(${startX + driftX * 0.75}vw, ${startY + driftY * 0.75}vh) scale(1.1);
          }
          100% { 
            transform: translate(${endX}vw, ${endY}vh) scale(0.8); 
            opacity: 0; 
          }
        }
      `;

      try {
        if (styleSheetRef.current) {
            styleSheetRef.current.insertRule(keyframes, styleSheetRef.current.cssRules.length);
            orb.style.animation = `${animationName} ${duration}s ease-in-out forwards`;
        }
      } catch (e) {
        console.warn("Failed to insert CSS rule for spirit orb animation:", e);
        activeOrbs.current--;
        return; 
      }
      
      const container = document.querySelector('.stars-container');
      if (container) {
        container.appendChild(orb);
        orb.addEventListener('animationend', () => {
          if (mounted.current && orb.parentNode) {
            orb.remove();
            activeOrbs.current--;
            try {
                if (styleSheetRef.current) {
                    for (let i = 0; i < styleSheetRef.current.cssRules.length; i++) {
                        const rule = styleSheetRef.current.cssRules[i] as CSSKeyframesRule;
                        if (rule.name === animationName) {
                            styleSheetRef.current.deleteRule(i);
                            break;
                        }
                    }
                }
            } catch (e) {
                console.warn("Failed to delete CSS rule for spirit orb animation:", e);
            }
          }
        });
      } else {
        activeOrbs.current--; 
      }
    };

    // Create initial orbs with a slight delay
    for (let i = 0; i < 3; i++) { 
      setTimeout(() => createSpiritOrb(), i * 2000 + 500); // Stagger initial orbs
    }

    // Interval for new orbs
    const interval = setInterval(createSpiritOrb, 3500 + Math.random() * 2500); // 3.5s to 6s interval

    return () => {
      mounted.current = false;
      clearInterval(interval);
      document.querySelectorAll('.spirit-orb').forEach((orb) => orb.remove());
      activeOrbs.current = 0;
    };
  }, []);

  return (
    <div className="cosmic-background">
      <div className="stars-container" /> 
      <Aurora />
    </div>
  );
};

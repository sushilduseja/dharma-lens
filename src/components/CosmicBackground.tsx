'use client';

import React, { useEffect } from 'react';

const Aurora = () => (
  <div className="aurora-container">
    <div className="aurora-1"></div>
    <div className="aurora-2"></div>
    <div className="aurora-3"></div>
    <div className="aurora-4"></div>
  </div>
);

export const CosmicBackground = () => {
  useEffect(() => {
    let mounted = true;

    const createShootingStar = () => {
      if (!mounted) return;

      const star = document.createElement('div');
      star.className = 'shooting-star';

      // Randomize starting position slightly
      const startX = 30 + Math.random() * 20; // 30-50 vw
      const startY = 80 + Math.random() * 15; // 80-95 vh
      star.style.transform = `translate(${startX}vw, ${startY}vh)`;

      const container = document.querySelector('.stars-container');
      if (container) {
        container.appendChild(star);
        star.addEventListener('animationend', () => {
          if (mounted && star.parentNode) {
            star.remove();
          }
        });
      }
    };

    // Create initial stars
    for (let i = 0; i < 3; i++) {
      setTimeout(() => createShootingStar(), i * 1000);
    }

    const interval = setInterval(createShootingStar, 4000);

    return () => {
      mounted = false;
      clearInterval(interval);
      document.querySelectorAll('.shooting-star').forEach((star) => star.remove());
    };
  }, []);

  return (
    <div className="cosmic-background">
      <div className="stars-container" />
      <Aurora />
    </div>
  );
};

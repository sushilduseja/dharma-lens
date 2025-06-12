
'use client';

import { useEffect, useState } from 'react';

export function CosmicBackground() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div style={{ position: 'fixed', inset: 0, zIndex: -10, backgroundColor: 'hsl(var(--background))' }} />;
  }

  const numStars = 120;
  const stars = Array.from({ length: numStars }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: `${Math.random() * 1.5 + 0.8}px`,
    animationDuration: `${Math.random() * 5 + 3}s`,
    animationDelay: `${Math.random() * 6}s`,
    opacity: Math.random() * 0.6 + 0.5, 
  }));

  const numShootingStars = 5;
  const shootingStarsData = Array.from({ length: numShootingStars }).map((_, i) => ({
    id: 'shooting-' + i,
    left: `${Math.random() * 100 - 10}%`,
    top: `${Math.random() * 70 + 15}%`,
    animationDuration: `${Math.random() * 3 + 2}s`,
    animationDelay: `${Math.random() * 20 + 5}s`,
  }));

  const nebulaColor1 = 'hsla(var(--primary-hsl), var(--primary-s), var(--primary-l), 0.12)';
  const nebulaColor2 = 'hsla(var(--accent-hsl), var(--accent-s), var(--accent-l), 0.1)';
  const nebulaColor3 = 'hsla(var(--secondary-hsl), var(--secondary-s), var(--secondary-l), 0.11)';

  const nebulaBackgroundImage = `
    radial-gradient(ellipse at 20% 30%, ${nebulaColor1} 0%, transparent 40%),
    radial-gradient(ellipse at 75% 25%, ${nebulaColor2} 0%, transparent 40%),
    radial-gradient(ellipse at 55% 70%, ${nebulaColor3} 0%, transparent 50%),
    radial-gradient(ellipse at 35% 85%, ${nebulaColor1} 0%, transparent 50%)
  `;

  return (
    <>
      <style jsx global>{`
        :root { 
          --primary-hsl: 175; --primary-s: 70%; --primary-l: 45%;
          --accent-hsl: 150;  --accent-s: 60%;  --accent-l: 60%;
          --secondary-hsl: 170;--secondary-s: 40%;--secondary-l: 90%;
        }
        .dark {
          --primary-hsl: 175; --primary-s: 75%; --primary-l: 55%;
          --accent-hsl: 150;  --accent-s: 65%;  --accent-l: 65%;
          --secondary-hsl: 220;--secondary-s: 25%;--secondary-l: 20%;
        }

        @keyframes move-nebula {
          0% {
            transform: translate(0, 0) scale(1.1);
            opacity: 0.7;
          }
          50% {
            transform: translate(10vw, 5vh) scale(1.3);
            opacity: 0.9;
          }
          100% {
            transform: translate(0, 0) scale(1.1);
            opacity: 0.7;
          }
        }
        @keyframes twinkle-star {
          0%, 100% { 
            opacity: var(--star-opacity); 
            transform: scale(1); 
          }
          50% { 
            opacity: calc(var(--star-opacity) + 0.4);
            transform: scale(1.3); 
          }
        }
        @keyframes shooting-star-anim {
          0% {
            transform: translateX(0) translateY(0) scaleX(0.8) rotate(325deg);
            opacity: 0;
          }
          5% { 
            opacity: 0.8;
          }
          80% { 
            opacity: 0.8;
          }
          100% { 
            transform: translateX(800px) translateY(-400px) scaleX(2.5) rotate(325deg); 
            opacity: 0;
          }
        }
      `}</style>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: -10,
          backgroundColor: 'hsl(var(--background))', 
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: '-50%',
            backgroundImage: nebulaBackgroundImage,
            animation: 'move-nebula 35s infinite linear alternate',
            willChange: 'transform, opacity',
            mixBlendMode: 'soft-light',
          }}
        />
        {stars.map(star => (
          <div
            key={star.id}
            style={{
              position: 'absolute',
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              backgroundColor: 'hsla(0, 0%, 100%, 0.8)', 
              borderRadius: '50%',
              boxShadow: `0 0 ${parseFloat(star.size) * 4}px ${parseFloat(star.size) * 2}px hsla(0, 0%, 100%, 0.4)`,
              animation: `twinkle-star ${star.animationDuration} infinite ease-in-out`,
              animationDelay: star.animationDelay,
              // @ts-ignore
              ['--star-opacity']: star.opacity,
              opacity: star.opacity, 
              willChange: 'opacity, transform',
            }}
          />
        ))}
        {shootingStarsData.map(star => (
            <div key={star.id}
             style={{
                position: 'absolute',
                left: star.left,
                top: star.top,
                width: '90px', 
                height: '2px', // Slightly increased height
                background: `linear-gradient(to right, rgba(0, 0, 0, 0.07), transparent)`, // Subtle black gradient
                borderRadius: '50%',
                opacity: 0,
                animation: `shooting-star-anim ${star.animationDuration} infinite ease-out`,
                animationDelay: star.animationDelay,
                willChange: 'transform, opacity',
             }}
            />
        ))}
      </div>
    </>
  );
}

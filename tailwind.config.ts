
import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'], // Ensuring dark mode is class-based
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        body: ['Literata', 'serif'],
        headline: ['Literata', 'serif'], 
        code: ['monospace'],
        devanagari: ['Noto Sans Devanagari', 'Literata', 'serif'], 
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: {
          DEFAULT: 'hsl(var(--input))',
          border: 'hsl(var(--input-border))',
        },
        ring: 'hsl(var(--ring))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: { 
        'sm': '0 1px 2px 0 hsl(var(--foreground) / 0.03)',
        'DEFAULT': '0 1px 3px 0 hsl(var(--foreground) / 0.05), 0 1px 2px -1px hsl(var(--foreground) / 0.05)',
        'md': '0 4px 6px -1px hsl(var(--foreground) / 0.05), 0 2px 4px -2px hsl(var(--foreground) / 0.05)',
        'lg': '0 10px 15px -3px hsl(var(--foreground) / 0.05), 0 4px 6px -4px hsl(var(--foreground) / 0.05)',
        'xl': '0 20px 25px -5px hsl(var(--foreground) / 0.07), 0 8px 10px -6px hsl(var(--foreground) / 0.07)',
        '2xl': '0 25px 50px -12px hsl(var(--foreground) / 0.15)',
        'inner': 'inset 0 2px 4px 0 hsl(var(--foreground) / 0.03)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' }, 
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'subtle-pulse-keyframes': { 
          '0%, 100%': { 
            boxShadow: '0 0 12px hsl(var(--primary) / 0.2), 0 0 24px hsl(var(--primary) / 0.1)',
            transform: 'scale(1)' 
          },
          '50%': { 
            boxShadow: '0 0 18px hsl(var(--primary) / 0.3), 0 0 30px hsl(var(--primary) / 0.15)',
            transform: 'scale(1.015)'
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in-up': 'fade-in-up 0.4s ease-out forwards', 
        'button-subtle-pulse': 'subtle-pulse-keyframes 3s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;

    
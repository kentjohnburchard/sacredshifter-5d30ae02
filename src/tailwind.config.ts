
import { type Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  safelist: [
    // Critical sidebar classes that must be preserved in production
    'text-white',
    '!text-white',
    'font-bold',
    'font-medium',
    'opacity-100',
    '!opacity-100',
    'bg-purple-700/80',
    'bg-pink-700/80',
    'hover:text-white',
    'hover:!text-white',
    'hover:bg-purple-800/70',
    'hover:bg-pink-800/70',
    'h-full',
    'w-20',
    'w-64',
    'translate-x-0',
    '-translate-x-full',
    '!visible',
    'z-40',
    'z-50',
    'flex',
    'hidden',
    'sm:flex',
    'items-center',
    'justify-center',
    'py-2',
    'px-3',
    'text-sm',
    'rounded-md',
    'transition-colors',
    'h-5',
    'w-5',
    'mr-3',
    'ml-auto',
    'inset-0',
    'bg-[#9966FF]/20',
    'hover:bg-[#9966FF]/15',
    'group-hover',
    // Add veil-lifted related classes
    'veil-lifted',
    'bg-pink-900/30',
    'border-pink-500/30',
    'bg-pink-500/10',
    'bg-purple-500/10',
    'bg-indigo-500/5',
    'text-pink-200',
    'text-pink-300',
    'text-pink-100',
    'from-pink-500/5',
    'to-purple-500/5',
    'via-purple-500/2',
    // Add sacred glyph classes
    'animate-spin-slow',
    'animate-pulse-slow',
    'animate-glow',
    'bg-gradient-radial',
    'from-indigo-400',
    'via-purple-500',
    'to-fuchsia-600'
  ],
  prefix: "",
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
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
        playfair: ["Playfair Display", "serif"],
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 8s linear infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
        "ripple": "ripple 1s ease-out"
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "glow": {
          "0%": { filter: "brightness(0.9) drop-shadow(0 0 2px rgba(147, 51, 234, 0.5))" },
          "100%": { filter: "brightness(1.1) drop-shadow(0 0 8px rgba(147, 51, 234, 0.8))" }
        },
        "ripple": {
          "0%": { transform: "scale(0.95)", opacity: "1" },
          "100%": { transform: "scale(1.5)", opacity: "0" }
        }
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Adding custom brand colors
        brand: {
          purple: "hsl(var(--brand-purple))",
          blue: "hsl(var(--brand-blue))",
          aurapink: "hsl(var(--brand-aurapink))"
        },
        cosmic: {
          indigo: "hsl(var(--cosmic-indigo))",
          blue: "hsl(var(--cosmic-blue))",
          violet: "hsl(var(--cosmic-violet))"
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

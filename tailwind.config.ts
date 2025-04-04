
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif'],
				modern: ['Inter', 'system-ui', 'sans-serif'],
				segoe: ['Inter', 'system-ui', 'sans-serif'],
				playfair: ['Playfair Display', 'serif'],
				lora: ['Lora', 'serif'],
				cormorant: ['Cormorant Garamond', 'serif'],
				quicksand: ['Quicksand', 'sans-serif'],
				raleway: ['Raleway', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				brand: {
					purple: '#9b30ff', // The purple color from the logo
					dark: '#333333',
					light: '#ffffff',
					lavender: '#bf99ff', // Lavender purple from the palette
					amythyst: '#9966FF', // Amythyst purple from the palette
					deep: '#361bb3', // Deep purple from the palette
					chakra: '#7510c9', // Charkra purple from the palette
					balancing1: '#4d00ff', // Balancing purple 1 from the palette
					balancing2: '#800080',  // Balancing purple 2 from the palette
					sapphire: '#0F52BA',   // Sapphire blue
					aurapink: '#FF77FF',   // Aura pink
					softgold: '#D4AF37',   // Soft gold
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'pulse-subtle': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.7' }
				},
				'fade-in': {
					from: { opacity: '0' },
					to: { opacity: '1' }
				},
				'fade-out': {
					from: { opacity: '1' },
					to: { opacity: '0' }
				},
				'slide-up': {
					from: { transform: 'translateY(10px)', opacity: '0' },
					to: { transform: 'translateY(0)', opacity: '1' }
				},
				'slide-down': {
					from: { transform: 'translateY(-10px)', opacity: '0' },
					to: { transform: 'translateY(0)', opacity: '1' }
				},
				'music-bars': {
					'0%': { height: '10%' },
					'50%': { height: '80%' },
					'100%': { height: '10%' }
				},
				'shimmer': {
					'0%': { 'background-position': '0% 50%' },
					'50%': { 'background-position': '100% 50%' },
					'100%': { 'background-position': '0% 50%' }
				},
				'twinkle': {
					'0%, 100%': { opacity: '0.6' },
					'50%': { opacity: '1' }
				},
				'cosmic-pulse': {
					'0%, 100%': { transform: 'scale(1)', 'box-shadow': '0 0 0 0 rgba(155, 48, 255, 0.2)' },
					'50%': { transform: 'scale(1.03)', 'box-shadow': '0 0 0 10px rgba(155, 48, 255, 0)' }
				},
				'gentle-wave': {
					'0%': { transform: 'translateY(0) translateX(0)' },
					'50%': { transform: 'translateY(-5px) translateX(5px)' },
					'100%': { transform: 'translateY(0) translateX(0)' }
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-subtle': 'pulse-subtle 2s infinite ease-in-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'fade-out': 'fade-out 0.3s ease-out',
				'slide-up': 'slide-up 0.4s ease-out',
				'slide-down': 'slide-down 0.4s ease-out',
				'music-bar-1': 'music-bars 1.2s ease-in-out infinite',
				'music-bar-2': 'music-bars 1.7s ease-in-out infinite 0.2s',
				'music-bar-3': 'music-bars 1.5s ease-in-out infinite 0.4s',
				'music-bar-4': 'music-bars 1.3s ease-in-out infinite 0.6s',
				'shimmer': 'shimmer 3s infinite linear',
				'twinkle': 'twinkle 2s infinite ease-in-out',
				'cosmic-pulse': 'cosmic-pulse 2s infinite ease-in-out',
				'gentle-wave': 'gentle-wave 3s infinite ease-in-out',
			},
			backgroundImage: {
				'cosmic-gradient': 'linear-gradient(to bottom, #2c1a4d, #0c0524)',
				'twilight-gradient': 'linear-gradient(135deg, #614385 0%, #516395 100%)',
				'violet-sapphire': 'linear-gradient(135deg, #9b30ff 0%, #0F52BA 100%)',
				'mystical-glow': 'radial-gradient(circle, rgba(155,48,255,0.15) 0%, rgba(15,82,186,0.05) 70%, rgba(0,0,0,0) 100%)'
			},
			boxShadow: {
				'inner-glow': 'inset 0 0 10px rgba(155, 48, 255, 0.3)',
				'cosmic': '0 0 15px rgba(155, 48, 255, 0.5)',
				'mystic': '0 5px 15px rgba(15, 82, 186, 0.3)'
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

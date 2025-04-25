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
				sans: [
					"Inter",
					"ui-sans-serif",
					"system-ui",
					"sans-serif",
					"Apple Color Emoji",
					"Segoe UI Emoji",
					"Segoe UI Symbol",
					"Noto Color Emoji",
				],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: {
					DEFAULT: '#020122',
				},
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
				// Color palette definitions
				'bright-orange': {
					DEFAULT: '#F18F01',
					50: '#FFF1DE',
					100: '#FFE6C6',
					200: '#FFD096',
					300: '#FFBB66',
					400: '#FFA636',
					500: '#F18F01',
					600: '#CE7A01',
					700: '#AB6501',
					800: '#884F01',
					900: '#653A00',
					950: '#482900',
				},
				'deep-blue': {
					DEFAULT: '#020122',
					50: '#E6E6F0',
					100: '#CDCDE1',
					200: '#9A9AC2',
					300: '#6768A4',
					400: '#3E3F73',
					500: '#020122',
					600: '#02011F',
					700: '#01011C',
					800: '#010118',
					900: '#010115',
					950: '#000113',
				},
				'clean-white': {
					DEFAULT: '#FBFEFB',
					50: '#FFFFFF',
					100: '#FFFFFF',
					200: '#FFFFFF',
					300: '#FFFFFF',
					400: '#FEFFFC',
					500: '#FBFEFB',
					600: '#E1FEE1',
					700: '#C8FDC8',
					800: '#AEFCAE',
					900: '#94FB94',
					950: '#87FB87',
				},
				'soft-peach': {
					DEFAULT: '#FDE1D3',
					50: '#FEF1DE',
					100: '#FFECD1',
					200: '#FFE6C6',
					300: '#FFD6B0',
					400: '#FFC394',
					500: '#FFAB6A',
					600: '#FF9340',
					700: '#FF7A16',
					800: '#E66A00',
					900: '#CC5A00'
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
				'fade-in': {
					from: { opacity: '0' },
					to: { opacity: '1' }
				},
				'fade-out': {
					from: { opacity: '1' },
					to: { opacity: '0' }
				},
				'scale-in': {
					from: { transform: 'scale(0.95)', opacity: '0' },
					to: { transform: 'scale(1)', opacity: '1' }
				},
				'scale-out': {
					from: { transform: 'scale(1)', opacity: '1' },
					to: { transform: 'scale(0.95)', opacity: '0' }
				},
				'slide-in': {
					from: { transform: 'translateY(20px)', opacity: '0' },
					to: { transform: 'translateY(0)', opacity: '1' }
				},
				'slide-in-right': {
					from: { transform: 'translateX(20px)', opacity: '0' },
					to: { transform: 'translateX(0)', opacity: '1' }
				},
				'pulse': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.7' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'glow': {
					'0%, 100%': { boxShadow: '0 0 5px rgba(241, 143, 1, 0.5)' },
					'50%': { boxShadow: '0 0 20px rgba(241, 143, 1, 0.8)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'fade-out': 'fade-out 0.3s ease-out',
				'scale-in': 'scale-in 0.3s ease-out',
				'scale-out': 'scale-out 0.2s ease-out',
				'slide-in': 'slide-in 0.4s ease-out',
				'slide-in-right': 'slide-in-right 0.3s ease-out',
				'pulse': 'pulse 3s infinite ease-in-out',
				'float': 'float 4s infinite ease-in-out',
				'glow': 'glow 2s infinite ease-in-out',
				'enter': 'fade-in 0.3s ease-out, scale-in 0.2s ease-out',
				'exit': 'fade-out 0.3s ease-out, scale-out 0.2s ease-out',
				'hover-float': 'float 2s infinite ease-in-out'
			}
		}
	},
	plugins: [
		require("tailwindcss-animate"),
		function({ addBase }: { addBase: Function }) {
			addBase({
				'html': { scrollBehavior: 'smooth' },
				':root': {
					'--font-sans': '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
				},
				'.text-gradient': {
					backgroundClip: 'text',
					'-webkit-background-clip': 'text',
					'-webkit-text-fill-color': 'transparent',
					backgroundImage: 'linear-gradient(90deg, #F18F01, #FFD096)',
				},
				'.shadow-glow': { boxShadow: '0 0 15px rgba(241, 143, 1, 0.5)' },
				'.container-custom': {
					width: '100%',
					maxWidth: '1200px',
					marginLeft: 'auto',
					marginRight: 'auto',
					paddingLeft: '1rem',
					paddingRight: '1rem',
				},
				'.section-padding': {
					paddingTop: '4rem',
					paddingBottom: '4rem',
				},
				'.glass-card': {
					backdropFilter: 'blur(10px)',
					backgroundColor: 'rgba(255, 255, 255, 0.1)',
					borderRadius: '0.5rem',
					border: '1px solid rgba(255, 255, 255, 0.2)',
					boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
				},
			});
		},
	],
} satisfies Config;

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
				watchtower: {
					50: '#f3f1ff',
					100: '#ebe5ff',
					200: '#d9ceff',
					300: '#bea6ff',
					400: '#9f75ff',
					500: '#8446ff',
					600: '#7822ff',
					700: '#6b13f0',
					800: '#5b10c7',
					900: '#4b0fa0',
					950: '#2e0875',
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
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'pulse-shield': {
					'0%, 100%': {
						opacity: '1',
					},
					'50%': {
						opacity: '0.7',
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'slide-in-right': {
					'0%': { transform: 'translateX(100%)' },
					'100%': { transform: 'translateX(0)' }
				},
				'ghost-pulse': {
					'0%, 100%': { opacity: '1', transform: 'scale(1)' },
					'50%': { opacity: '0.7', transform: 'scale(0.95)' },
				},
				'ghost-float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' },
				},
				'glow': {
					'0%, 100%': { boxShadow: '0 0 15px 0 hsl(var(--primary))' },
					'50%': { boxShadow: '0 0 25px 5px hsl(var(--primary))' },
				},
				'scanline': {
					'0%': { transform: 'translateY(0)', opacity: '0.5' },
					'100%': { transform: 'translateY(100%)', opacity: '0' }
				},
				'grid-flow': {
					'0%': { backgroundPosition: '0 0' },
					'100%': { backgroundPosition: '100% 100%' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-shield': 'pulse-shield 2s ease-in-out infinite',
				'fade-in': 'fade-in 0.5s ease-out',
				'slide-in-right': 'slide-in-right 0.3s ease-out',
				'ghost-pulse': 'ghost-pulse 2s ease-in-out infinite',
				'ghost-float': 'ghost-float 3s ease-in-out infinite',
				'glow': 'glow 3s ease-in-out infinite',
				'scanline': 'scanline 4s linear infinite',
				'grid-flow': 'grid-flow 10s linear infinite'
			},
			backgroundImage: {
				'grid-pattern': 'linear-gradient(to right, hsl(var(--primary)/10) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--primary)/10) 1px, transparent 1px)',
				'cyber-gradient': 'linear-gradient(135deg, hsl(var(--primary)/50) 0%, hsl(var(--primary)/5) 100%)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

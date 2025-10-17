/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
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
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			// Dark Theme with Red Branding
  			brand: {
  				red: {
  					DEFAULT: '#EF4444',
  					50: '#FEF2F2',
  					100: '#FEE2E2',
  					200: '#FECACA',
  					300: '#FCA5A5',
  					400: '#F87171',
  					500: '#EF4444',
  					600: '#DC2626',
  					700: '#B91C1C',
  					800: '#991B1B',
  					900: '#7F1D1D',
  					glow: '#FF5555',
  				},
  				dark: {
  					DEFAULT: '#0A0A0A',
  					50: '#F9FAFB',
  					100: '#F3F4F6',
  					200: '#E5E7EB',
  					300: '#D1D5DB',
  					400: '#9CA3AF',
  					500: '#6B7280',
  					600: '#4B5563',
  					700: '#374151',
  					800: '#1F2937',
  					850: '#111827',
  					900: '#0F1419',
  					950: '#0A0A0A',
  				},
  				accent: {
  					DEFAULT: '#8B5CF6',
  					pink: '#EC4899',
  					cyan: '#06B6D4',
  					orange: '#F97316',
  				}
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
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [],
};

import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
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
  			'btn-background': '#6366f1',
  			'btn-background-hover': '#4f46e5',
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
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		},
  		typography: {
  			DEFAULT: {
  				css: {
  					maxWidth: '65ch',
  					color: 'inherit',
  					a: {
  						color: 'inherit',
  						textDecoration: 'underline',
  						fontWeight: '500',
  					},
  					'[class~="lead"]': {
  						color: 'inherit',
  					},
  					strong: {
  						color: 'inherit',
  					},
  					'ul > li::before': {
  						backgroundColor: 'currentColor',
  					},
  					hr: {
  						borderColor: 'currentColor',
  						opacity: 0.3,
  					},
  					blockquote: {
  						color: 'inherit',
  						borderLeftColor: 'currentColor',
  					},
  					h1: {
  						color: 'inherit',
  					},
  					h2: {
  						color: 'inherit',
  					},
  					h3: {
  						color: 'inherit',
  					},
  					h4: {
  						color: 'inherit',
  					},
  					code: {
  						color: 'inherit',
  					},
  					'pre code': {
  						backgroundColor: 'transparent',
  						color: 'inherit',
  					},
  					pre: {
  						backgroundColor: 'rgb(var(--muted))',
  						color: 'inherit',
  					},
  					thead: {
  						color: 'inherit',
  						borderBottomColor: 'currentColor',
  					},
  					'tbody tr': {
  						borderBottomColor: 'currentColor',
  					},
  				},
  			},
  		},
  	}
  },
  plugins: [
    require('@tailwindcss/typography'),
    require("tailwindcss-animate")
  ],
} satisfies Config

export default config
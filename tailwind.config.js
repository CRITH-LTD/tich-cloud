/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Your existing Atlassian colors
        "atlassian-indigo": "#253858",
        "atlassian-blue": "#0052CC",
        "atlassian-lightBlue": "#4C9AFF",
        
        // Modern Academic color palette
        academic: {
          // Primary brand colors
          primary: "#1e40af",        // Deep blue
          secondary: "#0f172a",      // Slate gray
          
          // Neutral grays
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          
          // Accent colors
          accent: "#3b82f6",         // Bright blue
          success: "#059669",        // Emerald
          warning: "#d97706",        // Amber
          error: "#dc2626",          // Red
          
          // Text colors
          text: {
            primary: "#1e293b",      // Dark slate
            secondary: "#475569",    // Medium slate
            muted: "#64748b",        // Light slate
            inverse: "#f8fafc",      // Light
          },
          
          // Background colors
          bg: {
            primary: "#ffffff",      // White
            secondary: "#f8fafc",    // Very light gray
            tertiary: "#f1f5f9",     // Light gray
            dark: "#0f172a",         // Dark slate
          }
        }
      },
      fontFamily: {
        // Modern Academic font stack
        sans: ['Poppins', 'Georgia', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        serif: ['Source Serif Pro', 'ui-serif', 'Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
      },
      fontSize: {
        // Academic typography scale
        'xs': ['0.75rem', { lineHeight: '1.5' }],
        'sm': ['0.875rem', { lineHeight: '1.5' }],
        'base': ['1rem', { lineHeight: '1.6' }],
        'lg': ['1.125rem', { lineHeight: '1.6' }],
        'xl': ['1.25rem', { lineHeight: '1.5' }],
        '2xl': ['1.5rem', { lineHeight: '1.4' }],
        '3xl': ['1.875rem', { lineHeight: '1.3' }],
        '4xl': ['2.25rem', { lineHeight: '1.2' }],
        '5xl': ['3rem', { lineHeight: '1.1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      fontWeight: {
        'light': '300',
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
        'extrabold': '800',
      },
      spacing: {
        // Additional spacing for academic layouts
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      maxWidth: {
        // Reading-optimized widths
        'reading': '65ch',         // Optimal reading width
        'prose': '75ch',           // Prose width
        'article': '45rem',        // Article width
      },
      boxShadow: {
        // Academic-appropriate shadows
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'paper': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        // Consistent border radius
        'none': '0',
        'sm': '0.125rem',
        'default': '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      animation: {
        // Subtle animations for academic sites
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    // You can add these plugins for enhanced typography and forms
    // require('@tailwindcss/typography'),
    // require('@tailwindcss/forms'),
  ],
}
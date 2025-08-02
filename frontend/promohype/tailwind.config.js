/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        // Professional color palette
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        success: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'enterprise': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'enterprise-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'enterprise-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'enterprise-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'inner-enterprise': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'shimmer': 'shimmer 1.5s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounceSubtle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { 
            opacity: '0',
            transform: 'translateY(20px)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
        scaleIn: {
          '0%': { 
            opacity: '0',
            transform: 'scale(0.95)'
          },
          '100%': { 
            opacity: '1',
            transform: 'scale(1)'
          },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        bounceSubtle: {
          '0%, 100%': {
            transform: 'translateY(-2%)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
          },
          '50%': {
            transform: 'none',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
          },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      letterSpacing: {
        'extra-wide': '0.1em',
      },
      lineHeight: {
        'extra-tight': '1.1',
        'extra-loose': '2',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      minHeight: {
        '0': '0',
        '1/4': '25%',
        '1/2': '50%',
        '3/4': '75%',
        'full': '100%',
        'screen': '100vh',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      // Custom gradients
      backgroundImage: {
        'gradient-professional': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-enterprise': 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
        'gradient-success': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        'gradient-shimmer': 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
      },
      // Grid template columns for complex layouts
      gridTemplateColumns: {
        'enterprise': 'minmax(280px, 1fr)',
        'dashboard': '280px 1fr',
        'sidebar': '240px 1fr',
      },
      // Custom screen sizes
      screens: {
        'xs': '475px',
        '3xl': '1600px',
      },
    },
  },
  plugins: [
    // Custom plugin para classes utilitárias profissionais
    function({ addUtilities, theme }) {
      const newUtilities = {
        '.text-balance': {
          'text-wrap': 'balance',
        },
        '.bg-dot-pattern': {
          'background-image': 'radial-gradient(circle, rgba(0,0,0,0.1) 1px, transparent 1px)',
          'background-size': '20px 20px',
        },
        '.backdrop-blur-enterprise': {
          'backdrop-filter': 'blur(8px)',
          '-webkit-backdrop-filter': 'blur(8px)',
        },
        '.card-enterprise': {
          'background': 'white',
          'border': '1px solid #e5e7eb',
          'border-radius': '0.75rem',
          'box-shadow': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          'transition': 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        '.card-enterprise:hover': {
          'box-shadow': '0 4px 12px 0 rgba(0, 0, 0, 0.15)',
          'border-color': '#d1d5db',
        },
        '.btn-enterprise': {
          'display': 'inline-flex',
          'align-items': 'center',
          'gap': '0.5rem',
          'padding': '0.75rem 1.5rem',
          'border-radius': '0.5rem',
          'font-weight': '600',
          'font-size': '0.875rem',
          'transition': 'all 0.2s ease',
          'cursor': 'pointer',
        },
        '.btn-enterprise-primary': {
          'background': '#2563eb',
          'color': 'white',
          'border': 'none',
        },
        '.btn-enterprise-primary:hover': {
          'background': '#1d4ed8',
          'transform': 'translateY(-1px)',
          'box-shadow': '0 4px 8px rgba(37, 99, 235, 0.3)',
        },
        '.btn-enterprise-secondary': {
          'background': 'white',
          'color': '#374151',
          'border': '1px solid #d1d5db',
        },
        '.btn-enterprise-secondary:hover': {
          'background': '#f9fafb',
          'border-color': '#9ca3af',
        },
        '.form-enterprise': {
          'width': '100%',
          'padding': '0.75rem 1rem',
          'border': '1px solid #d1d5db',
          'border-radius': '0.5rem',
          'font-size': '0.875rem',
          'transition': 'all 0.2s ease',
          'background': 'white',
        },
        '.form-enterprise:focus': {
          'outline': 'none',
          'border-color': '#2563eb',
          'box-shadow': '0 0 0 3px rgba(37, 99, 235, 0.1)',
        },
        '.skeleton-enterprise': {
          'background': 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
          'background-size': '200% 100%',
          'animation': 'shimmer 1.5s infinite',
          'border-radius': '0.25rem',
        },
      };
      
      addUtilities(newUtilities);
    },
  ],
}
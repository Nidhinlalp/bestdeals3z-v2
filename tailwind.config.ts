import type { Config } from 'tailwindcss'

/**
 * Design tokens — light ecommerce theme.
 * White canvas, near-black display type, M-tricolor used only as a brand accent.
 */
export default <Partial<Config>>{
  content: [
    './app/**/*.{vue,js,ts}',
    './content/**/*.md',
  ],
  darkMode: 'class',
  theme: {
    // Mirror the design system's max content width (~1440px).
    container: {
      center: true,
      padding: { DEFAULT: '1rem', md: '1.5rem', lg: '2.5rem' },
      screens: { '2xl': '1440px' },
    },
    extend: {
      colors: {
        // Brand & text — light theme: near-black ink on a white canvas.
        primary: '#0a0a0a',
        ink: '#0a0a0a',
        'on-dark': '#1a1a1a',
        'on-primary': '#ffffff',
        body: '#525252',
        'body-strong': '#1a1a1a',
        muted: '#6e6e6e',
        // Hairlines
        hairline: '#e4e4e4',
        'hairline-strong': '#d4d4d4',
        // Surfaces
        canvas: '#ffffff',
        'surface-soft': '#f7f7f7',
        'surface-card': '#f4f4f4',
        'surface-elevated': '#ececec',
        'carbon-gray': '#e8e8e8',
        // M tricolor (brand-identity accent only — never a CTA fill)
        'm-blue-light': '#0066b1',
        'm-blue-dark': '#1c69d4',
        'm-red': '#e22718',
        'bmw-blue': '#1c69d4',
        'electric-blue': '#0653b6',
        // Semantic
        warning: '#b45309',
        success: '#0f9d34',
      },
      fontFamily: {
        // BMW Type Next Latin substitute per the design doc.
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['80px', { lineHeight: '1', letterSpacing: '-0.5px', fontWeight: '700' }],
        'display-lg': ['56px', { lineHeight: '1.05', letterSpacing: '-0.5px', fontWeight: '700' }],
        'display-md': ['40px', { lineHeight: '1.1', letterSpacing: '-0.5px', fontWeight: '700' }],
        'display-sm': ['32px', { lineHeight: '1.15', letterSpacing: '0', fontWeight: '700' }],
        'title-lg': ['24px', { lineHeight: '1.3', fontWeight: '700' }],
        'title-md': ['20px', { lineHeight: '1.4', fontWeight: '400' }],
        'title-sm': ['18px', { lineHeight: '1.4', fontWeight: '400' }],
        'label-uppercase': ['14px', { lineHeight: '1.3', letterSpacing: '1.5px', fontWeight: '700' }],
        button: ['14px', { lineHeight: '1', letterSpacing: '1.5px', fontWeight: '700' }],
        'nav-link': ['14px', { lineHeight: '1.4', letterSpacing: '0.5px', fontWeight: '400' }],
        'body-md': ['16px', { lineHeight: '1.5', fontWeight: '300' }],
        'body-sm': ['14px', { lineHeight: '1.5', fontWeight: '300' }],
        caption: ['12px', { lineHeight: '1.4', letterSpacing: '0.5px', fontWeight: '400' }],
      },
      spacing: {
        xxs: '4px',
        xs: '8px',
        sm: '12px',
        md: '16px',
        lg: '24px',
        xl: '40px',
        xxl: '64px',
        section: '96px',
      },
      borderRadius: {
        none: '0px',
        xs: '2px',
        sm: '4px',
        md: '6px',
        full: '9999px',
      },
      maxWidth: {
        content: '1440px',
      },
      transitionTimingFunction: {
        'm': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out both',
        'slide-up': 'slide-up 0.5s cubic-bezier(0.16,1,0.3,1) both',
      },
    },
  },
  plugins: [],
}

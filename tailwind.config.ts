import type { Config } from 'tailwindcss'

// Values below are APPROXIMATE, read off the homepage screenshot.
// Replace with exact hex codes from the Figma file's Inspect panel before
// building any other page — do not treat these as final brand colors.
const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0D3B66',      // primary buttons, links, "Find Your Place" band
          'navy-dark': '#092A4D', // header text, darker headings
          gold: '#C9A227',      // icon circles, accents, "Where it goes" heading
          'gold-light': '#F2C94C', // hero badge pill background
        },
        surface: {
          cream: '#F7F5F0',     // section backgrounds (Join Us, Impact)
          card: '#FFFFFF',
        },
        ink: {
          DEFAULT: '#1F2A37',   // body text
          muted: '#6B7280',     // secondary/meta text
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
      },
      maxWidth: {
        content: '1200px',
      },
      keyframes: {
        'nav-progress': {
          '0%': { transform: 'translateX(-100%)' },
          '50%': { transform: 'translateX(50%)' },
          '100%': { transform: 'translateX(300%)' },
        },
      },
      animation: {
        'nav-progress': 'nav-progress 1s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config

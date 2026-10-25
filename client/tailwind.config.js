/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        warm: {
          bg: '#F8F7F4',             // Warm off-white / linen background
          surface: '#FFFFFF',        // Soft clean white surface
          surfaceRaised: '#F2F0EB',  // Subtle inputs, active rows, chips
          border: '#E2DFD8',         // Subtle warm gray border
          borderHover: '#C9C5BC',
          text: '#1C1E24',           // Dark charcoal text
          muted: '#5C616B',          // Warm gray secondary text
          dim: '#8E94A0',            // Tertiary text
          accent: '#D96726',         // Warm terracotta/amber
          accentHover: '#BF561A',
          accentSubtle: '#FDF2EA',   // Soft terracotta wash
          codeBg: '#F3F1EB',         // Warm editor canvas
          codeBorder: '#DFDCD4',
        },
        darkWarm: {
          bg: '#18191D',             // Warm deep charcoal (not pure #000000)
          surface: '#212328',        // Slightly lighter warm charcoal surface
          surfaceRaised: '#292B32',  // Subtle inputs, active rows, chips
          border: '#32353E',         // Subtle warm gray border (no harsh white lines)
          borderHover: '#444853',
          text: '#EAE7E3',           // Warm off-white text
          muted: '#9CA0AA',          // Warm gray secondary text
          dim: '#6E737E',            // Tertiary text
          accent: '#E58537',         // Muted warm amber
          accentHover: '#F09348',
          accentSubtle: 'rgba(229, 133, 55, 0.15)', // Muted amber wash
          codeBg: '#141518',         // Deep muted charcoal editor canvas
          codeBorder: '#292B32',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '6px',
        sm: '4px',
        md: '6px',
        lg: '8px',
        xl: '10px',
      },
    },
  },
  plugins: [],
}

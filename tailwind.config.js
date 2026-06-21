/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Deep Slate Blue Dark Theme colors
        nocBg: '#080C14',
        nocSurface: '#0E1726',
        nocBorder: '#1C293E',
        
        // Light Theme colors from design reference
        refBg: '#FAF9F6',
        refSurface: '#FFFFFF',
        refBorder: '#E3E0D8',
        refBorderStrong: '#CFCBC0',

        // Systemic status colors
        clear: {
          dark: '#10B981',
          light: '#3A7A5E',
          bgLight: '#EDF5F0',
          bgDark: '#0E2E25',
        },
        watch: {
          dark: '#F59E0B',
          light: '#9C6B12',
          bgLight: '#FBF3E3',
          bgDark: '#332308',
        },
        breach: {
          dark: '#EF4444',
          light: '#A23B3B',
          bgLight: '#FAEDEC',
          bgDark: '#351618',
        },
        accent: {
          dark: '#3B82F6',
          light: '#1F3A5F',
          bgLight: '#EEF2F6',
          bgDark: '#122543',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        space: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      }
    },
  },
  plugins: [],
}

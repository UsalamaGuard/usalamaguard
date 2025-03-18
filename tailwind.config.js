/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // Ensure this includes your Navbar file
  ],
  theme: {
    extend: {
      colors: {
        "space-black": "#0A0A0B",
        "stellar-white": "#F5F6F5",
        "midnight-blue": "#1A2533",
        "nebula-blue": "#4B5EAA",
        "glow-cyan": "#00D4FF",
        "cosmic-purple": "#8B5CF6",
        "dark-matter": "#2D1B3F",
      },
      backgroundImage: {
        "cosmic-gradient": "linear-gradient(135deg, #00D4FF, #8B5CF6)",
        "nebula-gradient": "linear-gradient(90deg, #4B5EAA, #2D1B3F)",
        "glow-gradient": "radial-gradient(circle, #00D4FF 0%, #0A0A0B 70%)",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Orbitron", "sans-serif"],
      },
      boxShadow: {
        "glow-md": "0 0 15px rgba(0, 212, 255, 0.5)",
        "glow-lg": "0 0 25px rgba(0, 212, 255, 0.7)",
        neumorphic: "8px 8px 16px #0A0A0B, -8px -8px 16px #1A2533",
        inner: "inset 0 2px 4px rgba(139, 92, 246, 0.3)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
      transitionProperty: {
        all: "all",
      },
      transitionDuration: {
        300: "300ms",
      },
    },
  },
  plugins: [],
};
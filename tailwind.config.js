/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // Already includes Navbar file
  ],
  theme: {
    extend: {
      colors: {
        "space-black": "var(--space-black)",
        "stellar-white": "var(--stellar-white)",
        "midnight-blue": "var(--midnight-blue)",
        "nebula-blue": "var(--nebula-blue)",
        "glow-cyan": "var(--glow-cyan)",
        "cosmic-purple": "var(--cosmic-purple)",
        "dark-matter": "var(--dark-matter)",
        background: "var(--background)", // Added for theme-aware background
        text: "var(--text)", // Added for theme-aware text
        "card-bg": "var(--card-bg)", // Added for theme-aware card background
      },
      backgroundImage: {
        "cosmic-gradient": "linear-gradient(135deg, var(--glow-cyan), var(--cosmic-purple))",
        "nebula-gradient": "linear-gradient(90deg, var(--nebula-blue), var(--dark-matter))",
        "glow-gradient": "radial-gradient(circle, var(--glow-cyan) 0%, var(--space-black) 70%)",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Orbitron", "sans-serif"],
      },
      boxShadow: {
        "glow-md": "0 0 15px var(--shadow-glow)", // Updated to use variable
        "glow-lg": "0 0 25px var(--shadow-glow)", // Updated to use variable
        "neumorphic": "8px 8px 16px var(--space-black), -8px -8px 16px var(--midnight-blue)", // Updated with variables
        "inner-glow": "inset 0 0 10px rgba(139, 92, 246, 0.3)", // Unchanged, static for now
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
      borderWidth: {
        2: "2px", // Already supported, ensures border-2 works
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
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Custom Colors
      colors: {
        "space-black": "#0A0A0B", // Deep, near-black background
        "stellar-white": "#F5F6F5", // Slightly off-white for text
        "midnight-blue": "#1A2533", // Dark accent for cards
        "nebula-blue": "#4B5EAA", // Cool, futuristic blue
        "glow-cyan": "#00D4FF", // Neon cyan for highlights
        "cosmic-purple": "#8B5CF6", // Vibrant purple for gradients
        "dark-matter": "#2D1B3F", // Subtle dark purple accent
      },
      // Gradients
      backgroundImage: {
        "cosmic-gradient": "linear-gradient(135deg, #00D4FF, #8B5CF6)", // Cyan to purple
        "nebula-gradient": "linear-gradient(90deg, #4B5EAA, #2D1B3F)", // Blue to dark purple
        "glow-gradient": "radial-gradient(circle, #00D4FF 0%, #0A0A0B 70%)", // Neon glow effect
      },
      // Fonts
      fontFamily: {
        sans: ["Inter", "sans-serif"], // Clean, modern font
        display: ["Orbitron", "sans-serif"], // Futuristic, techy font
      },
      // Shadows for Glow and Depth
      boxShadow: {
        "glow-md": "0 0 15px rgba(0, 212, 255, 0.5)", // Subtle cyan glow
        "glow-lg": "0 0 25px rgba(0, 212, 255, 0.7)", // Stronger glow
        "neumorphic": "8px 8px 16px #0A0A0B, -8px -8px 16px #1A2533", // Soft 3D effect
      },
      // Border Radius for Sleekness
      borderRadius: {
        "xl": "1rem",
        "2xl": "1.5rem",
      },
      // Transitions for Smooth Interactions
      transitionProperty: {
        "all": "all",
      },
      transitionDuration: {
        "300": "300ms",
      },
    },
  },
  plugins: [],
};
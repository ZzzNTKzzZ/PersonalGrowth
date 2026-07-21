/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#22C55E",
        primaryDark: "#16A34A",
        primaryLight: "#DCFCE7",

        secondary: "#3B82F6",

        success: "#22C55E",
        warning: "#F59E0B",
        error: "#EF4444",
        info: "#3B82F6",

        background: "#F8FAFC",
        surface: "#FFFFFF",

        text: {
          primary: "#111827",
          secondary: "#4B5563",
          muted: "#6B7280",
        },

        border: "#E5E7EB",
      },
      boxShadow: {
        sm: "0 1px 2px rgba(0, 0, 0, 0.05), 0 2px 8px rgba(0, 0, 0, 0.04)",
      },
    },
  },
  plugins: [],
}

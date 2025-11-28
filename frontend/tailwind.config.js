export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        yellow: "#FFD400",
        black: "#111111",
        gray: "#f3f4f6",
        muted: "#6b7280"
      },
      boxShadow: {
        card: "0 8px 24px rgba(17,17,17,0.08)"
      }
    }
  }
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        grey: "#f1f5f9",
        customBlue:"#dbeafe"
      },
      fontSize: {
        responsive: "clamp(1rem, 2vw + 1vh, 3rem)", // Adjust the values as needed
      },
      keyframes: {
        alert_transition: {
          "0%": {
            transform: "translateX(-100%)",
          },
          "100%": {
            transform: "translateX(0)",
          },
        },
      },
      animation: {
        alertAnimation: "alert_transition 0.5s ease-out forwards",
      },
    },
  },
  plugins: [],
};

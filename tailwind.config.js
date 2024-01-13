/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#5F35F5",
        theme: "#11175D",
        overlay: "rgba(0, 0, 0, 0.41)",
      },
      fontFamily: {
        open: "Open Sans",
        nun: "Nunito",
        pops: "Poppins",
      },
      boxShadow: {
        tab: "-22px 10px 15px -3px rgba(0,0,0,0.1)",
      },
      backgroundImage: {
        group: "url('./src/assets/socialbg.jpg')",
      },
    },
  },
  plugins: [],
};

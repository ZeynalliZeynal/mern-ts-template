/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      body: ['"Inter"', "sans-serif"],
    },
    extend: {
      fontSize: {
        el: ".8125rem",
      },
      container: {
        center: true,
      },
      colors: {
        border: "hsla(var(--ds-gray-alpha-400))",
        "ui-background": "hsla(var(--ds-background-100))",
        "ui-disabled-foreground": "hsla(var(--ds-gray-800))",
        "ui-item-foreground-hover": "hsla(var(--ds-gray-1000))",
        "ui-item-background-hover": "hsla(var(--ds-gray-200))",
        "button-invert-hover": "hsla(var(--button-invert-hover-dark))",
        "button-invert-disabled": "hsla(var(--button-invert-disabled-dark))",
        foreground: {
          DEFAULT: "hsla(var(--ds-gray-1000))",
        },
        background: {
          100: "hsla(var(--ds-background-100))",
          200: "hsla(var(--ds-background-200))",
        },
        gray: {
          100: "hsla(var(--ds-gray-100))",
          200: "hsla(var(--ds-gray-200))",
          300: "hsla(var(--ds-gray-300))",
          400: "hsla(var(--ds-gray-400))",
          500: "hsla(var(--ds-gray-500))",
          600: "hsla(var(--ds-gray-600))",
          700: "hsla(var(--ds-gray-700))",
          800: "hsla(var(--ds-gray-800))",
          900: "hsla(var(--ds-gray-900))",
          1000: "hsla(var(--ds-gray-1000))",
        },
        "gray-alpha": {
          100: "hsla(var(--ds-gray-alpha-100))",
          200: "hsla(var(--ds-gray-alpha-200))",
          300: "hsla(var(--ds-gray-alpha-300))",
          400: "hsla(var(--ds-gray-alpha-400))",
          500: "hsla(var(--ds-gray-alpha-500))",
          600: "hsla(var(--ds-gray-alpha-600))",
          700: "hsla(var(--ds-gray-alpha-700))",
          800: "hsla(var(--ds-gray-alpha-800))",
          900: "hsla(var(--ds-gray-alpha-900))",
          1000: "hsla(var(--ds-gray-alpha-1000))",
        },
        blue: {
          100: "hsla(var(--ds-blue-100))",
          200: "hsla(var(--ds-blue-200))",
          300: "hsla(var(--ds-blue-300))",
          400: "hsla(var(--ds-blue-400))",
          500: "hsla(var(--ds-blue-500))",
          600: "hsla(var(--ds-blue-600))",
          700: "hsla(var(--ds-blue-700))",
          800: "hsla(var(--ds-blue-800))",
          900: "hsla(var(--ds-blue-900))",
          1000: "hsla(var(--ds-blue-1000))",
        },
        red: {
          100: "hsla(var(--ds-red-100))",
          200: "hsla(var(--ds-red-200))",
          300: "hsla(var(--ds-red-300))",
          400: "hsla(var(--ds-red-400))",
          500: "hsla(var(--ds-red-500))",
          600: "hsla(var(--ds-red-600))",
          700: "hsla(var(--ds-red-700))",
          800: "hsla(var(--ds-red-800))",
          900: "hsla(var(--ds-red-900))",
          1000: "hsla(var(--ds-red-1000))",
        },
        amber: {
          100: "hsla(var(--ds-amber-100))",
          200: "hsla(var(--ds-amber-200))",
          300: "hsla(var(--ds-amber-300))",
          400: "hsla(var(--ds-amber-400))",
          500: "hsla(var(--ds-amber-500))",
          600: "hsla(var(--ds-amber-600))",
          700: "hsla(var(--ds-amber-700))",
          800: "hsla(var(--ds-amber-800))",
          900: "hsla(var(--ds-amber-900))",
          1000: "hsla(var(--ds-amber-1000))",
        },
        green: {
          100: "hsla(var(--ds-green-100))",
          200: "hsla(var(--ds-green-200))",
          300: "hsla(var(--ds-green-300))",
          400: "hsla(var(--ds-green-400))",
          500: "hsla(var(--ds-green-500))",
          600: "hsla(var(--ds-green-600))",
          700: "hsla(var(--ds-green-700))",
          800: "hsla(var(--ds-green-800))",
          900: "hsla(var(--ds-green-900))",
          1000: "hsla(var(--ds-green-1000))",
        },
        teal: {
          100: "hsla(var(--ds-teal-100))",
          200: "hsla(var(--ds-teal-200))",
          300: "hsla(var(--ds-teal-300))",
          400: "hsla(var(--ds-teal-400))",
          500: "hsla(var(--ds-teal-500))",
          600: "hsla(var(--ds-teal-600))",
          700: "hsla(var(--ds-teal-700))",
          800: "hsla(var(--ds-teal-800))",
          900: "hsla(var(--ds-teal-900))",
          1000: "hsla(var(--ds-teal-1000))",
        },
        purple: {
          100: "hsla(var(--ds-purple-100))",
          200: "hsla(var(--ds-purple-200))",
          300: "hsla(var(--ds-purple-300))",
          400: "hsla(var(--ds-purple-400))",
          500: "hsla(var(--ds-purple-500))",
          600: "hsla(var(--ds-purple-600))",
          700: "hsla(var(--ds-purple-700))",
          800: "hsla(var(--ds-purple-800))",
          900: "hsla(var(--ds-purple-900))",
          1000: "hsla(var(--ds-purple-1000))",
        },
        pink: {
          100: "hsla(var(--ds-pink-100))",
          200: "hsla(var(--ds-pink-200))",
          300: "hsla(var(--ds-pink-300))",
          400: "hsla(var(--ds-pink-400))",
          500: "hsla(var(--ds-pink-500))",
          600: "hsla(var(--ds-pink-600))",
          700: "hsla(var(--ds-pink-700))",
          800: "hsla(var(--ds-pink-800))",
          900: "hsla(var(--ds-pink-900))",
          1000: "hsla(var(--ds-pink-1000))",
        },
      },
      borderColor: {
        DEFAULT: "hsla(var(--ds-gray-alpha-400))",
      },
      boxShadow: {
        "header-border": "hsla(var(--header-border))",
        input:
          "0 0 0 1px hsla(var(--ds-gray-alpha-600)), 0 0 0 4px hsla(0,0%,100%,.24)",
        border: "0 0 0 1px hsla(var(--ds-gray-alpha-400))",
      },
      borderRadius: {
        "ui-content": ".375rem",
        "ui-item": ".25rem",
      },
      padding: {
        "ui-content": ".25rem",
        "ui-item": ".375rem .5rem .375rem 2rem",
      },
      margin: ({ theme }) => theme("padding"),
      animation: {
        spinner: "spinner 1.1s linear infinite",
        in: "in 300ms forwards",
        out: "out 300ms forwards",
        fadeIn: "fadeIn 150ms forwards",
        fadeOut: "fadeOut 150ms forwards",
      },
      keyframes: {
        spinner: {
          "0%": {
            opacity: "1",
          },
          "100%": {
            opacity: "0.15",
          },
        },
        in: {
          from: {
            opacity: "0",
          },
          to: {
            opacity: "1",
          },
        },
        out: {
          from: {
            opacity: "1",
          },
          to: {
            opacity: "0",
          },
        },
        fadeIn: {
          from: {
            opacity: "0",
          },
          to: {
            opacity: "1",
          },
        },
        fadeOut: {
          from: {
            opacity: "1",
          },
          to: {
            opacity: "0",
          },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

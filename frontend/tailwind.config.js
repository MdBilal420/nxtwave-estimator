/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				sky: {
					50: "#f0f7ff",
					100: "#e0f0ff",
					200: "#bae2ff",
					300: "#7dcbff",
					400: "#38acff",
					500: "#0090ff",
					600: "#0072e6",
					700: "#0059b8",
					800: "#004a98",
					900: "#00397d",
				},
				indigo: {
					50: "#f5f3ff",
					100: "#ede9fe",
					200: "#ddd6fe",
					300: "#c4b5fd",
					400: "#a78bfa",
					500: "#8b5cf6",
					600: "#7c3aed",
					700: "#6d28d9",
					800: "#5b21b6",
					900: "#4c1d95",
				},
				glassmorphic: {
					white: "rgba(255, 255, 255, 0.15)",
					blue: "rgba(56, 172, 255, 0.15)",
				},
			},
			backdropBlur: {
				sm: "8px",
				md: "12px",
				lg: "16px",
				xl: "24px",
			},
			backgroundImage: {
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
				"gradient-conic":
					"conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
			},
		},
	},
	plugins: [],
};

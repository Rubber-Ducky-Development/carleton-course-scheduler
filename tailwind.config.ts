import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: "#f0f9ff",
                    100: "#e0f2fe",
                    200: "#bae6fd",
                    300: "#7dd3fc",
                    400: "#38bdf8",
                    500: "#0ea5e9",
                    600: "#0284c7",
                    700: "#0369a1",
                    800: "#075985",
                    900: "#0c4a6e",
                    950: "#082f49",
                },
                secondary: {
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
                    950: "#2e1065",
                },
                peach: {
                    DEFAULT: "#ff5733",
                    50: "#fff0ea",
                    100: "#ffd8cc",
                    200: "#ffb199",
                    300: "#ff8a66",
                    400: "#ff6a40",
                    500: "#ff5733",
                    600: "#e04e2e",
                    700: "#b93f25",
                    800: "#8c2f1b",
                    900: "#4b2e2e",
                },
                'peach-dark': {
                    DEFAULT: "#b93f25",
                    100: "#ffb199",
                    200: "#ff8a66",
                    300: "#ff6a40",
                    400: "#ff5733",
                    500: "#b93f25",
                },
                contrast: {
                    DEFAULT: "#2f1b1b",
                    light: "#fff0ea",
                },
            },
        },
    },
    plugins: [],
    darkMode: 'class',
};

export default config;

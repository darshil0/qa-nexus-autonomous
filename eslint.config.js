import js from "@eslint/js";
import ts from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";

export default ts.config(
    js.configs.recommended,
    ...ts.configs.recommended,
    {
        files: ["**/*.{ts,tsx}"],
        plugins: {
            react,
            "react-hooks": reactHooks,
        },
        languageOptions: {
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: {
                browser: true,
                node: true,
                es2022: true,
            }
        },
        settings: {
            react: {
                version: "detect",
            },
        },
        rules: {
            ...react.configs.recommended.rules,
            ...reactHooks.configs.recommended.rules,
            "no-console": ["warn", { allow: ["warn", "error"] }],
            "@typescript-eslint/no-explicit-any": "warn",
            "react/prop-types": "off",
            "react/react-in-jsx-scope": "off",
            "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
        },
    },
    {
        ignores: ["dist", "node_modules", ".eslintrc.cjs", "vite.config.ts", "vitest.config.ts"],
    }
);

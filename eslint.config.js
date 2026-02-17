import js from "@eslint/js";
import ts from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

export default ts.config(
    js.configs.recommended,
    ...ts.configs.recommendedTypeChecked, // More strict type checking
    {
        files: ["**/*.{ts,tsx}"],
        plugins: {
            react,
            "react-hooks": reactHooks,
        },
        languageOptions: {
            parserOptions: {
                project: true, // Enable project-aware type checking
                tsconfigRootDir: import.meta.dirname,
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.es2022,
            }
        },
        settings: {
            react: {
                version: "detect",
            },
        },
        rules: {
            // React Rules
            ...react.configs.recommended.rules,
            ...reactHooks.configs.recommended.rules,
            "react/prop-types": "off", // Using TypeScript for prop validation
            "react/react-in-jsx-scope": "off", // Not needed in React 19
            
            // TypeScript Rules
            "@typescript-eslint/no-explicit-any": "error", // Strict: disallow any
            "@typescript-eslint/no-unused-vars": ["error", { 
                argsIgnorePattern: "^_",
                varsIgnorePattern: "^_",
                caughtErrorsIgnorePattern: "^_"
            }],
            "@typescript-eslint/no-floating-promises": "error", // Catch unhandled promises
            "@typescript-eslint/await-thenable": "error", // Only await promises
            "@typescript-eslint/no-misused-promises": "error", // Proper promise usage
            "@typescript-eslint/require-await": "warn", // Functions marked async should use await
            
            // General Code Quality
            "no-console": ["warn", { allow: ["warn", "error"] }],
            "prefer-const": "error",
            "no-var": "error",
            "eqeqeq": ["error", "always"], // Require === and !==
            "curly": ["error", "all"], // Require curly braces for all control statements
            
            // Best Practices
            "@typescript-eslint/only-throw-error": "error", // Only throw Error objects (TS-aware replacement for no-throw-literal)
            "@typescript-eslint/return-await": "error", // Don't unnecessarily await in return statements (smarter TS-aware replacement for no-return-await)
            "require-await": "off", // Handled by TypeScript rule
        },
    },
    {
        // Test files - slightly relaxed rules
        files: ["**/*.spec.{ts,tsx}", "**/*.test.{ts,tsx}"],
        rules: {
            "@typescript-eslint/no-explicit-any": "warn", // More lenient in tests
            "@typescript-eslint/no-floating-promises": "off", // Test frameworks handle this
        }
    },
    {
        // Configuration files
        files: ["*.config.{js,ts}", "*.setup.{js,ts}"],
        rules: {
            "@typescript-eslint/no-require-imports": "off", // Replacement for deprecated no-var-requires
            "no-console": "off",
        }
    },
    {
        ignores: [
            "dist",
            "node_modules",
            ".eslintrc.cjs",
            "vite.config.ts",
            "vitest.config.ts",
            "eslint.config.js",
            "coverage"
        ],
    }
);

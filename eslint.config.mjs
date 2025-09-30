import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Allow empty interfaces when they extend another interface
      "@typescript-eslint/no-empty-object-type": "off",
      
      // Allow unused variables in specific cases
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          "argsIgnorePattern": "^_",
          "varsIgnorePattern": "^_",
          "caughtErrorsIgnorePattern": "^_"
        }
      ],
      
      // Allow any types in specific cases where they're needed
      "@typescript-eslint/no-explicit-any": [
        "warn",
        {
          "ignoreRestArgs": true,
          "fixToUnknown": false
        }
      ]
    }
  }
];

export default eslintConfig;
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

// Get the current directory and file name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize FlatCompat with the base directory
const compat = new FlatCompat({
    baseDirectory: __dirname,
});

// Use compat to extend the base Next.js configurations
const eslintConfig = [...compat.extends('next/core-web-vitals', 'next/typescript')];

export default [
    // Extend base Next.js configurations and disable custom rules
    ...eslintConfig,
    {
        files: ['**/*.ts', '**/*.tsx'], // Apply this config to TypeScript files
        rules: {
            // Disable all ESLint rules as needed
            'no-unused-vars': 'off',
            'react/display-name': 'off',
            'react-hooks/exhaustive-deps': 'off',
            '@next/next/no-img-element': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
        },
    },
];

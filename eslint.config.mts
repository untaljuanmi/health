import eslint from '@eslint/js';
import angular from 'angular-eslint';
import { defineConfig } from 'eslint/config';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import importPlugin from 'eslint-plugin-import';
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  {
    files: ['**/*.ts'],
    plugins: {
      import: importPlugin,
      'simple-import-sort': simpleImportSortPlugin,
      'unused-imports': unusedImportsPlugin,
    },
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.stylistic,
      angular.configs.tsRecommended,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    processor: angular.processInlineTemplates,
    rules: {
      '@typescript-eslint/no-inferrable-types': 'off',

      'simple-import-sort/exports': 'error',
      'simple-import-sort/imports': 'error',

      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: ['app', 'my'],
          style: 'camelCase',
        },
      ],

      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: ['app', 'my'],
          style: 'kebab-case',
        },
      ],
    },
  },
  {
    files: ['**/*.html'],
    extends: [angular.configs.templateRecommended, angular.configs.templateAccessibility],
  },
  eslintPluginPrettierRecommended,
]);

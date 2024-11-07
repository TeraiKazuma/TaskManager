import globals from 'globals'
import typescriptParser from '@typescript-eslint/parser'
import typescriptPlugin from '@typescript-eslint/eslint-plugin'
import reactPlugin from 'eslint-plugin-react'

/** @type {ESLint.FlatConfig[]} */
export default [
  {
    files: ['**/*.{js,mjs,cjs,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: typescriptParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        project: './tsconfig.json',
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
      'react': reactPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // TypeScriptの推奨ルールを適用
      ...typescriptPlugin.configs.recommended.rules,
      // Reactの推奨ルールを適用
      ...reactPlugin.configs.recommended.rules,
      // カスタムルールの追加
      'semi': ['error', 'never'], // セミコロンを使用しない
      'react/react-in-jsx-scope': 'off', // React 17+では不要
      '@typescript-eslint/no-explicit-any': 'off', // any型の使用を許可
    },
  },
]

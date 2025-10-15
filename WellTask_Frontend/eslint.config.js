import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { globalIgnores } from 'eslint/config'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      'react/jsx-boolean-value': [1, 'always'],
      'testing-library/no-container': 1,
      'testing-library/no-node-access': 1,
      'jsx-a11y/anchor-is-valid': [
        2,
        {
          components: ['Link'],
          specialLink: ['to'],
          aspects: ['invalidHref'],
        },
      ],
      'no-console': [
        2,
        {
          allow: ['error', 'warn'],
        },
      ],
      'no-unused-vars': 2,
      'react/prop-types': 2,
      'react/require-default-props': 2,
      'import/first': 2,
      'import/order': 2,
    },
  },
])

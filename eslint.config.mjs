// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'
import eslintConfigPrettier from 'eslint-config-prettier'

export default withNuxt(
    {
    name: 'app:turn-off-style-rules',
    rules: {
      'vue/html-indent': 'off',
      'vue/script-indent': 'off',
      'vue/html-self-closing': 'off',
      '@stylistic/indent': 'off',
      '@stylistic/semi': 'off',
      '@stylistic/quotes': 'off',
      '@stylistic/comma-dangle': 'off',
    },
  },
  eslintConfigPrettier,
)

module.exports = {
  semi: true,
  trailingComma: 'es5',
  singleQuote: true,
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  endOfLine: 'lf',
  // Vue 特定配置
  vueIndentScriptAndStyle: true,
  // HTML 属性换行配置
  htmlWhitespaceSensitivity: 'css',
  singleAttributePerLine: true,
  // Vue 模板格式化
  overrides: [
    {
      files: '*.vue',
      options: {
        parser: 'vue',
        singleAttributePerLine: true,
        htmlWhitespaceSensitivity: 'ignore'
      }
    }
  ]
};
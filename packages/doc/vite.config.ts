import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import mdx from '@mdx-js/rollup'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import langJavascript from 'highlight.js/lib/languages/javascript'
import langTypescript from 'highlight.js/lib/languages/typescript'
import langXml from 'highlight.js/lib/languages/xml'

import { resolve } from 'path'

const languages = {
  javascript: langJavascript,
  typescript: langTypescript,
  xml: langXml
}

const aliases = {
  vue: 'javascript',
  js: 'javascript',
  ts: 'typescript'
}

export default defineConfig({
  plugins: [
    vue(),
    mdx({
      jsxImportSource: 'vue',
      remarkPlugins: [remarkFrontmatter, remarkGfm],
      rehypePlugins: [
        [rehypeHighlight, { 
          detect: true,
          ignoreMissing: true,
          languages,
          aliases
        }]
      ],
      providerImportSource: '@mdx-js/vue'
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 5174,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  define: {
    __DEV_TOOLS__: JSON.stringify(process.env.NODE_ENV === 'development')
  }
})
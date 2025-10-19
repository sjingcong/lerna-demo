import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import postCssPxToRem from 'postcss-pxtorem'
import { devMockApi } from './mock/dev-api'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const useMock = env.USE_MOCK === 'true'

  return {
    plugins: [
      vue(),
      ...(useMock ? [devMockApi()] : [])
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    css: {
      postcss: {
        plugins: [
          postCssPxToRem({
            rootValue: 37.5,
            propList: ['*'],
            selectorBlackList: ['.norem']
          })
        ]
      }
    },
    server: {
      port: 3001,
      open: true,
      proxy: useMock ? undefined : {
        // 真实后端代理配置（仅在未启用 mock 时生效）
        '/api': {
          target: env.API_TARGET || 'http://localhost:8080',
          changeOrigin: true
        }
      }
    }
  }
})
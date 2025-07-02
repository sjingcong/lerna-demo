import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'
import { resolve } from 'path'

export const createViteConfig = (packageName: string) => {
    const packagePath = resolve(__dirname, `packages/${packageName}`);
    return defineConfig({
        plugins: [
            vue(),
            Components({
                resolvers: [VantResolver()],
            })
        ],
        resolve: {
            alias: {
                '@': resolve(__dirname, `packages/${packageName}/src`)
            }
        },
        build: {
            outDir: 'dist',
            sourcemap: true,
            rollupOptions: {
                input: resolve(packagePath, 'src/main.ts'),  // 添加这行：指定入口文件
                external: ['vue'],
                output: {
                    globals: {
                        vue: 'Vue'
                    }
                }
            }
        },
        server: {
            port: 3000,
            open: true
        }
    });
};
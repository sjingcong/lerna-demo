import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'
import { resolve } from 'path'
import legacy from '@vitejs/plugin-legacy'
import compression from 'vite-plugin-compression'
import autoprefixer from 'autoprefixer'

export const createViteConfig = (packageName: string) => {
    const packagePath = resolve(__dirname, `packages/${packageName}`);
    return defineConfig({
        plugins: [
            vue(),
            Components({
                resolvers: [VantResolver()],
            }),
            legacy({
                targets: ['> 0.5%', 'Chrome < 64'],
                additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
                modernPolyfills: true,
                renderLegacyChunks: true,
            }),
            // 添加 gzip 压缩插件
            compression({
                algorithm: 'gzip',
                threshold: 2048,
                ext: '.gz',
                deleteOriginFile: false, // 保留原文件
                verbose: false, // 显示压缩信息
                filter: /\.(js|css|svg)$/i // 只压缩这些类型的文件
            })
        ],
        resolve: {
            alias: {
                '@': resolve(__dirname, `packages/${packageName}/src`)
            }
        },
        build: {
            outDir: 'dist',
            minify: false,
            sourcemap: true,
            rollupOptions: {
                input: resolve(packagePath, 'index.html'),
                output: {
                    // 自定义文件输出路径
                    entryFileNames: 'js/[name]-[hash].js',
                    chunkFileNames: 'js/[name]-[hash].js',
                    assetFileNames: (assetInfo) => {
                        // 根据文件类型分配到不同文件夹
                        if (assetInfo.name?.endsWith('.css')) {
                            return 'css/[name]-[hash][extname]';
                        }
                        // 其他资源文件（图片、字体等）
                        return 'assets/[name]-[hash][extname]';
                    },
                    // 手动分割代码块
                    manualChunks: {
                        // 将Vue相关的核心库打包成vendor
                        vendor: ['vue', 'vue-router', 'pinia'],
                    }
                }
            }
        },
        css: {
            postcss: {
                plugins: [
                    autoprefixer({
                        overrideBrowserslist: [
                            '> 0.5%',
                            'last 2 versions',
                            'ie >= 10',        // 添加这行来支持 IE 10+
                            'Chrome >= 21',
                            'Safari >= 6.1',
                            'Firefox >= 28'
                        ],
                        remove: false,
                        supports: false,
                        flexbox: 'no-2009'
                    })
                ]
            }
        },
        server: {
            port: 3000,
            open: true
        }
    });
};
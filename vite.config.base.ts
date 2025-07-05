import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'
import { resolve } from 'path'
import legacy from '@vitejs/plugin-legacy'
import compression from 'vite-plugin-compression'
import autoprefixer from 'autoprefixer'
import { createHtmlPlugin } from 'vite-plugin-html'
import { readFileSync } from 'fs'

export const createViteConfig = (packageName: string) => {
    const packagePath = resolve(__dirname, `packages/${packageName}`);
    // 读取 normalize.css 内容
    const normalizeCss = readFileSync(
        resolve(__dirname, 'node_modules/normalize.css/normalize.css'),
        'utf-8'
    );
    return defineConfig({
        plugins: [
            vue(),
            Components({
                resolvers: [VantResolver()],
            }),
            // 添加 HTML 插件用于内联 CSS
            createHtmlPlugin({
                minify: true,
                inject: {
                    data: {
                        inlineNormalizeCss: `<style>${normalizeCss}</style>`
                    }
                }
            }),
            legacy({
                targets: ['> 0.5%', 'Chrome < 64', 'not dead', 'ie >= 11'],
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
                        const name = assetInfo.name || ''
                        const info = name.split('.')
                        const extType = info?.[info.length - 1]
                        if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i.test(name)) {
                            return 'media/[name]-[hash].[ext]'
                        }
                        if (/\.(png|jpe?g|gif|svg|webp|avif)(\?.*)?$/i.test(name)) {
                            return 'assets/images/[name]-[hash].[ext]'
                        }
                        if (extType === 'css') {
                            return 'css/[name]-[hash].[ext]'
                        }
                        return 'assets/[name]-[hash].[ext]'
                    },
                    // 手动分割代码块
                    manualChunks: (id) => {
                        console.log('Processing module:', id) // 调试用，可以看到处理的模块

                        // 只处理 node_modules 中的第三方库
                        if (id.includes('node_modules')) {

                            // Vue 生态系统
                            if (id.includes('vue') || id.includes('vue-router') || id.includes('pinia')) {
                                return 'vue-vendor'
                            }
                            // 工具库（只有在实际安装时才会匹配）
                            if (id.includes('lodash') || id.includes('dayjs') || id.includes('axios')) {
                                return 'utils-vendor'
                            }

                            // 其他第三方库统一放到 vendor
                            return 'vendor'
                        }
                    }
                }
            },
            // 设置 chunk 大小警告阈值
            chunkSizeWarningLimit: 1000
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
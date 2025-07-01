import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export const createViteConfig = (packageName: string) => {
  return defineConfig({
    plugins: [vue()],
    resolve: {
      alias: {
        '@': resolve(__dirname, `packages/${packageName}/src`)
      }
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
      rollupOptions: {
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
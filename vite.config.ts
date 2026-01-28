
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 使用相对路径 './' 是解决 GitHub Pages 路径问题最稳妥的方法
  base: './', 
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
});

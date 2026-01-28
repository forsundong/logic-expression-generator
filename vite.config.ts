
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 设置为你的仓库名称，确保 GitHub Pages 路径正确
  base: '/logic-expression-generator/', 
  build: {
    outDir: 'dist',
  }
});

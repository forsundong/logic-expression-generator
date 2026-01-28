
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 注意：这里的 base 必须设置为你的仓库名称，例如 '/logic-expression-generator/'
  // 如果是个人主页 (username.github.io)，则设为 '/'
  base: './', 
  build: {
    outDir: 'dist',
  }
});

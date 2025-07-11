import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        // Make chunk names more stable by using consistent naming
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId.split('/').pop()?.replace(/\.[^/.]+$/, '') || 'chunk'
            : 'chunk';
          return `${facadeModuleId}-[hash].js`;
        },
        entryFileNames: 'index-[hash].js',
        assetFileNames: '[name]-[hash].[ext]',
        manualChunks: {
          // Split vendor libraries into separate chunks
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@radix-ui/react-toast', '@radix-ui/react-tooltip', '@radix-ui/react-select'],
          utils: ['date-fns', 'clsx', 'tailwind-merge'],
        },
      },
    },
  },
}));

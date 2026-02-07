import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // ✅ Performance optimizations
  build: {
    // ✅ Code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // ✅ Vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-tooltip', '@radix-ui/react-scroll-area'],
          'query-vendor': ['@tanstack/react-query'],
          'animation-vendor': ['framer-motion', 'embla-carousel-react'],
        },
      },
    },
    // ✅ Minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: mode === 'production',
      },
    },
    // ✅ Source maps only in dev
    sourcemap: mode === 'development',
    // ✅ Chunk size warning
    chunkSizeWarningLimit: 1000,
  },
  // ✅ Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      'lucide-react',
    ],
  },
}));
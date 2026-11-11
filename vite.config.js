import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Dos puertos:
//   5173 -> página React (público)
//   5000 -> API ficticia json-server (privado)
// El proxy reenvía /api/... al puerto 5000. Así funciona igual en el computador y en GitHub Codespaces.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        rewrite: (ruta) => ruta.replace(/^\/api/, ''),
      },
    },
  },
});

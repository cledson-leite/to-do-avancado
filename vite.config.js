import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // Ativa as variáveis globais do Vitest (vi, expect, test)
    environment: 'jsdom', // Configuração comum para testes de React
    include: ['**/*.test.{js,jsx,ts,tsx}'], // Incluir apenas arquivos de teste
    exclude: ['node_modules', 'dist'], // Exclui diretórios de build e dependências
  },
});

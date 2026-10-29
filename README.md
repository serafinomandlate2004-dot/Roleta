# Roleta da Sorte

Projeto React + TypeScript + Vite + Tailwind CSS pronto para Lovable, Vercel ou qualquer plataforma de hospedagem.

## 🚀 Como usar no Lovable

1. No Lovable, crie um novo projeto ou conecte um repositório GitHub com estes arquivos.
2. Certifique-se de que as dependências do `package.json` estão instaladas (`npm install`).
3. O projeto usa:
   - `react` ^19.0.0
   - `canvas-confetti` ^1.9.4
   - `lucide-react` ^0.546.0
   - `@tailwindcss/vite` ^4.3.3
   - Web Audio API nativo (sem dependências de áudio externas quebradas)
4. Para rodar localmente:
   ```bash
   npm install
   npm run dev
   ```
5. Para gerar a build de produção:
   ```bash
   npm run build
   ```

## 📁 Estrutura de Arquivos
- `/index.html`: Ponto de entrada com meta tags e fontes Poppins
- `/public/images/cQc9WWa.png`: Imagem da roleta em alta definição
- `/src/App.tsx`: Interface completa, física de giro e modais
- `/src/utils/audio.ts`: Sintetizador Web Audio API de ticks e fanfarra
- `/src/index.css`: Estilização global com Tailwind e animações de pulso

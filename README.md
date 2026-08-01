# Treinologia — Aplicativo de Treinos & Recuperação de LCA

**Treinologia** é um aplicativo PWA (Progressive Web App) desenvolvido em **React + Vite + TypeScript**, projetado para atletas em fase de hipertrofia e fortalecimento pós-cirurgia de reconstrução do Ligamento Cruzado Anterior (LCA).

---

## 🚀 Tecnologias Utilizadas

- **React 18** (Functional components, custom hooks)
- **Vite** (Template `react-ts` com HMR rápido)
- **TypeScript** (Tipagem estática rigorosa)
- **React Router** (Navegação baseada em rotas SPA)
- **Tailwind CSS v4** (Interface moderna, responsiva e tema dark de alta performance)
- **PWA (vite-plugin-pwa)** (Service Worker e `manifest.json` para funcionamento offline)
- **LocalStorage** (Persistência local de dados e relatórios sem dependência de servidor)
- **Recharts** (Gráficos interativos de evolução de carga e volume semanal)
- **jsPDF** (Exportação em PDF do programa de treinos e históricos de carga)
- **Lucide React** (Ícones modernos e intuitivos)

---

## 📁 Estrutura do Projeto

```text
├── public/
│   └── manifest.json         # Manifesto PWA para instalação no celular/desktop
├── src/
│   ├── pages/                # Páginas e rotas da aplicação
│   │   ├── DashboardPage.tsx     # Visão geral de treino, streak e período do ciclo
│   │   ├── WorkoutPage.tsx       # Execução ativa do treino e timer de descanso
│   │   ├── AnalyticsPage.tsx     # Gráficos de sobrecarga progressiva e volume
│   │   ├── KneeRecoveryPage.tsx  # Guia biomecânico e matriz de substituições de LCA
│   │   └── SettingsPage.tsx      # Configurações do perfil, semana do ciclo e relatórios PDF
│   ├── components/           # Componentes reutilizáveis de interface
│   │   ├── Navbar.tsx            # Header fixo e navegação por abas/rotas
│   │   ├── DashboardView.tsx     # Card de resumo e seleção de ficha
│   │   ├── WorkoutExecutionView.tsx # Interface interativa de registro de séries/reps
│   │   ├── AnalyticsView.tsx     # Gráficos de evolução por exercício e consistência
│   │   ├── KneeRecoveryView.tsx  # Matriz de substituição de exercícios sensíveis ao joelho
│   │   ├── SettingsView.tsx      # Ajustes de data cirúrgica e geração de relatórios
│   │   └── ShareCardModal.tsx    # Modal de compartilhamento visual de resultados
│   ├── lib/                  # Serviços e utilitários da aplicação
│   │   ├── storageService.ts     # Gerenciamento de persistência via localStorage
│   │   ├── pdfExport.ts          # Geração de relatórios em PDF
│   │   └── audio.ts              # Web Audio API para alertas de descanso e feedback
│   ├── data/                 # Dados iniciais e mocks de demonstração
│   │   ├── initialData.ts        # Fichas de treino, regras de ciclo e perfil inicial
│   │   └── sampleLogs.ts         # Histórico de 45 dias pré-carregado para demonstração
│   ├── types.ts              # Interfaces e tipos globais em TypeScript
│   ├── App.tsx               # Configuração do React Router e estado principal
│   ├── main.tsx              # Ponto de entrada da aplicação
│   └── index.css             # Estilos globais e importação do Tailwind CSS
├── vite.config.ts            # Configuração do Vite e plugin PWA
└── package.json              # Dependências e scripts do projeto
```

---

## ⚡ Como Rodar o Projeto

### Pré-requisitos
- **Node.js**: `v18+` ou superior
- **npm**: `v9+` ou `yarn` / `pnpm` / `bun`

### 1. Instalar as Dependências
No terminal do projeto, execute:
```bash
npm install
```

### 2. Rodar o Servidor de Desenvolvimento
```bash
npm run dev
```
O aplicativo estará acessível no seu navegador em `http://localhost:3000`.

### 3. Compilar para Produção (Build)
```bash
npm run build
```
O build final otimizado será gerado na pasta `dist/`.

### 4. Testar a Build de Produção
```bash
npm run preview
```

---

## 📱 Suporte a PWA & Modo Offline

O **Treinologia** utiliza `vite-plugin-pwa` para registrar um Service Worker automático.
- **Instalável**: Pode ser adicionado à tela inicial em dispositivos móveis (iOS e Android) ou instalado como app de desktop no Chrome/Edge.
- **Funcionamento Offline**: Todo o estado e histórico de treinos são salvos no `localStorage` do dispositivo, permitindo o registro de séries mesmo em academias sem conexão com a internet.

---

## 💡 Recursos Principais

1. **Periodização em 8 Semanas**:
   - Semanas 1–3: Adaptação & Volume (8–12 reps)
   - Semanas 4–7: Sobrecarga Progressiva (6–10 reps com auto-incremento de carga)
   - Semana 8: **Deload Automático** (redução de 50% de volume para regeneração do enxerto do joelho)
2. **Matriz de Proteção do Joelho (LCA)**:
   - Identificação de exercícios com tensão patelar elevadas.
   - Troca em 1 clique durante o treino por alternativas biológicas seguras (ex: Cadeira Extensora 45º–90º → Agachamento Búlgaro Guiado).
3. **Timer de Descanso Integrado**:
   - Contagem regressiva interativa com alertas sonoros e vibração ao finalizar o tempo de descanso entre séries.
4. **Relatórios em PDF**:
   - Exportação completa da ficha de treinos de 5 dias.
   - Exportação do histórico de cargas para acompanhamento com personal ou fisioterapeuta.

---

## 🛡️ Licença

Projeto desenvolvido para alta performance e saúde física. Livre para uso pessoal e customizações.

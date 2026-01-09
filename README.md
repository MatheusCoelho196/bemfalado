# Terapeuta IA - Aplicativo de Terapia por Inteligência Artificial

Um aplicativo web de terapia por IA especializado em Terapia Cognitivo-Comportamental (TCC) para o mercado brasileiro.

## 🌟 Funcionalidades

- ✅ Chat em tempo real com streaming de respostas
- ✅ Sistema de autenticação (Email/Senha e Google)
- ✅ Histórico completo de conversas
- ✅ Diário emocional com tracking de humor
- ✅ 3 modos de conversa (Formal, Casual, Jovem)
- ✅ Técnicas de CBT integradas
- ✅ Detecção de crise/emergência
- ✅ Criptografia ponta-a-ponta (LGPD compliant)
- ✅ Rate limiting para segurança
- ✅ PWA (Progressive Web App)
- ✅ Design responsivo (mobile-first)

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS
- **UI**: shadcn/ui
- **Backend**: Next.js API Routes
- **IA**: Anthropic Claude API (Sonnet 3.5)
- **Autenticação**: NextAuth.js
- **Banco de Dados**: Supabase (PostgreSQL)
- **Pagamentos**: Stripe (configuração preparada)
- **Deploy**: Vercel

## 📋 Pré-requisitos

- Node.js 18+ e npm/yarn/pnpm
- Conta Supabase (gratuita)
- Chave API da Anthropic (Claude)
- Credenciais do Google OAuth (opcional)
- Conta Stripe (para pagamentos - opcional)

## 🚀 Setup e Instalação

### 1. Clone o repositório

\`\`\`bash
git clone <seu-repositorio>
cd terapeuta-ia
\`\`\`

### 2. Instale as dependências

\`\`\`bash
npm install
# ou
yarn install
# ou
pnpm install
\`\`\`

### 3. Configure as variáveis de ambiente

Copie o arquivo `.env.example` para `.env`:

\`\`\`bash
cp .env.example .env
\`\`\`

Preencha as variáveis:

\`\`\`env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=gere-com-openssl-rand-base64-32

# Google OAuth (opcional)
GOOGLE_CLIENT_ID=seu-google-client-id
GOOGLE_CLIENT_SECRET=seu-google-client-secret

# Anthropic Claude API
ANTHROPIC_API_KEY=sua-chave-anthropic

# Supabase
NEXT_PUBLIC_SUPABASE_URL=sua-url-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key

# Stripe (opcional)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=sua-pk-stripe
STRIPE_SECRET_KEY=sua-sk-stripe
STRIPE_WEBHOOK_SECRET=seu-webhook-secret

# Encryption (mínimo 32 caracteres)
ENCRYPTION_KEY=sua-chave-criptografia-32-chars-min

# Rate Limiting
RATE_LIMIT_MAX_REQUESTS=10
RATE_LIMIT_WINDOW_MS=60000
\`\`\`

### 4. Configure o banco de dados Supabase

1. Crie um projeto no [Supabase](https://supabase.com)
2. Execute o schema SQL:
   - Vá para SQL Editor no dashboard do Supabase
   - Copie o conteúdo de `supabase/schema.sql`
   - Execute o script

### 5. Configure o Google OAuth (opcional)

1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Crie um novo projeto
3. Ative Google+ API
4. Crie credenciais OAuth 2.0
5. Adicione as URIs de redirecionamento:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://seu-dominio.com/api/auth/callback/google`

### 6. Gere a chave de criptografia

\`\`\`bash
openssl rand -base64 32
\`\`\`

### 7. Execute o projeto

\`\`\`bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
\`\`\`

Abra [http://localhost:3000](http://localhost:3000) no navegador.

## 📁 Estrutura do Projeto

\`\`\`
terapeuta-ia/
├── app/
│   ├── (auth)/              # Rotas de autenticação
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/         # Rotas protegidas
│   │   ├── chat/           # Interface de chat
│   │   ├── historico/      # Histórico de conversas
│   │   ├── diario/         # Diário emocional
│   │   └── perfil/         # Perfil do usuário
│   ├── api/                # API Routes
│   │   ├── auth/           # NextAuth endpoints
│   │   ├── chat/           # Chat com streaming
│   │   ├── conversations/  # CRUD de conversas
│   │   ├── mood/           # Diário emocional
│   │   └── user/           # Perfil de usuário
│   ├── globals.css         # Estilos globais
│   ├── layout.tsx          # Layout raiz
│   └── page.tsx            # Landing page
├── components/
│   ├── ui/                 # Componentes shadcn/ui
│   ├── layout/             # Componentes de layout
│   └── providers/          # Providers (Auth, etc)
├── lib/
│   ├── auth.ts             # Configuração NextAuth
│   ├── claude.ts           # Cliente Anthropic
│   ├── prompts.ts          # System prompts TCC
│   ├── encryption.ts       # Funções de criptografia
│   ├── rate-limit.ts       # Rate limiting
│   ├── utils.ts            # Utilitários
│   └── supabase/           # Clientes Supabase
├── types/
│   ├── next-auth.d.ts      # Tipos NextAuth
│   └── supabase.ts         # Tipos do banco
├── public/
│   └── manifest.json       # PWA manifest
└── supabase/
    └── schema.sql          # Schema do banco
\`\`\`

## 🔒 Segurança e LGPD

### Criptografia
- Todas as conversas são criptografadas usando AES-256
- Chaves armazenadas de forma segura no servidor
- Dados nunca expostos em texto plano

### LGPD Compliance
- Consentimento explícito no registro
- Direito ao esquecimento (deletar conta)
- Direito de exportar dados
- Transparência no uso de dados
- Políticas de privacidade claras

### Rate Limiting
- Proteção contra abuso com limite de requisições
- Configurável por usuário
- Janela de tempo ajustável

## 🧠 Prompts Terapêuticos

### Modos de Conversa

**Formal**: Linguagem profissional e técnica
- Para usuários que preferem abordagem clássica
- Vocabulário mais formal
- Estrutura terapêutica clara

**Casual**: Conversação natural e acessível
- Linguagem do dia a dia
- Mais descontraído mas respeitoso
- Melhor para engajamento

**Jovem**: Linguagem adaptada para público jovem
- Gírias moderadas e expressões atuais
- Tom mais próximo e empático
- Zero julgamento

### Técnicas de TCC Implementadas

1. Identificação de pensamentos automáticos
2. Reestruturação cognitiva
3. Registro de pensamentos disfuncionais
4. Técnicas de relaxamento
5. Exposição gradual
6. Ativação comportamental
7. Resolução de problemas

### Detecção de Crise

Sistema automático que detecta:
- Ideação suicida
- Palavras-chave de emergência
- Respostas automáticas com recursos de ajuda imediata
- Orientação para CVV (188) e emergências

## 🎨 Personalização

### Cores e Tema

Edite `tailwind.config.ts` para personalizar cores:

\`\`\`typescript
theme: {
  extend: {
    colors: {
      primary: "sua-cor-primaria",
      // ...
    }
  }
}
\`\`\`

### Prompts

Edite `lib/prompts.ts` para ajustar:
- Personalidade da IA
- Técnicas terapêuticas
- Palavras-chave de crise
- Respostas automáticas

## 📱 PWA (Progressive Web App)

O app funciona offline para o diário emocional:

1. Visite o site no mobile
2. Adicione à tela inicial
3. Use como app nativo
4. Diário funciona offline

## 🚀 Deploy

### Vercel (Recomendado)

1. Faça push do código para GitHub
2. Importe no Vercel
3. Configure variáveis de ambiente
4. Deploy automático

### Outras plataformas

O app é compatível com qualquer plataforma que suporte Next.js 14+:
- Netlify
- Railway
- AWS Amplify
- Cloudflare Pages

## 🧪 Desenvolvimento

### Scripts disponíveis

\`\`\`bash
npm run dev      # Desenvolvimento
npm run build    # Build de produção
npm run start    # Servidor de produção
npm run lint     # ESLint
\`\`\`

### Adicionar dependências

Para adicionar um componente shadcn/ui:

\`\`\`bash
npx shadcn-ui@latest add [componente]
\`\`\`

## ⚠️ Avisos Importantes

1. **Não substitui terapia real**: Este app oferece apoio emocional mas NÃO substitui atendimento profissional
2. **Emergências**: Sempre oriente usuários em crise a buscar ajuda imediata
3. **Privacidade**: Nunca compartilhe ou venda dados dos usuários
4. **Responsabilidade**: Mantenha disclaimers claros sobre limitações

## 📄 Licença

[Adicione sua licença aqui]

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📞 Suporte

Para suporte e dúvidas:
- Abra uma issue no GitHub
- Email: [seu-email]

## 🙏 Agradecimentos

- Anthropic pelo Claude API
- Vercel pelo Next.js
- Supabase pela infraestrutura
- Comunidade open-source

---

**Desenvolvido com ❤️ para ajudar mais brasileiros a terem acesso a apoio emocional de qualidade**

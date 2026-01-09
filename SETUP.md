# Guia de Setup Completo - Terapeuta IA

Este guia detalha **passo a passo** como configurar o projeto do zero.

## 📋 Checklist de Configuração

- [ ] Node.js e npm instalados
- [ ] Conta Supabase criada
- [ ] Chave API Anthropic obtida
- [ ] Google OAuth configurado (opcional)
- [ ] Variáveis de ambiente configuradas
- [ ] Banco de dados criado
- [ ] Projeto rodando localmente

## 1. Instalação do Node.js

### Windows
1. Baixe do site oficial: https://nodejs.org
2. Instale a versão LTS (18+)
3. Verifique: \`node --version\` e \`npm --version\`

### macOS
\`\`\`bash
brew install node
\`\`\`

### Linux
\`\`\`bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
\`\`\`

## 2. Configurar Supabase

### Passo 1: Criar Projeto
1. Acesse https://supabase.com
2. Clique em "New Project"
3. Escolha nome, senha do DB e região (South America - São Paulo)
4. Aguarde ~2 minutos para provisionar

### Passo 2: Obter Credenciais
1. No dashboard, vá em "Settings" > "API"
2. Copie:
   - Project URL (NEXT_PUBLIC_SUPABASE_URL)
   - anon/public key (NEXT_PUBLIC_SUPABASE_ANON_KEY)
   - service_role key (SUPABASE_SERVICE_ROLE_KEY)

### Passo 3: Executar Schema SQL
1. Vá para "SQL Editor" no menu lateral
2. Clique em "New Query"
3. Copie TODO o conteúdo de \`supabase/schema.sql\`
4. Cole e clique em "Run"
5. Verifique se as tabelas foram criadas em "Table Editor"

## 3. Obter Chave API da Anthropic

### Passo 1: Criar Conta
1. Acesse https://console.anthropic.com
2. Crie uma conta ou faça login

### Passo 2: Obter API Key
1. Vá para "API Keys"
2. Clique em "Create Key"
3. Copie a chave (começa com \`sk-ant-...\`)
4. **IMPORTANTE**: Guarde em local seguro, não será mostrada novamente

### Passo 3: Adicionar Créditos
1. Vá para "Billing"
2. Adicione método de pagamento
3. Recarregue com pelo menos $5 USD para testes

## 4. Configurar Google OAuth (Opcional)

### Passo 1: Google Cloud Console
1. Acesse https://console.cloud.google.com
2. Crie novo projeto ou selecione existente

### Passo 2: Ativar Google+ API
1. Vá para "APIs & Services" > "Library"
2. Busque por "Google+ API"
3. Clique em "Enable"

### Passo 3: Criar Credenciais
1. Vá para "APIs & Services" > "Credentials"
2. Clique em "Create Credentials" > "OAuth 2.0 Client ID"
3. Configure tela de consentimento se necessário
4. Escolha "Web Application"
5. Adicione URIs de redirecionamento:
   \`\`\`
   http://localhost:3000/api/auth/callback/google
   https://seu-dominio.vercel.app/api/auth/callback/google
   \`\`\`
6. Copie Client ID e Client Secret

## 5. Configurar Variáveis de Ambiente

### Passo 1: Criar arquivo .env

\`\`\`bash
cp .env.example .env
\`\`\`

### Passo 2: Gerar NEXTAUTH_SECRET

\`\`\`bash
openssl rand -base64 32
\`\`\`

Copie o resultado e cole em \`NEXTAUTH_SECRET\`

### Passo 3: Gerar ENCRYPTION_KEY

\`\`\`bash
openssl rand -base64 32
\`\`\`

Copie o resultado e cole em \`ENCRYPTION_KEY\`

### Passo 4: Preencher todas as variáveis

Seu arquivo \`.env\` deve ficar assim:

\`\`\`env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=abc123xyz789...

# Google OAuth (opcional - pode deixar vazio se não for usar)
GOOGLE_CLIENT_ID=123456789-abc.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-...

# Anthropic Claude API
ANTHROPIC_API_KEY=sk-ant-api03-...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xyz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe (opcional - pode deixar vazio por enquanto)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Encryption
ENCRYPTION_KEY=abc123xyz789...

# Rate Limiting (valores padrão)
RATE_LIMIT_MAX_REQUESTS=10
RATE_LIMIT_WINDOW_MS=60000
\`\`\`

## 6. Instalar Dependências

\`\`\`bash
npm install
\`\`\`

Se houver erros:
\`\`\`bash
rm -rf node_modules package-lock.json
npm install
\`\`\`

## 7. Executar em Desenvolvimento

\`\`\`bash
npm run dev
\`\`\`

Abra http://localhost:3000

## 8. Testar Funcionalidades

### Teste 1: Registro de Usuário
1. Clique em "Começar Grátis"
2. Preencha nome, email e senha
3. Clique em "Criar Conta"
4. Deve redirecionar para /chat

### Teste 2: Chat com IA
1. Digite uma mensagem: "Olá, como você pode me ajudar?"
2. Aguarde resposta em streaming
3. Converse normalmente

### Teste 3: Diário Emocional
1. Vá para "Diário"
2. Escolha humor (slider)
3. Selecione emoções
4. Adicione notas
5. Salve

### Teste 4: Histórico
1. Vá para "Histórico"
2. Verifique se suas conversas aparecem
3. Clique em "Continuar" em uma conversa

## 🐛 Troubleshooting

### Erro: "Não foi possível conectar ao banco"
- Verifique se as credenciais do Supabase estão corretas
- Confirme que o schema SQL foi executado
- Verifique se o projeto Supabase está ativo

### Erro: "Anthropic API error"
- Confirme que a chave API está correta
- Verifique se há créditos na conta
- Teste a chave em: https://console.anthropic.com

### Erro: "NextAuth configuration error"
- Verifique se NEXTAUTH_SECRET foi gerado
- Confirme que NEXTAUTH_URL está correto
- Para Google OAuth, verifique Client ID e Secret

### Chat não funciona
- Abra DevTools (F12) e veja Console
- Verifique Network tab para erros de API
- Confirme que ANTHROPIC_API_KEY está configurada

### Streaming não aparece
- Verifique se está usando navegador moderno
- Teste em modo anônimo (pode ser extensão bloqueando)
- Veja erros no console

## 📞 Precisa de Ajuda?

1. Verifique logs no terminal onde \`npm run dev\` está rodando
2. Abra DevTools (F12) no navegador
3. Procure por mensagens de erro
4. Abra uma issue no GitHub com:
   - Descrição do problema
   - Logs de erro
   - Sistema operacional
   - Versão do Node.js

## ✅ Próximos Passos

Após configurar localmente:

1. **Teste extensivamente**
   - Crie várias conversas
   - Teste todos os modos (formal, casual, jovem)
   - Preencha diário emocional

2. **Personalize**
   - Ajuste prompts em \`lib/prompts.ts\`
   - Mude cores em \`tailwind.config.ts\`
   - Adicione seu branding

3. **Deploy**
   - Faça push para GitHub
   - Conecte com Vercel
   - Configure variáveis de ambiente no Vercel
   - Deploy!

4. **Monitore**
   - Configure Sentry para erros
   - Use Vercel Analytics
   - Monitore uso da API Anthropic

---

**Parabéns! Seu app de terapia por IA está pronto! 🎉**

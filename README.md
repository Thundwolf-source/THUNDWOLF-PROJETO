# 📺 Layout Streaming v7

Projeto de streaming com player de vídeos, sistema de login/cadastro e painel simples usando Node.js.

---

## 🚀 Como rodar o projeto

⚠️ Observações importantes
Sistema focado em TMDB https://www.themoviedb.org/   'The Movie Database'
Precisa ter Node.js instalado link: https://nodejs.org/pt-br/download
Use o Node Essentials Extenção do visual studio
Não usa banco de dados (é tudo em JSON)
Se der erro de porta, altere no server.js:
const PORT = 3000;

### 1️⃣ Abrir o projeto
Abra a pasta **layoutstreamingv7** no Visual Studio Code.

---

### 2️⃣ Instalar dependências

No terminal, rode:

```bash
npm init -y
npm install express cors express-session
3️⃣ Iniciar o servidor
node server.js
✅ Resultado esperado

No terminal aparecerá:

Servidor rodando http://localhost:3000
🌐 Acessar no navegador
http://localhost:3000
📁 Estrutura do projeto
layoutstreamingv7/
│
├── server.js                # Servidor Node.js (API + sessões)
├── package.json            # Configuração do Node
├── database/
│   └── users.json          # Banco simples de usuários
│
├── public/                 # Parte web principal
│   ├── index.html
│   ├── cadastro.html
│   ├── admin.html
│   ├── produtos.html
│   └── app.js
│
├── js/                     # Scripts do frontend
├── css/                    # Estilos
├── img/                    # Imagens
│
├── index.html              # Página inicial
├── login.html              # Login
├── cadastro.html           # Cadastro
├── canais.html             # Player de canais
├── trailer-player.html     # Player de trailers
├── Perfil.html             # Perfil do usuário
├── sobre.html              # Página sobre
│
└── playlist.php            # Playlist (uso externo)
🔐 Funcionalidades
Cadastro de usuários
Login com sessão (express-session)
Armazenamento em JSON (sem banco de dados)
Player de vídeo (HLS)
Página de canais e trailers
Área de perfil
⚙️ Como funciona o backend

O server.js:

Usa Express

Salva usuários em:

/database/users.json
Controla login com sessão
Libera acesso via CORS
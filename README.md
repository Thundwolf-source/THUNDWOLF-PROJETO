# 📺 Layout Streaming v7

Projeto de streaming com player de vídeos, sistema de login/cadastro e painel simples usando Node.js.

---

## ⚠️ Observações importantes

- Sistema focado em integração com **TMDB (The Movie Database)**  
  👉 https://www.themoviedb.org/

- É necessário ter o **Node.js instalado**  
  👉 https://nodejs.org/pt-br/download

- Recomendado usar a extensão **Node Essentials** no Visual Studio Code

- ❗ Não utiliza banco de dados  
  → Os dados são armazenados em arquivos JSON

- Caso a porta esteja ocupada, altere no `server.js`:

```js
const PORT = 3000;
🚀 Como rodar o projeto
1️⃣ Abrir o projeto

Abra a pasta layoutstreamingv7 no Visual Studio Code.

2️⃣ Instalar dependências

No terminal, execute:

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
│
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
✅ Cadastro de usuários
✅ Sistema de login com sessão (express-session)
✅ Armazenamento local em JSON
✅ Player de vídeos (HLS)
✅ Página de canais
✅ Player de trailers
✅ Área de perfil do usuário
✅ Painel administrativo básico
⚙️ Backend (server.js)

O backend é simples e funcional:

Usa Express para criar o servidor
Usa express-session para autenticação
Permite requisições externas com CORS
Salva usuários no arquivo:
/database/users.json
🧠 Como funciona o sistema
O usuário se cadastra → dados salvos no JSON
O login cria uma sessão
As páginas protegidas verificam essa sessão
O player carrega vídeos (canais/trailers)
Integração com TMDB para conteúdo
💡 Dicas úteis

🔄 Se der erro no login:
→ Apague o arquivo:

database/users.json
⚡ Sempre rode o servidor antes de acessar o site
🛠️ Para melhorar o projeto futuramente:
Usar banco de dados (MongoDB/MySQL)
Melhorar segurança das sessões
Implementar autenticação com token (JWT)

🛠️ Tecnologias usadas
Node.js
Express
Express-session
Cors
HTML5
CSS3
JavaScript
HLS.js (player de vídeo)
TMDB API
👨‍💻 Autor 👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇

Projeto desenvolvido por Pedro, Alexandre e Caio
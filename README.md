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
```

---

## 📥 Como clonar o projeto (via Git)

### 1️⃣ Abrir o PowerShell

No Windows, abra o **PowerShell**.

---

### 2️⃣ Clonar o repositório

```bash
git clone https://github.com/Thundwolf-source/THUNDWOLF-PROJETO.git
```

---

### 3️⃣ Entrar na pasta do projeto

```bash
cd THUNDWOLF-PROJETO
```

---

### 4️⃣ Abrir no VS Code (opcional)

```bash
code .
```

---

## 🚀 Como rodar o projeto

### 1️⃣ Abrir o projeto
Abra a pasta no Visual Studio Code.

---

### 2️⃣ Instalar dependências

```bash
npm init -y
npm install express cors express-session
```

---

### 3️⃣ Iniciar o servidor

```bash
node server.js
```

---

### ✅ Resultado esperado

```
Servidor rodando http://localhost:3000
```

---

## 🌐 Acessar no navegador

```
http://localhost:3000
```

---

## 📁 Estrutura do projeto

```
THUNDWOLF-PROJETO/
│
├── server.js
├── package.json
│
├── database/
│   └── users.json
│
├── public/
│   ├── index.html
│   ├── cadastro.html
│   ├── admin.html
│   ├── produtos.html
│   └── app.js
│
├── js/
├── css/
├── img/
│
├── index.html
├── login.html
├── cadastro.html
├── canais.html
├── trailer-player.html
├── Perfil.html
├── sobre.html
│
└── playlist.php
```

---

## 🔐 Funcionalidades

- Cadastro de usuários  
- Login com sessão  
- Armazenamento em JSON  
- Player de vídeo (HLS)  
- Página de canais e trailers  
- Área de perfil  
- Painel admin básico  

---

## ⚙️ Backend (server.js)

- Express  
- express-session  
- CORS  

Armazena usuários em:

```
/database/users.json
```

---

## 💡 Dicas úteis

- Se der erro no login: apague os usuario e cadastra novamente deixe assim em users.json []
```
caminho: database/users.json
```

- Sempre rode o servidor antes de acessar

- Melhorias futuras:
  - Banco de dados
  - JWT
  - Segurança

---

## 🛠️ Tecnologias usadas

- Node.js  
- Express  
- Express-session  
- Cors  
- HTML, CSS, JS  
- HLS.js  (Player de video)
- TMDB API  

---

👨‍💻 Autor 😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎😎
Projeto desenvolvido por Pedro, Alexandre e Caio
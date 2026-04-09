const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const session = require("express-session");

const app = express();
const PORT = 3000;
const ROOT = __dirname;
const USERS_FILE = path.join(ROOT, "database", "users.json");

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: "thundwolf-secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: "lax"
  }
}));

function ensureUsersFile() {
  if (!fs.existsSync(path.dirname(USERS_FILE))) {
    fs.mkdirSync(path.dirname(USERS_FILE), { recursive: true });
  }
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, "[]", "utf8");
  }
}

function readUsers() {
  ensureUsersFile();
  try {
    const raw = fs.readFileSync(USERS_FILE, "utf8").trim() || "[]";
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Erro ao ler users.json:", error);
    return [];
  }
}

function saveUsers(users) {
  ensureUsersFile();
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
}

function normalizeString(value) {
  return String(value ?? "").trim();
}

app.post("/register", (req, res) => {
  const name = normalizeString(req.body.name);
  const username = normalizeString(req.body.username).toLowerCase();
  const password = normalizeString(req.body.password);

  if (!name || !username || !password) {
    return res.status(400).json({ success: false, error: "Preencha todos os campos" });
  }

  const users = readUsers();
  const exists = users.some(user => String(user.username || "").toLowerCase() === username);

  if (exists) {
    return res.status(409).json({ success: false, error: "Usuário já existe" });
  }

  const numericIds = users.map(user => Number(user.id) || 0);
  const lastId = numericIds.length > 0 ? Math.max(...numericIds) : 0;

  const newUser = {
    id: lastId + 1,
    name,
    username,
    password
  };

  users.push(newUser);
  saveUsers(users);

  return res.json({ success: true, message: "Cadastro realizado com sucesso" });
});

app.post("/login", (req, res) => {
  const username = normalizeString(req.body.username).toLowerCase();
  const password = normalizeString(req.body.password);

  if (!username || !password) {
    return res.status(400).json({ success: false, error: "Preencha usuário e senha" });
  }

  const users = readUsers();
  const user = users.find(item =>
    String(item.username || "").toLowerCase() === username &&
    String(item.password || "") === password
  );

  if (!user) {
    return res.status(401).json({ success: false, error: "Login inválido" });
  }

  req.session.user = {
    id: user.id,
    name: user.name,
    username: user.username
  };

  return res.json({ success: true, user: req.session.user });
});

app.get("/checkLogin", (req, res) => {
  return res.json({ logged: !!req.session.user });
});

app.get("/profile", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ success: false, error: "Não logado" });
  }

  return res.json(req.session.user);
});

app.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    return res.json({ success: true });
  });
});

app.delete("/deleteUser", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ success: false, error: "Não logado" });
  }

  const users = readUsers().filter(user => user.id !== req.session.user.id);
  saveUsers(users);

  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    return res.json({ success: true });
  });
});

app.use(express.static(ROOT));

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

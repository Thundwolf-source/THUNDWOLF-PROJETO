const hamburguer = document.querySelector('.traillermenu');
const navMenu = document.querySelector('.mrnufilm');

if (hamburguer && navMenu) {
  hamburguer.addEventListener('click', () => {
    hamburguer.classList.toggle('active');
    navMenu.classList.toggle('active');
  });
}

async function api(url, options = {}) {
  const config = {
    credentials: 'include',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  };

  const response = await fetch(url, config);

  let data = {};
  try {
    data = await response.json();
  } catch (error) {
    data = {};
  }

  return { response, data };
}

function getForm(target) {
  if (target && target.tagName === 'FORM') return target;
  return document.querySelector('form');
}

async function login(event) {
  if (event) event.preventDefault();

  const form = getForm(event?.target);
  const username = form?.querySelector('input[name="username"]')?.value?.trim() || '';
  const password = form?.querySelector('input[name="password"]')?.value || '';

  const { response, data } = await api('/login', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  });

  if (response.ok && data.success) {
    window.location.href = 'canais.html';
    return false;
  }

  alert(data.error || 'Não foi possível fazer login.');
  return false;
}

async function registerUser(event) {
  if (event) event.preventDefault();

  const form = getForm(event?.target);
  const name = form?.querySelector('input[name="name"]')?.value?.trim() || '';
  const username = form?.querySelector('input[name="username"]')?.value?.trim() || '';
  const password = form?.querySelector('input[name="password"]')?.value || '';

  const { response, data } = await api('/register', {
    method: 'POST',
    body: JSON.stringify({ name, username, password })
  });

  if (response.ok && data.success) {
    alert('Cadastro realizado com sucesso.');
    window.location.href = 'login.html';
    return false;
  }

  alert(data.error || 'Não foi possível cadastrar.');
  return false;
}

async function protectPage() {
  const page = window.location.pathname.split('/').pop().toLowerCase();
  if (!['perfil.html', 'canais.html'].includes(page)) return;

  const { data } = await api('/checkLogin', { method: 'GET' });

  if (!data.logged) {
    window.location.href = 'login.html';
  }
}

async function loadProfile() {
  const page = window.location.pathname.split('/').pop().toLowerCase();
  if (page !== 'perfil.html') return;

  const { response, data } = await api('/profile', { method: 'GET' });

  if (!response.ok || !data) {
    window.location.href = 'login.html';
    return;
  }

  const idEl = document.getElementById('profile-id') || document.getElementById('id');
  const nameEl = document.getElementById('profile-name') || document.getElementById('nome');
  const userEl = document.getElementById('profile-username') || document.getElementById('usuario');

  if (idEl) idEl.textContent = data.id ?? '';
  if (nameEl) nameEl.textContent = data.name ?? '';
  if (userEl) userEl.textContent = data.username ?? '';
}

async function logout(event) {
  if (event) event.preventDefault();
  await api('/logout', { method: 'POST' });
  window.location.href = 'login.html';
  return false;
}

async function deleteUser() {
  const ok = confirm('Tem certeza que deseja deletar sua conta?');
  if (!ok) return false;

  const { response, data } = await api('/deleteUser', { method: 'DELETE' });

  if (response.ok && data.success) {
    alert('Conta deletada com sucesso.');
    window.location.href = 'login.html';
    return false;
  }

  alert(data.error || 'Não foi possível deletar a conta.');
  return false;
}

document.addEventListener('DOMContentLoaded', async () => {
  await protectPage();
  await loadProfile();

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) logoutBtn.addEventListener('click', logout);

  const logoutLink = document.getElementById('logoutLink');
  if (logoutLink) logoutLink.addEventListener('click', logout);
});

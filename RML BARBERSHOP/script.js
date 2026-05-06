const themeToggle = document.getElementById('themeToggle');
const root = document.body;
const storageKey = 'rml-barbershop-theme';
const accountKey = 'rml-barbershop-account';
const accounts = {
  user: {
    password: 'user123',
    role: 'user',
    destination: 'user-dashboard.html'
  },
  staff: {
    password: 'staff123',
    role: 'staff',
    destination: 'staff-dashboard.html'
  },
  superadmin: {
    password: 'super123',
    role: 'superadmin',
    destination: 'super-admin-dashboard.html'
  }
};

function applyTheme(theme) {
  root.setAttribute('data-theme', theme);

  if (themeToggle) {
    themeToggle.textContent = theme === 'dark' ? 'Light' : 'Dark';
    themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
  }
}

function getPreferredTheme() {
  const savedTheme = localStorage.getItem(storageKey);

  if (savedTheme) {
    return savedTheme;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function toggleTheme() {
  const currentTheme = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
  localStorage.setItem(storageKey, nextTheme);
  applyTheme(nextTheme);
}

function setupServiceTabs() {
  const tabs = document.querySelectorAll('[data-service]');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const selectedId = tab.dataset.service;

      document.querySelectorAll('.service-section').forEach((section) => {
        section.hidden = section.id !== selectedId;
      });

      tabs.forEach((item) => {
        item.classList.toggle('active', item === tab);
      });
    });
  });
}

function setupLogin() {
  const loginForm = document.querySelector('[data-login-form]');
  const loginMessage = document.querySelector('[data-login-message]');

  if (!loginForm) {
    return;
  }

  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(loginForm);
    const username = String(formData.get('username') || '').trim().toLowerCase();
    const password = String(formData.get('password') || '');
    const account = accounts[username];

    if (!account || account.password !== password) {
      if (loginMessage) {
        loginMessage.textContent = 'Wrong username or password.';
      }
      return;
    }

    localStorage.setItem(accountKey, JSON.stringify({ username, role: account.role }));
    window.location.href = account.destination;
  });
}

function setupLogout() {
  document.querySelectorAll('[data-logout]').forEach((link) => {
    link.addEventListener('click', () => {
      localStorage.removeItem(accountKey);
    });
  });
}

document.querySelectorAll('.service-section').forEach((section, index) => {
  section.hidden = index !== 0;
});

applyTheme(getPreferredTheme());

if (themeToggle) {
  themeToggle.addEventListener('click', toggleTheme);
}

setupServiceTabs();
setupLogin();
setupLogout();

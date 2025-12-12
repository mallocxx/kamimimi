// Firebase auth state (restored from legacy script2)
let auth = null;

const firebaseConfig = {
  apiKey: 'AIzaSyCtAiMcKjB3NwRgAwk7d-bfGRU3h4T_yRA',
  authDomain: 'kamimi-tls.firebaseapp.com',
  projectId: 'kamimi-tls',
  storageBucket: 'kamimi-tls.firebasestorage.app',
  messagingSenderId: '718170574120',
  appId: '1:718170574120:web:cbd177cb8ea7c3c97f941d',
  measurementId: 'G-5RMGH45XZ2',
};

const navLinks = [
  { id: 'home', label: 'Главная' },
  { id: 'info', label: 'Информация' },
  { id: 'details', label: 'Детали' },
  { id: 'register', label: 'Регистрация' },
];

const categories = [
  'Web Security',
  'Cryptography',
  'Reverse Engineering',
  'Forensics',
  'PWN',
];

const prizes = [
  { place: '1', title: 'Первое место', description: 'Денежный приз 50,000₽ и сертификат победителя' },
  { place: '2', title: 'Второе место', description: 'Денежный приз 30,000₽ и сертификат призера' },
  { place: '3', title: 'Третье место', description: 'Денежный приз 20,000₽ и сертификат призера' },
];

const competitionDescription =
  'Присоединяйтесь к нашему CTF соревнованию и продемонстрируйте свои навыки в области кибербезопасности. Соревнование включает различные категории заданий, от веб-безопасности до криптографии и реверс-инжиниринга. Победители получат ценные призы и признание в сообществе.';

const targetDate = new Date('2025-12-13T10:00:00');
let countdownTimer;

function renderStaticContent() {
  const categoryList = document.getElementById('categoryList');
  if (categoryList) {
    categoryList.innerHTML = categories.map((c) => `<div class="tag fade">${c}</div>`).join('');
  }

  const prizeList = document.getElementById('prizeList');
  if (prizeList) {
    prizeList.innerHTML = prizes
      .map(
        (p) => `
          <div class="prize-card fade">
            <div class="prize-place">${p.place}</div>
            <div class="prize-title">${p.title}</div>
            <div class="prize-text">${p.description}</div>
          </div>
        `,
      )
      .join('');
  }

  const descriptionNode = document.getElementById('competitionDescription');
  if (descriptionNode) descriptionNode.textContent = competitionDescription;
}

function setActiveLink(targetId) {
  document.querySelectorAll('.nav-link').forEach((link) => {
    const match = link.getAttribute('data-target') === targetId;
    link.classList.toggle('active', match);
  });
}

function smoothScroll(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function initNavigation() {
  document.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.getAttribute('data-target');
      if (target) {
        smoothScroll(target);
        setActiveLink(target);
      }
    });
  });

  document.querySelectorAll('[data-scroll]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = btn.getAttribute('data-scroll');
      smoothScroll(target);
      setActiveLink(target);
    });
  });

  document.querySelectorAll('.footer-links a').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.getAttribute('data-target');
      smoothScroll(target);
      setActiveLink(target);
    });
  });
}

function updateCountdown() {
  const now = new Date();
  const diff = targetDate - now;
  const values = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  };

  if (diff > 0) {
    values.days = Math.floor(diff / (1000 * 60 * 60 * 24));
    values.hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    values.minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    values.seconds = Math.floor((diff % (1000 * 60)) / 1000);
  }

  const map = [
    ['countdown-days', values.days],
    ['countdown-hours', values.hours],
    ['countdown-minutes', values.minutes],
    ['countdown-seconds', values.seconds],
  ];

  map.forEach(([id, value]) => {
    const node = document.getElementById(id);
    if (node) node.textContent = String(value).padStart(2, '0');
  });
}

function initCountdown() {
  updateCountdown();
  countdownTimer = setInterval(updateCountdown, 1000);
}

function handleHeaderIntersection() {
  const header = document.getElementById('siteHeader');
  const hero = document.getElementById('home');
  if (!header || !hero) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      header.classList.toggle('solid', !entry.isIntersecting);
    },
    { rootMargin: '-50% 0px 0px 0px' },
  );

  observer.observe(hero);
}

function setMessage(text, type = '') {
  const msg = document.getElementById('formMessage');
  if (!msg) return;
  msg.textContent = text || '';
  msg.classList.remove('success', 'error');
  if (text) {
    msg.classList.add(type === 'success' ? 'success' : 'error');
  }
}

async function handleSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const btn = document.getElementById('submitBtn');

  const payload = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    experience: form.experience.value,
    extra: form.message.value.trim(),
  };

  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Отправка...';
  }
  setMessage('');

  try {
    const response = await fetch('https://localhost:443', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const text = await response.text();
    let data = {};
    if (text) {
      try {
        data = JSON.parse(text);
      } catch (_) {
        data = { error: 'Ошибка обработки ответа сервера' };
      }
    }

    if (response.ok) {
      setMessage('Регистрация успешна! Проверьте вашу почту для подтверждения.', 'success');
      form.reset();
    } else {
      setMessage(data.error || `Ошибка сервера (${response.status}). Попробуйте позже.`, 'error');
    }
  } catch (error) {
    setMessage('Ошибка соединения с сервером. Убедитесь, что сервер запущен.', 'error');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Зарегистрироваться';
    }
  }
}

function initForm() {
  const form = document.getElementById('registerForm');
  if (form) form.addEventListener('submit', handleSubmit);
}

// --- Firebase helpers restored from script2.js ---
function initFirebase() {
  try {
    if (!window.firebase) return;
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    auth = firebase.auth();
    auth.onAuthStateChanged((user) => {
      if (user) {
        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        };
        localStorage.setItem('firebase_user', JSON.stringify(userData));
      } else {
        localStorage.removeItem('firebase_user');
      }
      checkAuthStatus();
    });
    checkAuthStatus();
  } catch (error) {
    console.error('Ошибка инициализации Firebase:', error);
  }
}

function checkAuthStatus() {
  const authButton = document.getElementById('authButton');
  const userStatus = document.getElementById('userStatus');
  const stored = localStorage.getItem('firebase_user');

  if (stored) {
    const userData = JSON.parse(stored);
    const shortEmail = userData.email.split('@')[0];

    if (authButton) {
      authButton.innerHTML = `<i class="fas fa-user-check"></i> ${shortEmail}`;
      authButton.onclick = logout;
    }

    if (userStatus) {
      userStatus.innerHTML = `
        <p style="margin: 0 0 16px 0; color: rgba(255, 255, 255, 0.9); font-weight: 500;">
          <i class="fas fa-check-circle" style="color: #48BB78;"></i> Вы вошли как: ${shortEmail}
        </p>
        <button onclick="logout()" class="auth-status-btn" style="background: rgba(245, 101, 101, 0.1); border-color: rgba(245, 101, 101, 0.3);">
          <i class="fas fa-sign-out-alt"></i> Выйти из системы
        </button>
      `;
    }
  } else {
    if (authButton) {
      authButton.innerHTML = `<i class="fas fa-user"></i> Войти`;
      authButton.onclick = loginWithGoogle;
    }

    if (userStatus) {
      userStatus.innerHTML = `
        <p style="margin: 0 0 16px 0; color: rgba(255, 255, 255, 0.7);">
          Для доступа к материалам войдите в систему
        </p>
        <button id="authStatusBtn" class="auth-status-btn">
          <i class="fas fa-sign-in-alt"></i> Войти через Google
        </button>
      `;
      const newAuthBtn = document.getElementById('authStatusBtn');
      if (newAuthBtn) {
        newAuthBtn.addEventListener('click', loginWithGoogle);
      }
    }
  }
}

async function loginWithGoogle() {
  try {
    if (!auth) {
      showNotification('Пожалуйста, подождите...', 'info');
      setTimeout(loginWithGoogle, 800);
      return;
    }
    const provider = new firebase.auth.GoogleAuthProvider();
    const result = await auth.signInWithPopup(provider);
    const user = {
      uid: result.user.uid,
      email: result.user.email,
      displayName: result.user.displayName,
      photoURL: result.user.photoURL,
    };
    localStorage.setItem('firebase_user', JSON.stringify(user));
    checkAuthStatus();
    showNotification('Успешный вход! Доступ к материалам открыт.', 'success');
  } catch (error) {
    console.error('Ошибка входа:', error);
    showNotification('Ошибка авторизации', 'error');
  }
}

async function logout() {
  try {
    if (auth) {
      await auth.signOut();
    }
    localStorage.removeItem('firebase_user');
    checkAuthStatus();
    showNotification('Вы вышли из системы', 'info');
  } catch (error) {
    console.error('Ошибка выхода:', error);
    showNotification('Ошибка при выходе', 'error');
  }
}

function showNotification(message, type = 'info') {
  document.querySelectorAll('.notification').forEach((n) => n.remove());

  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
    <span>${message}</span>
  `;
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    padding: 16px 24px;
    background: ${
      type === 'success'
        ? 'rgba(72, 187, 120, 0.95)'
        : type === 'error'
          ? 'rgba(245, 101, 101, 0.95)'
          : 'rgba(66, 153, 225, 0.95)'
    };
    color: white;
    border-radius: 12px;
    z-index: 10000;
    animation: slideInRight 0.3s ease;
    max-width: 300px;
    font-weight: 500;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    gap: 12px;
    backdrop-filter: blur(10px);
    border: 1px solid ${
      type === 'success'
        ? 'rgba(72, 187, 120, 0.2)'
        : type === 'error'
          ? 'rgba(245, 101, 101, 0.2)'
          : 'rgba(66, 153, 225, 0.2)'
    };
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

function initActiveOnScroll() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveLink(entry.target.id);
        }
      });
    },
    { threshold: 0.5 },
  );

  ['home', 'info', 'details', 'register'].forEach((id) => {
    const node = document.getElementById(id);
    if (node) observer.observe(node);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderStaticContent();
  initNavigation();
  initCountdown();
  initForm();
  handleHeaderIntersection();
  initActiveOnScroll();
  initFirebase();
});


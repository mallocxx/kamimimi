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
});


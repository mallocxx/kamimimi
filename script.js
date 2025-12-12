// Инициализация Firebase
let auth = null;

function initFirebase() {
    try {
        const firebaseConfig = {
            apiKey: "AIzaSyDEXAMPLEEXAMPLEEXAMPLEEXAMPLE",
            authDomain: "your-project.firebaseapp.com",
            projectId: "your-project-id",
            storageBucket: "your-project.appspot.com",
            messagingSenderId: "1234567890",
            appId: "1:1234567890:web:abc123def456"
        };

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
                    photoURL: user.photoURL
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

// Создание частиц для фона
function createParticles() {
    const particles = document.getElementById('particles');
    if (!particles) return;
    
    particles.innerHTML = '';
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 2 + 1;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const duration = Math.random() * 30 + 20;
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${posX}%;
            top: ${posY}%;
            background: ${Math.random() > 0.5 ? 'var(--primary)' : 'var(--accent)'};
            border-radius: 50%;
            opacity: ${Math.random() * 0.15 + 0.05};
            animation: floatParticle ${duration}s linear infinite;
            animation-delay: ${Math.random() * -20}s;
        `;
        
        particles.appendChild(particle);
    }
}

// Добавляем стили для частиц
function addParticleStyles() {
    if (!document.querySelector('#particle-styles')) {
        const style = document.createElement('style');
        style.id = 'particle-styles';
        style.textContent = `
            @keyframes floatParticle {
                0%, 100% {
                    transform: translate(0, 0);
                }
                25% {
                    transform: translate(${Math.random() * 40 - 20}px, ${Math.random() * 40 - 20}px);
                }
                50% {
                    transform: translate(${Math.random() * 40 - 20}px, ${Math.random() * 40 - 20}px);
                }
                75% {
                    transform: translate(${Math.random() * 40 - 20}px, ${Math.random() * 40 - 20}px);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// ПЛАВНЫЕ АНИМАЦИИ ДЛЯ ВСЕХ ЭЛЕМЕНТОВ
let currentSection = 'home';

function initSmoothAnimations() {
    // Инициализация - показываем первую секцию
    activateSection('home');
    
    // Плавное появление всех элементов при загрузке
    animateElementsOnLoad();
    
    // Обработчик кликов по навигации
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            if (targetId && targetId !== currentSection) {
                navigateToSection(targetId);
            }
        });
    });
    
    // Обработчик скролла для плавных анимаций
    window.addEventListener('scroll', handleScrollAnimations);
    
    // Обработчик индикатора скролла
    document.querySelectorAll('.scroll-dot').forEach(dot => {
        dot.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-section');
            if (targetId !== currentSection) {
                navigateToSection(targetId);
            }
        });
    });
    
    // Мобильное меню
    initMobileMenu();
}

// Плавная навигация к секции
function navigateToSection(sectionId) {
    if (sectionId === currentSection) return;
    
    const targetElement = document.getElementById(sectionId);
    if (!targetElement) return;
    
    // Плавный скролл
    const navHeight = 80;
    const targetPosition = targetElement.offsetTop - navHeight;
    
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
    
    // Обновляем UI
    updateNavigation(sectionId);
    updateScrollIndicator(sectionId);
    currentSection = sectionId;
    
    // Активируем секцию
    setTimeout(() => {
        activateSection(sectionId);
    }, 300);
}

// Активация секции с плавными анимациями
function activateSection(sectionId) {
    // Убираем активный класс у всех секций
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Добавляем активный класс целевой секции
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.add('active');
        
        // Запускаем анимации элементов в секции
        setTimeout(() => {
            animateElementsInSection(section);
        }, 100);
    }
}

// Анимация элементов при загрузке
function animateElementsOnLoad() {
    // Анимация для всех текстовых элементов
    document.querySelectorAll('.text-animation').forEach((el, index) => {
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 100 + (index * 50));
    });
    
    // Анимация для карточек услуг
    document.querySelectorAll('.service-card').forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 300 + (index * 100));
    });
    
    // Анимация для элементов "Обо мне"
    document.querySelectorAll('.about-left .text-animation, .about-right .text-animation').forEach((el, index) => {
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 400 + (index * 80));
    });
    
    // Анимация для элементов "Контакты"
    document.querySelectorAll('.contact-form-card, .contact-info-card').forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 500 + (index * 150));
    });
}

// Анимация элементов в конкретной секции
function animateElementsInSection(section) {
    // Анимация текстовых элементов
    section.querySelectorAll('.text-animation').forEach((el, index) => {
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 50 + (index * 30));
    });
    
    // Анимация карточек
    section.querySelectorAll('.service-card').forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 200 + (index * 50));
    });
    
    // Анимация других элементов
    section.querySelectorAll('.profile-card, .skills-card, .timeline-card, .philosophy-card').forEach((el, index) => {
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 150 + (index * 40));
    });
}

// Обработчик скролла для плавных анимаций
function handleScrollAnimations() {
    const scrollPosition = window.scrollY + window.innerHeight * 0.8;
    
    // Анимация элементов при скролле
    document.querySelectorAll('.service-card, .profile-card, .skills-card, .timeline-card, .philosophy-card, .contact-form-card, .contact-info-card').forEach(el => {
        const elementPosition = el.offsetTop;
        
        if (scrollPosition > elementPosition) {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }
    });
    
    // Обновление активной секции
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const sectionId = section.getAttribute('id');
        
        if (window.scrollY >= sectionTop - 100 && window.scrollY < sectionTop + sectionHeight - 100) {
            if (sectionId !== currentSection) {
                currentSection = sectionId;
                updateNavigation(sectionId);
                updateScrollIndicator(sectionId);
            }
        }
    });
}

// Обновление навигации
function updateNavigation(sectionId) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
        }
    });
}

// Обновление индикатора скролла
function updateScrollIndicator(sectionId) {
    document.querySelectorAll('.scroll-dot').forEach(dot => {
        dot.classList.remove('active');
        if (dot.getAttribute('data-section') === sectionId) {
            dot.classList.add('active');
        }
    });
}

// Мобильное меню
function initMobileMenu() {
    const burger = document.querySelector('#burger');
    const navLinks = document.querySelector('#navLinks');
    
    if (burger) {
        burger.addEventListener('click', function(e) {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            burger.classList.toggle('active');
            
            // Плавная анимация для мобильного меню
            if (navLinks.classList.contains('active')) {
                navLinks.querySelectorAll('.nav-link').forEach((link, index) => {
                    setTimeout(() => {
                        link.style.opacity = '1';
                        link.style.transform = 'translateY(0)';
                    }, index * 50);
                });
            }
        });
        
        // Закрытие меню при клике вне его
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !burger.contains(e.target)) {
                navLinks.classList.remove('active');
                burger.classList.remove('active');
            }
        });
    }
}

// Проверка статуса авторизации
function checkAuthStatus() {
    const authButton = document.getElementById('authButton');
    const userStatus = document.getElementById('userStatus');
    
    // Проверяем, есть ли сохраненная сессия
    const user = localStorage.getItem('firebase_user');
    
    if (user) {
        const userData = JSON.parse(user);
        const shortEmail = userData.email.split('@')[0];
        
        // Обновляем кнопку в навигации
        if (authButton) {
            authButton.innerHTML = `<i class="fas fa-user-check"></i> ${shortEmail}`;
            authButton.onclick = logout;
        }
        
        // Обновляем статус в контактах
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
        // Не авторизован
        if (authButton) {
            authButton.innerHTML = `<i class="fas fa-user"></i> Войти`;
            authButton.onclick = loginWithGoogle;
        }
        
        if (userStatus) {
            userStatus.innerHTML = `
                <p style="margin: 0 0 16px 0; color: rgba(255, 255, 255, 0.7);">
                    Для доступа к портфолио и дополнительным материалам войдите в систему
                </p>
                <button id="authStatusBtn" class="auth-status-btn">
                    <i class="fas fa-sign-in-alt"></i> Войти через Google
                </button>
            `;
            
            // Перепривязываем событие
            const newAuthBtn = document.getElementById('authStatusBtn');
            if (newAuthBtn) {
                newAuthBtn.addEventListener('click', loginWithGoogle);
            }
        }
    }
}

// Вход через Google
async function loginWithGoogle() {
    try {
        if (!auth) {
            showNotification('Пожалуйста, подождите...', 'info');
            setTimeout(loginWithGoogle, 1000);
            return;
        }
        
        const provider = new firebase.auth.GoogleAuthProvider();
        const result = await auth.signInWithPopup(provider);
        
        // Сохраняем пользователя в localStorage
        const user = {
            uid: result.user.uid,
            email: result.user.email,
            displayName: result.user.displayName,
            photoURL: result.user.photoURL
        };
        localStorage.setItem('firebase_user', JSON.stringify(user));
        
        // Обновляем UI
        checkAuthStatus();
        
        // Показываем уведомление
        showNotification('Успешный вход! Доступ к материалам открыт.', 'success');
        
    } catch (error) {
        console.error('Ошибка входа:', error);
        showNotification('Ошибка авторизации', 'error');
    }
}

// Выход
async function logout() {
    try {
        if (auth) {
            await auth.signOut();
        }
        localStorage.removeItem('firebase_user');
        
        // Обновляем UI
        checkAuthStatus();
        
        // Показываем уведомление
        showNotification('Вы вышли из системы', 'info');
        
    } catch (error) {
        console.error('Ошибка выхода:', error);
        showNotification('Ошибка при выходе', 'error');
    }
}

// Уведомления
function showNotification(message, type = 'info') {
    // Удаляем старые уведомления
    document.querySelectorAll('.notification').forEach(n => n.remove());
    
    // Создаем элемент уведомления
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
        background: ${type === 'success' ? 'rgba(72, 187, 120, 0.95)' : type === 'error' ? 'rgba(245, 101, 101, 0.95)' : 'rgba(66, 153, 225, 0.95)'};
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
        border: 1px solid ${type === 'success' ? 'rgba(72, 187, 120, 0.2)' : type === 'error' ? 'rgba(245, 101, 101, 0.2)' : 'rgba(66, 153, 225, 0.2)'};
    `;
    
    document.body.appendChild(notification);
    
    // Плавное удаление через 3 секунды
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Создаем частицы
    addParticleStyles();
    createParticles();
    
    // Инициализируем Firebase
    initFirebase();
    
    // Инициализируем плавные анимации
    initSmoothAnimations();
    
    // Обработка начального хэша в URL
    const initialHash = window.location.hash.substring(1);
    if (initialHash && initialHash !== 'home') {
        setTimeout(() => {
            navigateToSection(initialHash);
        }, 500);
    }
    
    // Обновляем частицы при изменении размера окна
    window.addEventListener('resize', function() {
        createParticles();
    });
});

// Обработка истории браузера
window.addEventListener('popstate', function() {
    const hash = window.location.hash.substring(1);
    if (hash && hash !== currentSection) {
        navigateToSection(hash);
    }
});
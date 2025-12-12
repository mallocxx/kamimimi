const ORGANIZER_EMAIL = 'progristillidan@gmail.com';
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mkgdblwj';

// Инициализация формы с плавными анимациями
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        // Плавная анимация для полей формы
        animateFormFields();
        
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const formMessage = document.getElementById('formMessage');
            
            // Валидация
            const name = contactForm.querySelector('#name').value.trim();
            const email = contactForm.querySelector('#email').value.trim();
            const message = contactForm.querySelector('#message').value.trim();
            const project = contactForm.querySelector('#project') ? contactForm.querySelector('#project').value.trim() : '';
            
            if (!name || !email || !message) {
                showFormMessage('Пожалуйста, заполните все обязательные поля (*)', 'error', formMessage);
                shakeFormField('#name');
                shakeFormField('#email');
                shakeFormField('#message');
                return;
            }
            
            if (!validateEmail(email)) {
                showFormMessage('Пожалуйста, введите корректный email адрес', 'error', formMessage);
                shakeFormField('#email');
                return;
            }
            
            // Показать загрузку с анимацией
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
            submitBtn.disabled = true;
            
            // Плавное затемнение кнопки
            submitBtn.style.opacity = '0.7';
            submitBtn.style.transform = 'scale(0.98)';
            
            try {
                // Формируем полезную нагрузку для организатора
                const payload = {
                    _subject: 'Регистрация участника',
                    organizer_email: ORGANIZER_EMAIL,
                    name,
                    email,
                    project: project || 'Не указан',
                    message,
                    _replyto: email,
                    summary: `Имя: ${name}\nEmail: ${email}\nПроект: ${project || 'Не указан'}\nСообщение: ${message}`
                };
                
                // Отправка через Formspree (почта организатора получит письмо)
                const response = await fetch(FORMSPREE_ENDPOINT, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });
                
                if (response.ok) {
                    // Успешная отправка
                    showFormMessage('SUCCESS', 'success', formMessage);
                    
                    // Плавная анимация успеха
                    submitBtn.style.background = 'linear-gradient(135deg, #48BB78 0%, #38A169 100%)';
                    submitBtn.innerHTML = '<i class="fas fa-check"></i> Отправлено!';
                    
                    // Плавный сброс формы
                    setTimeout(() => {
                        contactForm.reset();
                        submitBtn.style.background = '';
                        submitBtn.innerHTML = originalText;
                    }, 2000);
                } else {
                    throw new Error('Ошибка отправки');
                }
            } catch (error) {
                console.error('Form submission error:', error);
                showFormMessage('ERROR', 'error', formMessage);
                
                // Анимация ошибки
                submitBtn.style.background = 'linear-gradient(135deg, #F56565 0%, #C53030 100%)';
                setTimeout(() => {
                    submitBtn.style.background = '';
                }, 1000);
            } finally {
                // Восстанавливаем кнопку
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = '1';
                    submitBtn.style.transform = 'scale(1)';
                }, 3000);
            }
        });
        
        // Анимация при фокусе на полях
        contactForm.querySelectorAll('.form-input, .form-textarea, select').forEach(field => {
            field.addEventListener('focus', function() {
                this.parentElement.style.transform = 'translateY(-2px)';
                this.style.borderColor = 'var(--accent)';
            });
            
            field.addEventListener('blur', function() {
                this.parentElement.style.transform = 'translateY(0)';
                if (!this.value) {
                    this.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                }
            });
            
            // Плавное появление при вводе
            field.addEventListener('input', function() {
                if (this.value) {
                    this.style.opacity = '1';
                }
            });
        });
    }
});

// Анимация полей формы
function animateFormFields() {
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach((group, index) => {
        group.style.opacity = '0';
        group.style.transform = 'translateY(20px)';
        group.style.transition = 'all 0.5s ease';
        
        setTimeout(() => {
            group.style.opacity = '1';
            group.style.transform = 'translateY(0)';
        }, 100 + (index * 100));
    });
}

// Валидация email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Показать сообщение формы
function showFormMessage(message, type, container) {
    container.textContent = message;
    container.className = `form-message ${type}`;
    container.style.display = 'block';
    
    // Плавное появление
    container.style.opacity = '0';
    container.style.transform = 'translateY(-10px)';
    
    setTimeout(() => {
        container.style.opacity = '1';
        container.style.transform = 'translateY(0)';
    }, 10);
    
    // Автоматическое скрытие
    setTimeout(() => {
        if (container.style.display !== 'none') {
            container.style.opacity = '0';
            container.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                container.style.display = 'none';
                container.style.opacity = '1';
                container.style.transform = 'translateY(0)';
            }, 300);
        }
    }, 8000);
}

// Анимация встряхивания поля формы
function shakeFormField(selector) {
    const field = document.querySelector(selector);
    if (!field) return;
    
    field.style.animation = 'shake 0.5s ease';
    setTimeout(() => {
        field.style.animation = '';
    }, 500);
}

// Добавляем CSS для анимаций формы
if (!document.querySelector('#form-animations')) {
    const style = document.createElement('style');
    style.id = 'form-animations';
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .fa-spin {
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .form-group {
            transition: all 0.3s ease;
        }
        
        .form-group:hover {
            transform: translateY(-2px);
        }
        
        .form-input, .form-textarea, select {
            transition: all 0.3s ease;
        }
        
        .form-input:focus, .form-textarea:focus, select:focus {
            transform: translateY(-1px);
            box-shadow: 0 5px 15px rgba(255, 107, 53, 0.1);
        }
        
        .submit-btn {
            transition: all 0.3s ease !important;
        }
        
        .submit-btn:hover {
            transform: translateY(-2px) !important;
        }
    `;
    document.head.appendChild(style);
}
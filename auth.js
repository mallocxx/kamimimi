// Конфигурация Firebase 
const firebaseConfig = {
    apiKey: "AIzaSyCtAiMcKjB3NwRgAwk7d-bfGRU3h4T_yRA",
    authDomain: "kamimi-tls.firebaseapp.com",
    projectId: "kamimi-tls",
    storageBucket: "kamimi-tls.firebasestorage.app",
    messagingSenderId: "718170574120",
    appId: "1:718170574120:web:cbd177cb8ea7c3c97f941d",
    measurementId: "G-5RMGH45XZ2"
};

// Инициализация Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Кнопка авторизации
document.addEventListener('DOMContentLoaded', function() {
    const authButton = document.getElementById('authButton');
    const userStatus = document.getElementById('userStatus');
    
    if (authButton) {
        // Проверка текущего статуса
        auth.onAuthStateChanged((user) => {
            if (user) {
                // Пользователь авторизован
                authButton.textContent = 'Выйти';
                authButton.style.background = '#555';
                
                if (userStatus) {
                    userStatus.innerHTML = `
                        <p>Вы вошли как: ${user.email}</p>
                        <button onclick="logout()" style="margin-top: 10px; padding: 5px 10px; background: var(--burgundy); color: white; border: none; border-radius: 2px; cursor: pointer;">
                            Выйти
                        </button>
                    `;
                }
            } else {
                // Пользователь не авторизован
                authButton.textContent = 'Войти через Google';
                authButton.style.background = '';
                
                if (userStatus) {
                    userStatus.innerHTML = '<p>Вы не авторизованы</p>';
                }
            }
        });
        
        // Обработчик клика по кнопке
        authButton.addEventListener('click', function() {
            if (auth.currentUser) {
                logout();
            } else {
                loginWithGoogle();
            }
        });
    }
});

// Вход через Google
function loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    
    auth.signInWithPopup(provider)
        .then((result) => {
            console.log('Успешный вход:', result.user);
        })
        .catch((error) => {
            console.error('Ошибка входа:', error);
            alert('Ошибка авторизации: ' + error.message);
        });
}

// Выход
function logout() {
    auth.signOut()
        .then(() => {
            console.log('Успешный выход');
        })
        .catch((error) => {
            console.error('Ошибка выхода:', error);
        });
}
import { navigateTo } from '../../index.js'; 

export const renderLogin = () => {
    const loginContainer = document.createElement('div');
    loginContainer.classList.add('login-container');

    const title = document.createElement('h2');
    title.textContent = 'Iniciar Sesión';

    const usernameInput = document.createElement('input');
    usernameInput.type = 'text';
    usernameInput.id = 'username';
    usernameInput.placeholder = 'Usuario';

    const passwordInput = document.createElement('input');
    passwordInput.type = 'password';
    passwordInput.id = 'password';
    passwordInput.placeholder = 'Contraseña';

    const loginButton = document.createElement('button');
    loginButton.id = 'loginButton';
    loginButton.textContent = 'Ingresar';

    loginContainer.appendChild(title);
    loginContainer.appendChild(usernameInput);
    loginContainer.appendChild(passwordInput);
    loginContainer.appendChild(loginButton);

    // Lógica de inicio de sesión
    loginButton.addEventListener('click', async () => {
        const usuario = usernameInput.value;
        const contraseña = passwordInput.value;

        if (!usuario || !contraseña) {
            alert('Por favor, complete todos los campos');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/login', {  
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario, contraseña })  
            });

            if (!response.ok) {
                const data = await response.json();
                alert(data.error);  
            } else {
                const data = await response.json();
                // Almacena el id y el nombre del maestro
                localStorage.setItem('id_maestro', data.id_maestro);
                alert(`Bienvenido ${data.nombre}`);
                navigateTo('/grados');  // Redirige a la página de grados
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            alert('Error al conectar con el servidor');
        }
    });

    return loginContainer;
};

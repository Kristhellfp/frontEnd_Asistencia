import { renderLogin } from './componentes/login/login.js';
import { renderGrados } from './componentes/grados/grados.js';
import { renderEstudiantes } from './componentes/estudiantes/estudiantes.js';
import { renderHeader } from './componentes/header/header.js';

document.body.innerHTML = `
  <div id="app-root">
    <div id="header-container"></div>
    <div id="main-content-container"></div>
  </div>
`;

const headerContainer = document.getElementById('header-container');
const appContainer = document.getElementById('main-content-container');

headerContainer.appendChild(renderHeader());

const headerStyles = `
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: white;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
`;
document.querySelector('header').style.cssText = headerStyles;

appContainer.style.marginTop = '70px'; // Igual que la altura del header

const loadCSS = (path) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = path;
    document.head.appendChild(link);
};

loadCSS('./componentes/header/header.css');
loadCSS('./componentes/grados/grados.css');
loadCSS('./componentes/estudiantes/estudiantes.css');

const router = async () => {
    const path = window.location.hash.replace('#', '') || '/login';
    appContainer.innerHTML = ''; // Solo limpia el contenido

    try {
        let component;
        switch (true) {
            case path === '/login':
                component = await renderLogin();
                break;
            case path === '/grados':
                component = await renderGrados();
                break;
            case path.startsWith('/estudiantes/'):
                const gradoId = path.split('/')[2];
                if (!gradoId || isNaN(gradoId)) {
                    navigateTo('/grados');
                    return;
                }
                component = await renderEstudiantes(gradoId);
                break;
            default:
                navigateTo('/login');
                return;
        }

        if (component instanceof Node) {
            appContainer.appendChild(component);
        } else {
            throw new Error(`Componente para ruta "${path}" no es válido`);
        }
    } catch (error) {
        console.error('Error en router:', error);
        appContainer.innerHTML = `
            <div class="error">
                <h3>⚠️ Error crítico</h3>
                <p>${error.message}</p>
                <button onclick="location.reload()">Reintentar</button>
            </div>
        `;
    }
};

export const navigateTo = (path) => {
    console.log(`Navegando a: ${path}`);
    if (!path.startsWith('/')) {
        console.warn('Las rutas deben comenzar con "/". Redirigiendo a /login');
        path = '/login';
    }
    window.history.pushState({}, '', `#${path}`);
    window.dispatchEvent(new Event('popstate'));
};

window.addEventListener('popstate', router);
window.addEventListener('load', router);
window.app = { navigateTo, router };
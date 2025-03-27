import { navigateTo } from '../../index.js'; 

export const renderGrados = async () => {
    const container = document.createElement('div');
    container.className = 'grados-container';

    try {
        const idMaestro = localStorage.getItem('id_maestro');
        console.log('[FRONT] ID Maestro obtenido de localStorage:', idMaestro);
        
        if (!idMaestro) {
            console.warn('[FRONT] No se encontró ID de maestro, redirigiendo a login');
            navigateTo('/login');
            return container;
        }

        const title = document.createElement('h2');
        title.textContent = 'Mis Grados';
        container.appendChild(title);

        const loader = document.createElement('div');
        loader.className = 'loader';
        container.appendChild(loader);

        console.log('[FRONT] Solicitando grados al servidor...');
        const response = await fetch(`http://localhost:5000/api/grados/${idMaestro}`);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Error al cargar grados');
        }

        const grados = await response.json();
        console.log('[FRONT] Grados recibidos:', grados);

        container.removeChild(loader);

        if (grados.length === 0) {
            const message = document.createElement('p');
            message.textContent = 'No tienes grados asignados.';
            container.appendChild(message);
        } else {
            const list = document.createElement('ul');
            list.className = 'grados-list';
            
            grados.forEach(grado => {
                const item = document.createElement('li');
                item.className = 'grado-item';
                
                const span = document.createElement('span');
                span.className = 'grado-nombre';
                span.textContent = grado.nombre;

                const button = document.createElement('button');
                button.className = 'btn-ver-estudiantes';
                button.textContent = 'Ver Estudiantes';
                button.addEventListener('click', () => {
                    console.log(`[FRONT] Navegando a estudiantes del grado ID: ${grado.id}`);
                    navigateTo(`/estudiantes/${grado.id}`);
                });

                item.appendChild(span);
                item.appendChild(button);
                list.appendChild(item);
            });
            container.appendChild(list);
        }

    } catch (error) {
        console.error('[FRONT] Error al renderizar grados:', error);
        
        const loader = container.querySelector('.loader');
        if (loader) container.removeChild(loader);

        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';

        const errorTitle = document.createElement('h3');
        errorTitle.textContent = '⚠️ Error al cargar grados';

        const errorMsg = document.createElement('p');
        errorMsg.textContent = error.message || 'No se pudieron cargar los grados.';
        errorMsg.style.color = 'red';

        const retryBtn = document.createElement('button');
        retryBtn.className = 'btn-reintentar';
        retryBtn.textContent = 'Reintentar';
        retryBtn.addEventListener('click', () => {
            console.log('[FRONT] Reintentando cargar grados...');
            location.reload();
        });

        errorDiv.appendChild(errorTitle);
        errorDiv.appendChild(errorMsg);
        errorDiv.appendChild(retryBtn);
        container.appendChild(errorDiv);
    }

    return container;
};
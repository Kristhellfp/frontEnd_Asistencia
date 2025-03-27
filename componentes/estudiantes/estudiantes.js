export const renderEstudiantes = async (gradoId) => {
    const container = document.createElement('div');
    container.className = 'estudiantes-container';

    const hoy = new Date().toISOString().split('T')[0];

    // Función para guardar toda la asistencia
    const guardarTodaAsistencia = async () => {
        const items = container.querySelectorAll('.alumno-item');
        let guardadosExitosos = 0;
        let errores = 0;

        for (const item of items) {
            const alumnoId = item.dataset.id;
            const presente = item.querySelector('input[value="presente"]:checked') !== null;
            const observaciones = item.querySelector('.observacion-input').value;

            try {
                const response = await fetch('http://localhost:5000/api/asistencia', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        alumno_id: alumnoId,
                        fecha: hoy,
                        presente: presente,
                        observaciones: observaciones
                    })
                });

                if (response.ok) guardadosExitosos++;
                else errores++;
            } catch (error) {
                errores++;
                console.error(`Error al guardar asistencia para alumno ${alumnoId}:`, error);
            }
        }

        const estadoContainer = document.createElement('div');
        estadoContainer.className = 'estado-guardado';
        estadoContainer.textContent = errores === 0 
            ? `Asistencia registrada para ${guardadosExitosos} alumnos` 
            : `Guardado: ${guardadosExitosos} | Errores: ${errores}`;

        const topButtons = container.querySelector('.top-buttons');
        const existingEstado = container.querySelector('.estado-guardado');
        if (existingEstado) existingEstado.remove();
        topButtons.insertAdjacentElement('afterend', estadoContainer);
    };

    // Función para cerrar sesión
    const cerrarSesion = () => {
        localStorage.removeItem('id_maestro');
        window.location.hash = '#/login';
    };

    try {
        const response = await fetch(`http://localhost:5000/api/estudiantes/${gradoId}`);
        if (!response.ok) throw new Error('Error al cargar alumnos');
        const { grado, alumnos } = await response.json();

        const title = document.createElement('h2');
        title.textContent = `Asistencia - ${grado.nombre}`;

        const fechaDisplay = document.createElement('p');
        fechaDisplay.textContent = `Fecha: ${new Date(hoy).toLocaleDateString()}`;

        const topButtons = document.createElement('div');
        topButtons.className = 'top-buttons';
        
        const saveAllButton = document.createElement('button');
        saveAllButton.className = 'btn-guardar-todo';
        saveAllButton.textContent = 'Guardar Todo';
        saveAllButton.addEventListener('click', guardarTodaAsistencia);
        
        const logoutButton = document.createElement('button');
        logoutButton.className = 'btn-logout';
        logoutButton.textContent = 'Cerrar Sesión';
        logoutButton.addEventListener('click', cerrarSesion);
        
   
        topButtons.appendChild(saveAllButton);
        topButtons.appendChild(logoutButton);
        
        container.appendChild(title);
        container.appendChild(fechaDisplay);
        container.appendChild(topButtons);

        // Lista de alumnos
        if (alumnos.length === 0) {
            const message = document.createElement('p');
            message.textContent = 'No hay alumnos en este grado.';
            container.appendChild(message);
        } else {
            const list = document.createElement('ul');
            list.className = 'lista-alumnos';
            
            alumnos.forEach(alumno => {
                const item = document.createElement('li');
                item.className = 'alumno-item';
                item.dataset.id = alumno.id;
              
                const alumnoInfo = document.createElement('div');
                alumnoInfo.className = 'alumno-info';
                alumnoInfo.textContent = `${alumno.apellido}, ${alumno.nombre}`;
                
                const asistenciaControls = document.createElement('div');
                asistenciaControls.className = 'asistencia-controls';
            
                const grupoAsistencia = document.createElement('div');
                grupoAsistencia.className = 'grupo-asistencia';
                
                const presenteLabel = document.createElement('label');
                const presenteInput = document.createElement('input');
                presenteInput.type = 'radio';
                presenteInput.name = `asistencia-${alumno.id}`;
                presenteInput.value = 'presente';
                const presenteText = document.createTextNode('Presente');
                presenteLabel.appendChild(presenteInput);
                presenteLabel.appendChild(presenteText);
                
                const ausenteLabel = document.createElement('label');
                const ausenteInput = document.createElement('input');
                ausenteInput.type = 'radio';
                ausenteInput.name = `asistencia-${alumno.id}`;
                ausenteInput.value = 'ausente';
                const ausenteText = document.createTextNode('Ausente');
                ausenteLabel.appendChild(ausenteInput);
                ausenteLabel.appendChild(ausenteText);
                
                grupoAsistencia.appendChild(presenteLabel);
                grupoAsistencia.appendChild(ausenteLabel);
                
                const observacionesInput = document.createElement('input');
                observacionesInput.type = 'text';
                observacionesInput.className = 'observacion-input';
                observacionesInput.placeholder = 'Observaciones';
                
                const buttonContainer = document.createElement('div');
                buttonContainer.className = 'button-container';
                
                const saveButton = document.createElement('button');
                saveButton.className = 'btn-guardar';
                saveButton.textContent = 'Guardar';
                saveButton.addEventListener('click', async () => {
                    if (!presenteInput.checked && !ausenteInput.checked) {
                        const estado = buttonContainer.querySelector('.estado-guardado');
                        if (estado) estado.remove();
                        
                        const alerta = document.createElement('div');
                        alerta.className = 'alerta';
                        alerta.textContent = 'Seleccione Presente o Ausente';
                        buttonContainer.appendChild(alerta);
                        setTimeout(() => alerta.remove(), 2000);
                        return;
                    }
                    
                    try {
                        const response = await fetch('http://localhost:5000/api/asistencia', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                alumno_id: alumno.id,
                                fecha: hoy,
                                presente: presenteInput.checked ? 1 : 0,
                                observaciones: observacionesInput.value
                            })
                        });
                        
                        if (response.ok) {
                            const estado = buttonContainer.querySelector('.estado-guardado');
                            if (estado) estado.remove();
                            
                            const confirmacion = document.createElement('div');
                            confirmacion.className = 'estado-guardado';
                            confirmacion.textContent = 'Asistencia registrada';
                            buttonContainer.appendChild(confirmacion);
                        }
                    } catch (error) {
                        const estado = buttonContainer.querySelector('.estado-guardado');
                        if (estado) estado.remove();
                        
                        const errorMsg = document.createElement('div');
                        errorMsg.className = 'alerta';
                        errorMsg.textContent = 'Error al guardar';
                        buttonContainer.appendChild(errorMsg);
                        setTimeout(() => errorMsg.remove(), 2000);
                    }
                });
                
                buttonContainer.appendChild(saveButton);
                
                const cargarAsistencia = async () => {
                    try {
                        const response = await fetch(`http://localhost:5000/api/asistencia/${alumno.id}?fecha=${hoy}`);
                        if (response.ok) {
                            const asistencia = await response.json();
                            if (asistencia) {
                                if (asistencia.presente) presenteInput.checked = true;
                                else ausenteInput.checked = true;
                                observacionesInput.value = asistencia.observaciones || '';
                            }
                        }
                    } catch (error) {
                        console.error('Error al cargar asistencia:', error);
                    }
                };
                
                asistenciaControls.appendChild(grupoAsistencia);
                asistenciaControls.appendChild(observacionesInput);
                asistenciaControls.appendChild(buttonContainer);
                
                item.appendChild(alumnoInfo);
                item.appendChild(asistenciaControls);
                list.appendChild(item);
                
                cargarAsistencia();
            });
            
            container.appendChild(list);
        }

    } catch (error) {
    
        const errorContainer = document.createElement('div');
        errorContainer.className = 'error-container';
        
        const errorTitle = document.createElement('h3');
        errorTitle.textContent = 'Error al cargar alumnos';
        
        const errorMsg = document.createElement('p');
        errorMsg.textContent = error.message;
        
        const retryButton = document.createElement('button');
        retryButton.className = 'btn-reintentar';
        retryButton.textContent = 'Reintentar';
        retryButton.addEventListener('click', () => location.reload());
        
        const loginButton = document.createElement('button');
        loginButton.className = 'btn-logout';
        loginButton.textContent = 'Ir al Login';
        loginButton.addEventListener('click', () => {
            window.location.hash = '#/login';
        });
        
        errorContainer.appendChild(errorTitle);
        errorContainer.appendChild(errorMsg);
        errorContainer.appendChild(retryButton);
        errorContainer.appendChild(loginButton);
        
        container.appendChild(errorContainer);
    }

    return container;
};
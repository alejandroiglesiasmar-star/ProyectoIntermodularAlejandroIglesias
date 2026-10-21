// App.js - Lógica principal de la aplicación frontend
// Usa fetch() para comunicarse con los endpoints REST del backend

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // Configuración de la API
    const API_BASE = '/api';

    // Elementos del DOM
    const perfilSection = document.getElementById('perfil');
    const rutinasSection = document.getElementById('rutinas');
    const listaRutinas = document.getElementById('listaRutinas');
    const chatWindow = document.getElementById('chatWindow');
    const chatMessages = document.getElementById('chatMessages');
    const mensajeInput = document.getElementById('mensajeInput');
    const floatingChat = document.getElementById('floatingChat');

    // Estado de la aplicación
    let usuarioActual = null;

    // --- MÉTODOS DE UTILIDAD ---

    /**
     * Muestra un mensaje de estado en la consola y en UI si es necesario
     * @param {string} mensaje - El mensaje a mostrar
     * @param {string} tipo - 'éxito', 'error', 'info'
     */
    function mostrarEstado(mensaje, tipo = 'info') {
        const colores = {
            éxito: '#28a745',
            error: '#dc3545',
            info: '#17a2b8'
        };
        console.log(`[%c${tipo.toUpperCase()}%c] ${mensaje}`,
            `color: ${colores[tipo]}; font-weight: bold;`,
            'font-weight: normal;');
    }

    /**
     * Formatea una fecha a formato legible
     * @param {string|Date} fecha - Fecha a formatear
     * @returns {string} - Fecha formateada
     */
    function formatearFecha(fecha) {
        if (!fecha) return 'N/A';
        const fechaObj = new Date(fecha);
        return fechaObj.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }

    /**
     * Verifica si el usuario está autenticado
     * @returns {boolean} - true si el usuario está logged in
     */
    function estaAutenticado() {
        return usuarioActual !== null;
    }

    // --- MÉTODOS DE USUARIO ---

    /**
     * Carga el perfil del usuario desde el backend
     */
    async function cargarPerfil() {
        try {
            const respuesta = await fetch(`${API_BASE}/usuarios`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (!respuesta.ok) throw new Error('Error al cargar usuarios');

            const usuarios = await respuesta.json();

            if (usuarios.length > 0) {
                usuarioActual = usuarios[0];

                // Renderizar perfil
                const perfilHTML = `
                    <div class="profile-card">
                        <h1>${usuarioActual.nombre}</h1>
                        <p>${usuarioActual.email}</p>
                        <p class="small">Peso: ${usuarioActual.peso ? usuarioActual.peso + ' kg' : 'No registrado'} |
                           Altura: ${usuarioActual.altura ? usuarioActual.altura + ' m' : 'No registrado'}</p>
                    </div>
                `;
                perfilSection.innerHTML = `<div class="col-12">${perfilHTML}</div>`;

                mostrarEstado('Perfil cargado exitosamente', 'éxito');
            } else {
                perfilSection.innerHTML = `
                    <div class="col-12">
                        <div class="alert alert-warning">
                            <i class="fas fa-exclamation-triangle me-2"></i>
                            No hay usuarios registrados. ¡Sé el primero en registrarte!
                        </div>
                    </div>
                `;
                mostrarEstado('No hay usuarios registrados', 'info');
            }

        } catch (error) {
            console.error('Error cargando perfil:', error);
            perfilSection.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-danger">
                        <i class="fas fa-exclamation-circle me-2"></i>
                        Error al cargar el perfil. Intenta recargar la página.
                    </div>
                </div>
            `;
            mostrarEstado('Error al cargar perfil', 'error');
        }
    }

    /**
     * Carga y muestra las rutinas del usuario
     */
    async function cargarRutinas() {
        try {
            const respuesta = await fetch(`${API_BASE}/usuarios`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (!respuesta.ok) throw new Error('Error al cargar rutinas');

            const usuarios = await respuesta.json();
            let html = '';

            if (usuarios.length > 0) {
                usuarios.forEach((user, index) => {
                    // Obtener rutinas asociadas (simulación - en producción vendrían de la BD)
                    const rutinasUser = user.rutinas || [];

                    html += `
                        <div class="routine-card">
                            <h4><i class="fas fa-dumbbell me-2"></i> Rutina ${index + 1}</h4>
                            <p class="text-muted small">Usuario: ${user.nombre}</p>
                            <p>${rutinasUser.length > 0 ? `${rutinasUser.length} ejercicio(s)` : 'Sin rutinas aún'}</p>
                        </div>
                    `;
                });
            } else {
                html = '<p class="text-muted">No hay usuarios registrados</p>';
            }

            listaRutinas.innerHTML = html;
            mostrarEstado('Rutinas cargadas exitosamente', 'éxito');

        } catch (error) {
            console.error('Error cargando rutinas:', error);
            listaRutinas.innerHTML = '<p class="text-muted">Error al cargar rutinas</p>';
            mostrarEstado('Error al cargar rutinas', 'error');
        }
    }

    // --- MÉTODOS DE IA / CHAT ---

    /**
     * Envía un mensaje al chat del entrenador virtual
     * @param {string} texto - El mensaje del usuario
     */
    async function enviarMensajeIA(texto) {
        if (!texto.trim()) return;

        // Agregar mensaje de usuario a la UI
        const mensajeUsuario = document.createElement('div');
        mensajeUsuario.className = 'chat-message user';
        mensajeUsuario.textContent = texto;
        chatMessages.appendChild(mensajeUsuario);

        // Limpiar input
        mensajeInput.value = '';
        mensajeInput.disabled = true;
        mensajeInput.placeholder = 'Pensando...';

        try {
            const respuesta = await fetch(`${API_BASE}/ai/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: texto,
                    tipo: 'chat_entrenador'
                })
            });

            if (!respuesta.ok) {
                throw new Error('Error en la respuesta de la API');
            }

            const data = await respuesta.json();

            // Agregar respuesta del entrenador a la UI
            const mensajeIA = document.createElement('div');
            mensajeIA.className = 'chat-message bot';

            if (data.respuesta) {
                mensajeIA.innerHTML = `<strong>🤖 Entrenador Virtual:</strong> ${data.respuesta}`;
            } else if (data.mensajeError) {
                mensajeIA.innerHTML = `<strong>⚠️ Error:</strong> ${data.mensajeError}`;
            } else {
                mensajeIA.textContent = 'No hay respuesta disponible';
            }

            chatMessages.appendChild(mensajeIA);

        } catch (error) {
            console.error('Error en chat IA:', error);

            const mensajeError = document.createElement('div');
            mensajeError.className = 'chat-message bot';
            mensajeError.innerHTML = `<strong>⚠️ Error:</strong> No se pudo conectar con el servicio de IA. ${error.message}`;
            chatMessages.appendChild(mensajeError);
        } finally {
            // Rehabilitar input
            mensajeInput.disabled = false;
            mensajeInput.placeholder = 'Escribe tu mensaje...';
            mensajeInput.focus();

            // Scroll al final
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    /**
     * Genera una rutina de entrenamiento mediante IA
     * @param {object} opciones - Las opciones de la rutina
     */
    async function generarRutinaIA(opciones = {}) {
        const prompt = opciones.prompt || 'Genera una rutina de entrenamiento';
        const nivel = opciones.nivel || 'intermedio';
        const objetivo = opciones.objetivo || 'ganar masa muscular';

        mostrarEstado('Generando rutina con IA...', 'info');

        try {
            const respuesta = await fetch(`${API_BASE}/ai/generar-rutina`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: prompt,
                    tipo: 'generar_rutina',
                    nivel: nivel,
                    objetivo: objetivo
                })
            });

            if (!respuesta.ok) {
                throw new Error('Error en la respuesta de la API');
            }

            const data = await respuesta.json();

            // Mostrar la rutina generada
            const rutinaHTML = `
                <div class="card mt-3">
                    <div class="card-header">
                        <h5><i class="fas fa-medal me-2"></i> Rutina Generada</h5>
                    </div>
                    <div class="card-body">
                        <p class="card-text">${data.respuesta || 'No se recibió respuesta'}</p>
                    </div>
                </div>
            `;

            // Insertar después del formulario o en un contenedor específico
            const contenedor = document.createElement('div');
            contenedor.innerHTML = rutinaHTML;
            document.querySelector('.row').appendChild(contenedor);

            mostrarEstado('Rutina generada exitosamente', 'éxito');
            return data;

        } catch (error) {
            console.error('Error generando rutina:', error);
            mostrarEstado('Error al generar rutina', 'error');
            return null;
        }
    }

    // --- EVENTOS DEL DOM ---

    /**
     * Configura los event listeners de la aplicación
     */
    function configurarEventos() {
        // Botón de nuevo usuario
        const btnNuevoUsuario = document.querySelector('[data-action="nuevo-usuario"]');
        if (btnNuevoUsuario) {
            btnNuevoUsuario.addEventListener('click', () => {
                // Limpiar formulario y permitir nuevo registro
                mostrarEstado('Formulario limpio para nuevo usuario', 'info');
            });
        }

        // Enviar mensaje con Enter
        mensajeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const texto = mensajeInput.value.trim();
                if (texto) {
                    enviarMensajeIA(texto);
                }
            }
        });

        // Enviar mensaje al hacer clic
        const btnEnviar = document.querySelector('[data-action="enviar-mensaje"]');
        if (btnEnviar) {
            btnEnviar.addEventListener('click', () => {
                const texto = mensajeInput.value.trim();
                if (texto) {
                    enviarMensajeIA(texto);
                }
            });
        }

        // Atajo de teclado para abrir chat (F12 o Ctrl+K)
        document.addEventListener('keydown', (e) => {
            if ((e.key === 'F12' || (e.ctrlKey && e.key.toLowerCase() === 'k')) && e.target.tagName !== 'INPUT') {
                e.preventDefault();
                chatWindow.classList.toggle('open');
                if (chatWindow.classList.contains('open')) {
                    mensajeInput.focus();
                }
            }
        });
    }

    // --- INICIALIZACIÓN ---

    /**
     * Inicializa la aplicación cargando datos y configurando eventos
     */
    function iniciar() {
        console.log('🚀 Iniciando FitTrainer IA...');

        // Cargar datos iniciales
        cargarPerfil();
        cargarRutinas();

        // Configurar event listeners
        configurarEventos();

        // Mostrar mensaje de bienvenida
        setTimeout(() => {
            mostrarEstado('Aplicación lista. Explora las secciones arriba.', 'info');
        }, 1000);
    }

    // Iniciar la aplicación cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', iniciar);
    } else {
        iniciar();
    }
});
/**
 * Talento Tech Clone - Interaction Script
 */

document.addEventListener('DOMContentLoaded', async () => {

    /* --- 1. Init AOS (Animate On Scroll) --- */
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,        // Animation duration
            easing: 'ease-in-out', // Easing function
            once: true,           // Whether animation should happen only once
            offset: 100           // Offset from original trigger point
        });
    }

    /* --- 2. Sticky Navbar --- */
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    /* --- 3. Mobile Menu Toggle --- */
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-link');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');

            // Toggle icon between bars and times
            const icon = menuToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when a link is clicked
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            });
        });
    }

    /* --- 4. Active Link Highlight on Scroll --- */
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    /* --- 5. Custom Formspree Submission (AJAX) --- */
    // This provides a better user experience without reloading the page.
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            // Loading state
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';
            submitBtn.disabled = true;

            try {
                const response = await fetch(contactForm.action, {
                    method: contactForm.method,
                    body: new FormData(contactForm),
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    submitBtn.classList.remove('primary-btn');
                    submitBtn.style.backgroundColor = '#28a745';
                    submitBtn.style.color = 'white';
                    submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Mensaje Enviado';
                    contactForm.reset();

                    setTimeout(() => {
                        submitBtn.classList.add('primary-btn');
                        submitBtn.style.backgroundColor = '';
                        submitBtn.style.color = '';
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                    }, 4000);
                } else {
                    alert('Hubo un problema al enviar tu mensaje. Intenta de nuevo.');
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }
            } catch (error) {
                alert('Error de conexión. Revisa tu internet y vuelve a intentar.');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    /* ==========================================================
       6. MODALS GLOBALS
       ========================================================== */
    window.abrirModal = function(id) {
        document.getElementById(id).style.display = 'flex';
    };

    window.cerrarModal = function(id) {
        document.getElementById(id).style.display = 'none';
    };

    window.onclick = function(event) {
        if (event.target.classList.contains('modal-auth')) {
            event.target.style.display = "none";
        }
    };

    /* ==========================================================
       7. SUPABASE COMENTARIOS INTEGRATION
       ========================================================== */
    const SUPABASE_URL = 'https://txaskjwmkpjvrpupngmj.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4YXNrandta3BqdnJwdXBuZ21qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxOTMwOTQsImV4cCI6MjA4ODc2OTA5NH0.SIsBGhq3QQsYoaJrGlmuvnwyor58NeFGR4JhQFiS6iM';
    
    // Solo inicializar si el cliente de supabase cargó desde el HTML (CDN)
    if(window.supabase) {
        const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        
        const formComentario = document.getElementById('form-comentario');
        const btnComentar = document.getElementById('btn-comentar');
        const contenedorComentarios = document.getElementById('contenedor-comentarios');
        const contadorComentarios = document.getElementById('contador-comentarios');
        const mensajeEstado = document.getElementById('mensaje-estado');
        
        // Elementos UI Autenticación
        const navAuthButtons = document.getElementById('nav-auth-buttons');
        const navUserInfo = document.getElementById('nav-user-info');
        const userEmailDisplay = document.getElementById('user-email-display');
        const mensajeNoAuth = document.getElementById('mensaje-no-auth');
        const comentarioAutorNombre = document.getElementById('comentario-autor-nombre');
        
        const formLogin = document.getElementById('form-login');
        const formRegistro = document.getElementById('form-registro');
        const btnLogin = document.getElementById('btn-login');
        const btnRegistro = document.getElementById('btn-registro');

        let currentUser = null;

        // --- 7.1 AUTENTICACIÓN ---
        supabase.auth.onAuthStateChange((event, session) => {
            currentUser = session?.user || null;
            
            if (currentUser) {
                // Estado Logueado
                navAuthButtons.style.display = 'none';
                navUserInfo.style.display = 'flex';
                userEmailDisplay.textContent = currentUser.email;
                
                formComentario.style.display = 'block';
                mensajeNoAuth.style.display = 'none';
                comentarioAutorNombre.textContent = currentUser.email;
                
                cerrarModal('modal-login');
                cerrarModal('modal-registro');
                
                if(formLogin) formLogin.reset();
                if(formRegistro) formRegistro.reset();
            } else {
                // Estado No Logueado
                navAuthButtons.style.display = 'flex';
                navUserInfo.style.display = 'none';
                userEmailDisplay.textContent = '';
                
                formComentario.style.display = 'none';
                mensajeNoAuth.style.display = 'block';
                comentarioAutorNombre.textContent = '';
            }
        });

        window.cerrarSesion = async () => {
            await supabase.auth.signOut();
        };

        if(formRegistro) {
            formRegistro.addEventListener('submit', async (e) => {
                e.preventDefault();
                const email = document.getElementById('registro-email').value;
                const password = document.getElementById('registro-password').value;
                const errorDiv = document.getElementById('registro-error');
                const exitoDiv = document.getElementById('registro-exito');
                
                btnRegistro.disabled = true;
                btnRegistro.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Registrando...';
                errorDiv.textContent = '';
                exitoDiv.textContent = '';
                
                try {
                    const { data, error } = await supabase.auth.signUp({ email, password });
                    if (error) throw error;
                    
                    if (data?.user?.identities?.length === 0) {
                        errorDiv.textContent = 'Este usuario ya está registrado.';
                    } else {
                        exitoDiv.textContent = '¡Registro exitoso! Iniciando sesión...';
                    }
                } catch (error) {
                    errorDiv.textContent = error.message;
                } finally {
                    btnRegistro.disabled = false;
                    btnRegistro.innerHTML = 'Registrarse';
                }
            });
        }

        if(formLogin) {
            formLogin.addEventListener('submit', async (e) => {
                e.preventDefault();
                const email = document.getElementById('login-email').value;
                const password = document.getElementById('login-password').value;
                const errorDiv = document.getElementById('login-error');
                
                btnLogin.disabled = true;
                btnLogin.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Ingresando...';
                errorDiv.textContent = '';
                
                try {
                    const { error } = await supabase.auth.signInWithPassword({ email, password });
                    if (error) throw error;
                } catch (error) {
                    errorDiv.textContent = 'Credenciales inválidas.';
                } finally {
                    btnLogin.disabled = false;
                    btnLogin.innerHTML = 'Ingresar';
                }
            });
        }

        // --- 7.2 COMENTARIOS ---
        // Formateador de fechas
        const formatearFecha = (fechaStr) => {
            const opciones = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
            return new Date(fechaStr).toLocaleDateString('es-ES', opciones);
        };

        // Escapar HTML para evitar ataques XSS
        const escaparHTML = (texto) => {
            const div = document.createElement('div');
            div.textContent = texto;
            return div.innerHTML;
        };

        // Obtener comentarios de Supabase
        const obtenerComentarios = async () => {
            if(!contenedorComentarios) return; // Evitar errores si no existe el DOM

            try {
                const { data: comentarios, error } = await supabase
                    .from('comentarios')
                    .select('*')
                    .order('fecha', { ascending: false });

                if (error) throw error;
                
                contadorComentarios.textContent = comentarios.length;

                if (comentarios.length === 0) {
                    contenedorComentarios.innerHTML = '<div class="cargando">Sé el primero en comentar.</div>';
                    return;
                }

                contenedorComentarios.innerHTML = comentarios.map(c => `
                    <div class="comentario-item">
                        <div class="comentario-header">
                            <span class="comentario-autor"><i class="fa-solid fa-user-circle"></i> ${escaparHTML(c.correo_usuario || 'Usuario')}</span>
                            <span class="comentario-fecha">${formatearFecha(c.fecha)}</span>
                        </div>
                        <p class="comentario-texto">${escaparHTML(c.comentario)}</p>
                    </div>
                `).join('');

            } catch (error) {
                console.error('Error al obtener comentarios:', error.message);
                contenedorComentarios.innerHTML = `<div class="cargando" style="color:red;">Error al cargar comentarios.</div>`;
            }
        };

        // Manejar el envío del formulario
        if(formComentario) {
            formComentario.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const comentarioTexto = document.getElementById('texto-comentario').value.trim();
                
                if (!comentarioTexto || !currentUser) return;

                // Estado de carga UI
                const originalBtnContent = btnComentar.innerHTML;
                btnComentar.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';
                btnComentar.disabled = true;
                mensajeEstado.textContent = '';
                mensajeEstado.className = 'mensaje-estado';

                try {
                    const { error } = await supabase
                        .from('comentarios')
                        .insert([{ comentario: comentarioTexto, usuario_id: currentUser.id }]);

                    if (error) throw error;

                    // Éxito
                    formComentario.reset();
                    mensajeEstado.textContent = '¡Comentario publicado con éxito!';
                    mensajeEstado.classList.add('exito');
                    
                    // Recargar la lista 
                    await obtenerComentarios();
                    
                    setTimeout(() => { mensajeEstado.textContent = ''; }, 4000);

                } catch (error) {
                    console.error('Error al insertar comentario:', error);
                    mensajeEstado.textContent = 'Error: ' + error.message;
                    mensajeEstado.classList.add('error');
                } finally {
                    // Restaurar botón
                    btnComentar.innerHTML = originalBtnContent;
                    btnComentar.disabled = false;
                }
            });
        }

        // Carga inicial
        obtenerComentarios();
    }
});

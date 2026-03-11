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
       6. CHATBASE INTEGRATION (Client Code)
       ========================================================== */

    // --- CLIENT CODE ---
    // const token = await getUserToken(); // Get the token from your server
    // window.chatbase('identify', { token }); // identify the user with Chatbase

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
                            <span class="comentario-autor"><i class="fa-solid fa-user-circle"></i> ${escaparHTML(c.nombre)}</span>
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
                
                const nombre = document.getElementById('nombre-comentario').value.trim();
                const comentarioTexto = document.getElementById('texto-comentario').value.trim();
                
                if (!nombre || !comentarioTexto) return;

                // Estado de carga UI
                const originalBtnContent = btnComentar.innerHTML;
                btnComentar.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';
                btnComentar.disabled = true;
                mensajeEstado.textContent = '';
                mensajeEstado.className = 'mensaje-estado';

                try {
                    // Inserción en Supabase (la fecha y UUID se generan solos en DB)
                    const { error } = await supabase
                        .from('comentarios')
                        .insert([{ nombre: nombre, comentario: comentarioTexto }]);

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

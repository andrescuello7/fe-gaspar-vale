/* ============================================
   CONFIGURACIÓN PRINCIPAL
============================================ */
const CONFIG = {
    videoId: 'boA7r9_aTyk',  // ID del video de YouTube
    eventDate: '2026-11-21T22:30:00',  // Fecha del evento
    coupleNames: 'GASPAR & VALERIA',  // Nombres de los novios
    welcomeMessage: '¡NOS CASAMOS!',  // Mensaje de bienvenida
    apiBaseUrl: 'https://be-dashboard-admin-production-119c.up.railway.app'
};

/* ============================================
   VARIABLES GLOBALES
============================================ */
let player;
let isPlaying = false;
let nombreNormalizado = 'INVITADO ESPECIAL';
let estadoInvitacion = '';
let invitadoActual = null;

/* ============================================
   INICIALIZACIÓN AL CARGAR LA PÁGINA
============================================ */
document.addEventListener('DOMContentLoaded', async function () {
    console.log('Página cargada, inicializando...');
    // Inicializar botón de música
    initMusicButton();

    // Mostrar información del invitado desde URL
    cargarInfoInvitado();
    await cargarEstadoInvitacionInicial();

    // Iniciar contador regresivo
    iniciarContador();

    // Configurar pantalla de bienvenida
    configurarPantallaBienvenida();

    // Configurar eventos de modales
    configurarModales();

    // Configurar formulario de confirmación
    configurarFormulario();

    // Inicializar carrusel de regalos
    initGiftCarousel();

    // Inicializar carrusel de fotos/videos
    initMediaCarousel();

    // Configurar efecto de scroll en imagen principal
    configurarEfectoScroll();
});

/* ============================================
   YOUTUBE PLAYER API
============================================ */
function onYouTubeIframeAPIReady() {
    const origin = window.location.protocol + '//' + window.location.host;
    console.log('Inicializando reproductor con origin:', origin);

    player = new YT.Player('player', {
        height: '1',
        width: '1',
        videoId: CONFIG.videoId,
        playerVars: {
            'autoplay': 0,
            'controls': 0,
            'loop': 1,
            'playlist': CONFIG.videoId,
            'enablejsapi': 1,
            'mute': 0,
            'start': 14,
            'origin': origin
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    console.log('Reproductor de música listo');
    // Configurar volumen
    event.target.setVolume(70);
}

function onPlayerStateChange(event) {
    console.log('Estado del reproductor cambiado a:', event.data);
    const musicButton = document.getElementById('musicButton');

    if (event.data == YT.PlayerState.ENDED) {
        player.seekTo(13);
        player.playVideo();
    }
    if (event.data == YT.PlayerState.PLAYING) {
        console.log('Música reproduciéndose');
        isPlaying = true;
        if (musicButton) {
            musicButton.innerHTML = '<i class="fas fa-pause"></i>';
        }
    } else if (event.data == YT.PlayerState.PAUSED) {
        isPlaying = false;
        if (musicButton) {
            musicButton.innerHTML = '<i class="fas fa-play"></i>';
        }
    }
}

/* ============================================
   CARRUSEL DE REGALOS
============================================ */
let currentGiftIndex = 0;
const totalGifts = 8;

function initGiftCarousel() {
    const dotsContainer = document.getElementById('giftDots');
    if (!dotsContainer) return;

    // Crear dots
    for (let i = 0; i < totalGifts; i++) {
        const dot = document.createElement('div');
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.onclick = () => goToGift(i);
        dotsContainer.appendChild(dot);
    }
}

function changeGift(direction) {
    // Quitar flip de la tarjeta actual antes de cambiar
    const currentCard = document.querySelector(`.gift-card[data-gift="${currentGiftIndex}"]`);
    if (currentCard && currentCard.classList.contains('flipped')) {
        currentCard.classList.remove('flipped');
    }

    currentGiftIndex = (currentGiftIndex + direction + totalGifts) % totalGifts;
    updateCarousel();
}

function goToGift(index) {
    // Quitar flip de la tarjeta actual antes de cambiar
    const currentCard = document.querySelector(`.gift-card[data-gift="${currentGiftIndex}"]`);
    if (currentCard && currentCard.classList.contains('flipped')) {
        currentCard.classList.remove('flipped');
    }

    currentGiftIndex = index;
    updateCarousel();
}

function updateCarousel() {
    const cards = document.querySelectorAll('.gift-card');
    const dots = document.querySelectorAll('.carousel-dot');

    cards.forEach((card, index) => {
        card.classList.remove('active', 'prev', 'next');

        if (index === currentGiftIndex) {
            card.classList.add('active');
        } else if (index === (currentGiftIndex - 1 + totalGifts) % totalGifts) {
            card.classList.add('prev');
        } else if (index === (currentGiftIndex + 1) % totalGifts) {
            card.classList.add('next');
        }
    });

    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentGiftIndex);
    });
}

function flipCard(index) {
    const card = document.querySelector(`.gift-card[data-gift="${index}"]`);
    if (card && card.classList.contains('active')) {
        card.classList.toggle('flipped');
    }
}

/* ============================================
   CARRUSEL DE FOTOS Y VIDEOS
============================================ */
let mediaCurrentIndex = 0;
let mediaAutoplayInterval = null;

function initMediaCarousel() {
    const track = document.querySelector('.media-carousel-track');
    if (!track) return;

    const slides = document.querySelectorAll('.media-slide');
    const dotsContainer = document.getElementById('mediaCarouselDots');

    slides.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = 'media-carousel-dot' + (i === 0 ? ' active' : '');
        dot.onclick = () => goToMediaSlide(i);
        dotsContainer.appendChild(dot);
    });

    startMediaAutoplay();
}

function changeMediaSlide(direction) {
    const slides = document.querySelectorAll('.media-slide');
    mediaCurrentIndex = (mediaCurrentIndex + direction + slides.length) % slides.length;
    updateMediaCarousel();
    resetMediaAutoplay();
}

function goToMediaSlide(index) {
    mediaCurrentIndex = index;
    updateMediaCarousel();
    resetMediaAutoplay();
}

function updateMediaCarousel() {
    const track = document.querySelector('.media-carousel-track');
    const slides = document.querySelectorAll('.media-slide');
    const dots = document.querySelectorAll('.media-carousel-dot');

    track.style.transform = `translateX(-${mediaCurrentIndex * 100}%)`;

    // Pausar todos los videos y reproducir el activo
    slides.forEach((slide, i) => {
        const video = slide.querySelector('video');
        if (video) {
            if (i === mediaCurrentIndex) {
                video.currentTime = 0;
                video.play();
            } else {
                video.pause();
            }
        }
    });

    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === mediaCurrentIndex);
    });
}

function startMediaAutoplay() {
    mediaAutoplayInterval = setInterval(() => {
        const slides = document.querySelectorAll('.media-slide');
        mediaCurrentIndex = (mediaCurrentIndex + 1) % slides.length;
        updateMediaCarousel();
    }, 5000);
}

function resetMediaAutoplay() {
    clearInterval(mediaAutoplayInterval);
    startMediaAutoplay();
}

/* ============================================
   CONTROL DE MÚSICA
============================================ */
function initMusicButton() {
    const musicButton = document.getElementById('musicButton');

    if (musicButton) {
        console.log('Botón de música encontrado, agregando event listener');
        musicButton.addEventListener('click', function (e) {
            e.stopPropagation();
            toggleMusic();
        });
    } else {
        console.error('Botón de música no encontrado');
    }
}

function toggleMusic() {
    console.log('Toggle música, estado actual:', isPlaying);
    const musicButton = document.getElementById('musicButton');

    if (!player || !player.playVideo || typeof player.playVideo !== 'function') {
        console.log('Reproductor no disponible');
        return;
    }

    try {
        if (isPlaying) {
            player.pauseVideo();
            if (musicButton) {
                musicButton.innerHTML = '<i class="fas fa-play"></i>';
            }
            isPlaying = false;
            console.log('Música pausada');
        } else {
            // Si el video está muy avanzado o al final, volver al inicio
            const currentTime = player.getCurrentTime();
            if (currentTime > player.getDuration() - 5) {
                player.seekTo(20);
            }
            player.playVideo();
            if (musicButton) {
                musicButton.innerHTML = '<i class="fas fa-pause"></i>';
            }
            isPlaying = true;
            console.log('Música reanudada');
        }
    } catch (error) {
        console.error('Error al controlar la música:', error);
    }
}

function startMusic() {
    console.log('Iniciando música desde el segundo 13...');
    const musicButton = document.getElementById('musicButton');

    if (player && typeof player.playVideo === 'function') {
        try {
            player.setVolume(70);
            player.seekTo(13, true);
            player.playVideo();

            if (musicButton) {
                musicButton.innerHTML = '<i class="fas fa-pause"></i>';
            }
            isPlaying = true;
        } catch (error) {
            console.error('Error al intentar reproducir:', error);
        }
    } else {
        setTimeout(startMusic, 200);
    }
}

/* ============================================
   PANTALLA DE BIENVENIDA
============================================ */
function configurarPantallaBienvenida() {
    const welcomeScreen = document.getElementById('welcomeScreen');
    const mainContent = document.getElementById('mainContent');
    const welcomeHeader = document.getElementById('welcomeHeader');

    // Establecer títulos de bienvenida
    if (welcomeHeader) {
        welcomeHeader.querySelector('h3').textContent = CONFIG.welcomeMessage;
        welcomeHeader.querySelector('h2').textContent = CONFIG.coupleNames;
    }

    // Click en pantalla de bienvenida
    if (welcomeScreen) {
        welcomeScreen.addEventListener('click', function () {
            console.log('Click en pantalla de bienvenida');
            startMusic();

            welcomeScreen.classList.add('fade-out');

            // Mostrar contenido principal
            setTimeout(function () {
                welcomeScreen.style.display = 'none';
                mainContent.style.display = 'block';

                // Scroll suave al inicio
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 1000);
        });
    }
}

/* ============================================
   INFORMACIÓN DEL INVITADO (desde URL)
============================================ */
function getGuestNameFromUrl() {
    const urlParams = new URLSearchParams(globalThis.location.search);

    return (
        urlParams.get('n')
        || urlParams.get('name')
        || urlParams.get('nombre')
        || urlParams.get('guestName')
        || urlParams.get('guest')
        || ''
    ).trim();
}

function actualizarNombreInvitado(nombreInvitado) {
    nombreNormalizado = (nombreInvitado || 'INVITADO ESPECIAL').toUpperCase();

    const nombreInvitado1 = document.getElementById('nombreInvitado');
    if (nombreInvitado1) {
        nombreInvitado1.textContent = nombreNormalizado;
    }

    const nombreInvitado2 = document.getElementById('nombreInvitado2');
    if (nombreInvitado2) {
        nombreInvitado2.textContent = nombreNormalizado;
    }

    const nombreInvitadoModal = document.getElementById('personGuest');
    if (nombreInvitadoModal) {
        nombreInvitadoModal.textContent = nombreNormalizado;
    }
}

async function cargarEstadoInvitacionInicial() {
    const guestId = getGuestIdFromUrl();

    if (!guestId) {
        return;
    }

    try {
        await getInvitationByIdStatus();
    } catch (error) {
        console.warn('No se pudo cargar el estado inicial de la invitación:', error);
    }
}

function cargarInfoInvitado() {
    const urlParams = new URLSearchParams(globalThis.location.search);
    const nombreInvitado = getGuestNameFromUrl() || 'INVITADO ESPECIAL';
    const cantidadPases = urlParams.get('c') || '1';

    actualizarNombreInvitado(nombreInvitado);

    // Actualizar mensaje de pases
    const mensajeInvitado = document.getElementById('mensajeInvitado');
    const mensajePases = document.getElementById('mensajePases');

    let mensaje;
    if (cantidadPases === '1') {
        mensaje = 'TENEMOS UNA TARJETA<br>RESERVADA';
    } else {
        mensaje = `TENEMOS ${cantidadPases} LUGARES<br>RESERVADOS PARA USTED${cantidadPases > 1 ? 'ES' : ''}.`;
    }

    if (mensajeInvitado) {
        mensajeInvitado.innerHTML = mensaje;
    }

    if (mensajePases) {
        mensajePases.innerHTML = mensaje.replace('TENEMOS', 'HAY').replace('.', '');
    }

    // Configurar select del formulario con la cantidad de pases
    const numPersonasSelect = document.getElementById('guest-count');
    if (numPersonasSelect && cantidadPases) {
        numPersonasSelect.value = cantidadPases;

        // Limitar opciones al número de pases disponibles
        const maxPases = parseInt(cantidadPases);
        Array.from(numPersonasSelect.options).forEach(option => {
            const valor = parseInt(option.value);
            if (valor > maxPases) {
                option.disabled = true;
            }
        });
    }
}

/* ============================================
   CONTADOR REGRESIVO
============================================ */
function iniciarContador() {
    const targetDate = new Date(CONFIG.eventDate).getTime();

    function actualizarContador() {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference > 0) {
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            document.getElementById('days').textContent = days;
            document.getElementById('hours').textContent = hours;
            document.getElementById('minutes').textContent = minutes;
            document.getElementById('seconds').textContent = seconds;
        } else {
            document.getElementById('days').textContent = '0';
            document.getElementById('hours').textContent = '0';
            document.getElementById('minutes').textContent = '0';
            document.getElementById('seconds').textContent = '0';
        }
    }

    // Actualizar inmediatamente y luego cada segundo
    actualizarContador();
    setInterval(actualizarContador, 1000);
}

/* ============================================
   MODALES
============================================ */
function configurarModales() {
    // Cerrar modal al hacer clic fuera del contenido
    window.onclick = function (event) {
        if (event.target.classList.contains('modal')) {
            closeModal(event.target.id);
        }
    };
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevenir scroll del body
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restaurar scroll del body

        if (modalId === 'confirmModal') {
            resetConfirmationForm();
        }
    }
}

function actualizarCamposInvitados(cantidad) {
    // Esta función se puede expandir para crear dinámicamente
    // campos adicionales si el usuario confirma más de una persona
    // Por ahora solo muestra el primer invitado
    console.log(`Confirmando para ${cantidad} persona(s)`);
}

/* ============================================
   CONFIGURACIÓN DEL FORMULARIO
============================================ */
function configurarFormulario() {
    const form = document.getElementById('confirmation-form');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
        form.addEventListener('change', updateConfirmationButtonState);
        updateConfirmationButtonState();
        console.log('Formulario de confirmación configurado');
    } else {
        console.error('Formulario de confirmación no encontrado');
    }
}

/* ============================================
   EFECTO DE SCROLL EN IMAGEN PRINCIPAL
============================================ */
function configurarEfectoScroll() {
    const imageSection = document.querySelector('.image-section');
    const imageOverlay = document.querySelector('.image-overlay');
    const overlayText = document.querySelector('.overlay-text');

    if (!imageSection || !imageOverlay || !overlayText) return;

    window.addEventListener('scroll', function () {
        // Obtener posición de scroll
        const scrollPos = window.scrollY;
        const sectionHeight = imageSection.offsetHeight;

        // Calcular progreso del scroll (0 a 1)
        const scrollProgress = Math.min(scrollPos / sectionHeight, 1);

        // Reducir opacidad del overlay (aclarar imagen)
        // De 0.5 inicial a 0.1 cuando se scrollea completamente
        const newOpacity = 0.5 - (scrollProgress * 0.4);
        imageOverlay.style.backgroundColor = `rgba(0, 0, 0, ${newOpacity})`;

        // Mover texto hacia arriba y hacer fade out
        const translateY = -(scrollProgress * 50); // Mueve hasta 50px arriba
        const textOpacity = 1 - (scrollProgress * 0.8); // Reduce opacidad
        overlayText.style.transform = `translateY(${translateY}px)`;
        overlayText.style.opacity = textOpacity;
    });
}

/* ============================================
   

/* ============================================
   FUNCIONES DE UTILIDAD
============================================ */

// Scroll suave para enlaces internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Prevenir comportamiento por defecto en botones
document.querySelectorAll('button[type="button"]').forEach(button => {
    button.addEventListener('click', function (e) {
        e.preventDefault();
    });
});

/* ============================================
   DETECCIÓN DE ERRORES
============================================ */
window.addEventListener('error', function (e) {
    console.error('Error detectado:', e.message);
});

console.log('Script cargado correctamente. Configuración:', CONFIG);

/* ============================================
   FORMULARIO DE CONFIRMACIÓN
============================================ */
function handleFormSubmit(event) {
    event.preventDefault();

    submitConfirmation().catch(error => {
        console.error('Error inesperado al enviar confirmación:', error);
        alert('No pudimos registrar tu respuesta. Intentalo nuevamente.');
    });
}

function getGuestIdFromUrl() {
    const { location } = globalThis;
    const searchParams = new URLSearchParams(location.search);
    const invitedParam = searchParams.get('invitado') || searchParams.get('guestId') || searchParams.get('id');

    if (invitedParam) {
        return invitedParam.trim();
    }

    // Soporte para formato ?invitado:12345
    const rawSearch = location.search.startsWith('?')
        ? location.search.slice(1)
        : location.search;
    const invitedByColon = /(?:^|&)invitado:([^&]+)/i.exec(rawSearch);
    if (invitedByColon?.[1]) {
        return decodeURIComponent(invitedByColon[1]).trim();
    }

    // Soporte para formato /invitado/12345 en el path
    const fromPath = /\/invitado\/([^/?#]+)/i.exec(location.pathname);
    if (fromPath?.[1]) {
        return decodeURIComponent(fromPath[1]).trim();
    }

    return '';
}

async function getInvitationByIdStatus() {
    const guestApiToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OWE3NDNjNTA5MGU3MmFjNmE2OTEyNmMiLCJlbWFpbCI6Im5hZGlhY3VlbGxvMTE4QGdtYWlsLmNvbSIsIm5hbWUiOiJQYWJsbyAmIE5hZGlhIiwiaWF0IjoxNzc4NzEzMzEyfQ.Z4_18oIrABpGPUM8XzeLCwrPD5MS5nP7I8lesxfK-qw";
    const guestId = getGuestIdFromUrl();

    if (!guestId) {
        return null;
    }

    const endpoint = `${CONFIG.apiBaseUrl}/guest/${encodeURIComponent(guestId)}`;
    const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${guestApiToken}`
        }
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
    }
    const data = await response.json();

    invitadoActual = data;
    estadoInvitacion = data?.status || '';
    actualizarNombreInvitado(data?.name || nombreNormalizado);
    aplicarEstadoInvitacionEnFormulario();

    return data;
}

async function confirmInvitation(status) {
    const guestId = getGuestIdFromUrl();
    const endpoint = `${CONFIG.apiBaseUrl}/guests/${encodeURIComponent(guestId)}/confirm`;
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ status: status })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
    }

    return response;
}

function updateConfirmationButtonState() {
    const form = document.getElementById('confirmation-form');
    const submitButton = form ? form.querySelector('button[type="submit"]') : null;
    const selectedAttendance = document.querySelector('input[name="attendance"]:checked');

    if (submitButton) {
        submitButton.disabled = !selectedAttendance;
    }
}

function aplicarEstadoInvitacionEnFormulario() {
    const radioConfirmado = document.querySelector('input[name="attendance"][value="si"]');
    const radioNoAsiste = document.querySelector('input[name="attendance"][value="no"]');

    if (estadoInvitacion === 'confirmado' && radioConfirmado) {
        radioConfirmado.checked = true;
    } else if (estadoInvitacion === 'no-asiste' && radioNoAsiste) {
        radioNoAsiste.checked = true;
    }

    updateConfirmationButtonState();
}

function resetConfirmationForm() {
    const form = document.getElementById('confirmation-form');

    if (form) {
        form.reset();
    }

    updateConfirmationButtonState();
}

async function submitConfirmation() {
    const form = document.getElementById('confirmation-form');
    const submitButton = form ? form.querySelector('button[type="submit"]') : null;
    const selectedAttendance = document.querySelector('input[name="attendance"]:checked');
    const guestId = getGuestIdFromUrl();

    if (!selectedAttendance) {
        alert('Seleccioná una opción de asistencia antes de continuar.');
        return;
    }

    if (!guestId) {
        alert('No se encontró el ID del invitado en la URL. Usá un enlace con ?invitado=ID o ?invitado:ID.');
        return;
    }

    const status = selectedAttendance.value === 'si' ? 'confirmado' : 'no-asiste';
    const payload = { status: status };

    if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'ENVIANDO...';
    }

    try {
        await confirmInvitation(payload.status);

        alert(
            status === 'confirmado'
                ? '¡Gracias por confirmar tu asistencia! Nos vemos el día del evento.'
                : 'Gracias por avisarnos. Lamentamos que no puedas asistir.'
        );

        closeModal('confirmModal');
    } catch (error) {
        console.error('Error al enviar confirmación:', error);
        alert('No pudimos registrar tu respuesta. Verificá tu conexión e intentalo nuevamente.');
    } finally {
        if (submitButton) {
            submitButton.textContent = 'CONFIRMAR';
        }
    }
}

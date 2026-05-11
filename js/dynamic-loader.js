// Cargador dinámico de contenido para TÍO SERGIO
class DynamicLoader {
    constructor() {
        this.dataPath = 'data/content.json';
        this.siteData = null;
    }
    
    // Cargar datos desde el JSON
    async loadData() {
        try {
            const response = await fetch(this.dataPath);
            if (!response.ok) {
                throw new Error('No se pudieron cargar los datos del sitio');
            }
            this.siteData = await response.json();
            return this.siteData;
        } catch (error) {
            console.error('Error al cargar datos dinámicos:', error);
            // Usar datos de respaldo si hay error
            this.loadFallbackData();
            return this.siteData;
        }
    }
    
    // Datos de respuesta en caso de error
    loadFallbackData() {
        this.siteData = {
            sitio: {
                titulo: "TÍO SERGIO | El lugar de los mayores 🎶",
                descripcion: "Bailanta, música, tragos y diversión. Viernes y sábados desde las 22:00 hs en José C. Paz. ¡Viví la noche con TÍO SERGIO™!",
                horarios: "🎶 Viernes y Sábados desde las 22:00 hs 🎶",
                direccion: "Av. Pres. Art. Umberto Illia 6829, José C. Paz, Bs. As.",
                telefono: "11 2327-2061",
                email: "info@tiosergio.com.ar"
            },
            secciones: {
                principal: {
                    titulo: "🔥 La noche es de los mayores 🔥",
                    descripcion: [
                        "💥 Un clásico de la noche, donde se baila, se ríe y se disfruta al máximo.",
                        "🎶 Cumbia • Cuarteto • Rock and Roll • Shows en vivo de bandas tropicales nacionales e internacionales.",
                        "🎉 ¡Vení a conocerlo, no te lo pierdas!",
                        "✨ Ambiente festivo, buena música, luces que te envuelven y la mejor energía de la mano del queridísimo SERGIO LEAL 👉🏻 <strong>TÍO SERGIO™</strong>.",
                        "💃🍸🎤 ¡Disfrutá con amigos una noche distinta, hecha y pensada para vos!"
                    ]
                },
                evento_destacado: {
                    titulo: "Viernes de Terapia Rockera",
                    subtitulo: "El primer viernes de cada mes se vive distinto en TÍO SERGIO.",
                    descripcion: [
                        "Una noche pensada para los que disfrutan del rock and roll, la pista encendida y el clima de una verdadera bailanta rockera.",
                        "Te esperamos con música, baile, energía y toda la onda para que vengas a pasar una fecha especial, intensa y bien arriba, ideal para disfrutar entre amigos.",
                        "Si te gusta cantar, bailar y vivir una noche con personalidad propia, esta propuesta es para vos."
                    ],
                    horario: "De 22:00 a 05:00 hs"
                }
            },
            youtube: {
                canal: "https://www.youtube.com/@elcanaldelasestrellasok",
                suscripcion: "https://www.youtube.com/@elcanaldelasestrellasok?sub_confirmation=1",
                videos: [
                    {
                        id: "mMcEde3D32Q",
                        titulo: "Noche en TÍO SERGIO",
                        descripcion: "Clima de fiesta, público presente y toda la energía del lugar en una noche bien arriba.",
                        enlace: "https://www.youtube.com/watch?v=mMcEde3D32Q",
                        activo: true
                    },
                    {
                        id: "c8uisiPR75k",
                        titulo: "Pista encendida",
                        descripcion: "Más escenas del salón, la música en vivo y la gente disfrutando una gran jornada.",
                        enlace: "https://www.youtube.com/watch?v=c8uisiPR75k",
                        activo: false
                    },
                    {
                        id: "LqA4IFqrmA4",
                        titulo: "Rock and Roll en vivo",
                        descripcion: "Baile, ritmo y momentos que muestran la esencia festiva de TÍO SERGIO.",
                        enlace: "https://www.youtube.com/watch?v=LqA4IFqrmA4",
                        activo: false
                    },
                    {
                        id: "nUeQKxvwW-I",
                        titulo: "Fiesta y baile en el salón",
                        descripcion: "Otra muestra del ambiente, la diversión y la experiencia que se vive cada fecha.",
                        enlace: "https://www.youtube.com/watch?v=nUeQKxvwW-I",
                        activo: false
                    }
                ]
            }
        };
    }
    
    // Actualizar metadatos del sitio
    updateMetadata() {
        if (!this.siteData) return;
        
        // Actualizar título
        document.title = this.siteData.sitio.titulo;
        
        // Actualizar meta descripción
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.content = this.siteData.sitio.descripcion;
        }
        
        // Actualizar Open Graph
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) {
            ogTitle.content = this.siteData.sitio.titulo;
        }
        
        const ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc) {
            ogDesc.content = this.siteData.sitio.descripcion;
        }
        
        // Actualizar Twitter Card
        const twitterTitle = document.querySelector('meta[name="twitter:title"]');
        if (twitterTitle) {
            twitterTitle.content = this.siteData.sitio.titulo;
        }
        
        const twitterDesc = document.querySelector('meta[name="twitter:description"]');
        if (twitterDesc) {
            twitterDesc.content = this.siteData.sitio.descripcion;
        }
    }
    
    // Actualizar horarios
    updateHorarios() {
        if (!this.siteData) return;
        
        const horariosElement = document.querySelector('.horarios');
        if (horariosElement) {
            horariosElement.textContent = this.siteData.sitio.horarios;
        }
    }
    
    // Actualizar sección principal
    updateSeccionPrincipal() {
        if (!this.siteData) return;
        
        const seccionPrincipal = document.querySelector('.bloque h3');
        if (seccionPrincipal) {
            seccionPrincipal.textContent = this.siteData.secciones.principal.titulo;
        }
        
        const descripciones = document.querySelectorAll('.bloque p.descripcion');
        this.siteData.secciones.principal.descripcion.forEach((desc, index) => {
            if (descripciones[index]) {
                descripciones[index].innerHTML = desc;
            }
        });
    }
    
    // Actualizar evento destacado
    updateEventoDestacado() {
        if (!this.siteData) return;
        
        const eventoTitulo = document.querySelector('.rockera-info h3');
        if (eventoTitulo) {
            eventoTitulo.textContent = this.siteData.secciones.evento_destacado.titulo;
        }
        
        const eventoSubtitulo = document.querySelector('.rockera-sub');
        if (eventoSubtitulo) {
            eventoSubtitulo.textContent = this.siteData.secciones.evento_destacado.subtitulo;
        }
        
        const eventoDescripciones = document.querySelectorAll('.rockera-info p');
        this.siteData.secciones.evento_destacado.descripcion.forEach((desc, index) => {
            if (eventoDescripciones[index]) {
                eventoDescripciones[index].textContent = desc;
            }
        });
        
        const eventoHorario = document.querySelector('.rockera-horario');
        if (eventoHorario) {
            eventoHorario.textContent = this.siteData.secciones.evento_destacado.horario;
        }
    }
    
    // Actualizar videos de YouTube
    updateYouTubeVideos() {
        if (!this.siteData) return;
        
        // Actualizar enlaces del canal
        const canalLinks = document.querySelectorAll('a[href*="youtube.com/@elcanaldelasestrellasok"]');
        canalLinks.forEach(link => {
            link.href = this.siteData.youtube.canal;
        });
        
        // Actualizar enlace de suscripción
        const suscripcionBtn = document.querySelector('button[onclick*="sub_confirmation"]');
        if (suscripcionBtn) {
            suscripcionBtn.onclick = () => window.open(this.siteData.youtube.suscripcion, '_blank');
        }
        
        // Actualizar video principal
        const iframePrincipal = document.getElementById('ytPrincipal');
        const btnVideoActual = document.getElementById('btnVerVideoActual');
        
        if (iframePrincipal) {
            const videoActivo = this.siteData.youtube.videos.find(v => v.activo) || this.siteData.youtube.videos[0];
            iframePrincipal.src = `https://www.youtube.com/embed/${videoActivo.id}`;
            
            if (btnVideoActual) {
                btnVideoActual.href = videoActivo.enlace;
            }
        }
        
        // Actualizar tarjetas de videos
        this.updateVideoCards();
        
        // Actualizar funcionalidad de clic en tarjetas
        this.setupVideoCardClickHandlers();
    }
    
    // Actualizar tarjetas de videos
    updateVideoCards() {
        if (!this.siteData) return;
        
        const ytCards = document.getElementById('ytCards');
        if (!ytCards) return;
        
        ytCards.innerHTML = '';
        
        this.siteData.youtube.videos.forEach((video, index) => {
            const isActive = video.activo || (index === 0 && !this.siteData.youtube.videos.some(v => v.activo));
            
            const card = document.createElement('button');
            card.className = `yt-card ${isActive ? 'active' : ''}`;
            card.type = 'button';
            card.setAttribute('data-video', video.id);
            card.setAttribute('data-link', video.enlace);
            
            card.innerHTML = `
                <div class="yt-thumb">
                    <img src="https://img.youtube.com/vi/${video.id}/hqdefault.jpg" alt="Vista previa Video ${index + 1}">
                    <span class="yt-play">▶ Ver</span>
                </div>
                <div class="yt-card-body">
                    <div class="yt-card-topline">
                        <span class="yt-nro">${index + 1}</span>
                        <span class="yt-badge">${isActive ? 'Principal' : 'Video'}</span>
                    </div>
                    <span class="yt-card-title">${video.titulo}</span>
                    <span class="yt-card-desc">${video.descripcion}</span>
                </div>
            `;
            
            ytCards.appendChild(card);
        });
    }
    
    // Configurar manejadores de clic para tarjetas de video
    setupVideoCardClickHandlers() {
        const cards = document.querySelectorAll('.yt-card');
        const iframePrincipal = document.getElementById('ytPrincipal');
        const btnVideoActual = document.getElementById('btnVerVideoActual');
        
        cards.forEach(card => {
            card.addEventListener('click', () => {
                const videoId = card.getAttribute('data-video');
                const videoLink = card.getAttribute('data-link');
                
                if (iframePrincipal) {
                    iframePrincipal.src = `https://www.youtube.com/embed/${videoId}`;
                }
                
                if (btnVideoActual && videoLink) {
                    btnVideoActual.href = videoLink;
                }
                
                // Actualizar tarjeta activa
                cards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
            });
        });
    }
    
    // Actualizar información de contacto
    updateContactInfo() {
        if (!this.siteData) return;
        
        // Actualizar email
        const emailLink = document.querySelector('a[href^="mailto:"]');
        if (emailLink) {
            emailLink.href = `mailto:${this.siteData.sitio.email}`;
            emailLink.textContent = `📩 ${this.siteData.sitio.email}`;
        }
        
        // Actualizar teléfono
        const telLink = document.querySelector('a[href^="tel:"]');
        if (telLink) {
            telLink.href = `tel:+54${this.siteData.sitio.telefono.replace(/\s/g, '')}`;
            telLink.textContent = `📞 ${this.siteData.sitio.telefono}`;
        }
        
        // Actualizar dirección
        const mapLink = document.querySelector('a[href*="maps.google.com"]');
        if (mapLink) {
            mapLink.href = `https://maps.google.com/?q=${encodeURIComponent(this.siteData.sitio.direccion)}`;
            mapLink.textContent = `📍 ${this.siteData.sitio.direccion}`;
        }
    }
    
    // Inicializar todo el contenido dinámico
    async initialize() {
        try {
            await this.loadData();
            
            // Actualizar todas las secciones
            this.updateMetadata();
            this.updateHorarios();
            this.updateSeccionPrincipal();
            this.updateEventoDestacado();
            this.updateYouTubeVideos();
            this.updateContactInfo();
            
            console.log('Contenido dinámico cargado exitosamente');
            
            // Disparar evento para indicar que el contenido está listo
            window.dispatchEvent(new CustomEvent('dynamicContentLoaded'));
            
        } catch (error) {
            console.error('Error al inicializar contenido dinámico:', error);
        }
    }
}

// Crear instancia global
window.dynamicLoader = new DynamicLoader();

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.dynamicLoader.initialize();
});

// Función para recargar contenido manualmente
window.reloadDynamicContent = () => {
    window.dynamicLoader.initialize();
};

// API de Administración para TÍO SERGIO
class AdminAPI {
    constructor() {
        this.dataPath = '../data/content.json';
    }
    
    // Cargar datos desde el archivo JSON
    async loadData() {
        try {
            const response = await fetch(this.dataPath);
            if (!response.ok) {
                throw new Error('No se pudieron cargar los datos');
            }
            return await response.json();
        } catch (error) {
            console.error('Error al cargar datos:', error);
            throw error;
        }
    }
    
    // Guardar datos en el archivo JSON
    async saveData(data) {
        try {
            // Actualizar timestamp
            data.config.ultimo_actualizacion = new Date().toISOString();
            
            // En un entorno real, esto debería ser una llamada a un backend
            // Por ahora, simulamos el guardado y mostramos los datos para copiar
            console.log('Datos a guardar:', JSON.stringify(data, null, 2));
            
            // Para desarrollo: guardar en localStorage
            localStorage.setItem('tiosergio_data', JSON.stringify(data));
            
            // Simular respuesta exitosa
            return {
                success: true,
                message: 'Datos guardados correctamente',
                data: data
            };
        } catch (error) {
            console.error('Error al guardar datos:', error);
            throw error;
        }
    }
    
    // Obtener solo la información del sitio
    async getSiteInfo() {
        const data = await this.loadData();
        return data.sitio;
    }
    
    // Obtener videos de YouTube
    async getYouTubeVideos() {
        const data = await this.loadData();
        return data.youtube;
    }
    
    // Obtener secciones
    async getSections() {
        const data = await this.loadData();
        return data.secciones;
    }
    
    // Validar URL de YouTube
    validateYouTubeURL(url) {
        const regex = /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+$/;
        return regex.test(url);
    }
    
    // Extraer ID de video de YouTube
    extractVideoID(url) {
        const regex = /[?&]v=([^&]+)/;
        const match = url.match(regex);
        return match ? match[1] : null;
    }
    
    // Generar URL de embed de YouTube
    generateEmbedURL(videoID) {
        return `https://www.youtube.com/embed/${videoID}`;
    }
    
    // Generar URL de thumbnail
    generateThumbnailURL(videoID) {
        return `https://img.youtube.com/vi/${videoID}/hqdefault.jpg`;
    }
}

// Crear instancia global
window.adminAPI = new AdminAPI();

// Funciones de utilidad
window.utils = {
    // Formatear fecha
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },
    
    // Validar email
    validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    },
    
    // Sanitizar HTML
    sanitizeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },
    
    // Mostrar notificación
    showNotification(message, type = 'info', duration = 3000) {
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Estilos
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 20px',
            borderRadius: '10px',
            color: '#fff',
            fontWeight: '600',
            zIndex: '9999',
            opacity: '0',
            transform: 'translateX(100%)',
            transition: 'all 0.3s ease'
        });
        
        // Colores según tipo
        const colors = {
            success: 'linear-gradient(90deg, #00ff00, #00cc00)',
            error: 'linear-gradient(90deg, #ff0000, #cc0000)',
            warning: 'linear-gradient(90deg, #ff9900, #ff6600)',
            info: 'linear-gradient(90deg, #0099ff, #0066cc)'
        };
        
        notification.style.background = colors[type] || colors.info;
        
        // Agregar al DOM
        document.body.appendChild(notification);
        
        // Animar entrada
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remover después del tiempo especificado
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, duration);
    }
};

// Auto-guardado
let autoSaveTimer = null;

function startAutoSave() {
    if (autoSaveTimer) {
        clearInterval(autoSaveTimer);
    }
    
    autoSaveTimer = setInterval(async () => {
        try {
            const currentData = await window.adminAPI.loadData();
            console.log('Auto-guardado:', new Date().toLocaleString());
        } catch (error) {
            console.error('Error en auto-guardado:', error);
        }
    }, 60000); // Cada minuto
}

// Iniciar auto-guardado cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    startAutoSave();
});

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AdminAPI, utils };
}

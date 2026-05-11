// Gestor de Seguridad para el Panel de Administración con Supabase Auth
class SecurityManager {
    constructor() {
        this.sessionKey = 'tiosergio_admin_session';
        this.timestampKey = 'tiosergio_admin_timestamp';
        this.attemptsKey = 'tiosergio_login_attempts';
        this.blockKey = 'tiosergio_login_block';
        this.maxSessionTime = 2 * 60 * 60 * 1000; // 2 horas
        this.sessionDuration = 2 * 60 * 60 * 1000; // 2 horas
        this.blockDuration = 15 * 60 * 1000; // 15 minutos
        this.maxFailedAttempts = 5;
        this.lockoutTime = 15 * 60 * 1000; // 15 minutos
        this.supabaseClient = null;
        this.adminPassword = 'admin123'; // Contraseña por defecto - en producción usar variables de entorno
        
        this.init();
    }
    
    init() {
        // Inicializar Supabase Auth
        this.initSupabase();
        
        // Limpiar bloqueos expirados
        this.clearExpiredBlocks();
        
        // Verificar sesión actual
        this.checkCurrentSession();
        
        // Configurar protección CSRF
        this.setupCSRFProtection();
    }
    
    // Generar token CSRF
    generateCSRFToken() {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }
    
    // Inicializar Supabase Auth
    async initSupabase() {
        try {
            // Esperar a que el DOM esté listo
            if (document.readyState === 'loading') {
                await new Promise(resolve => {
                    document.addEventListener('DOMContentLoaded', resolve);
                });
            }
            
            // Verificar que SupabaseClient esté disponible
            if (typeof window.SupabaseClient !== 'undefined') {
                this.supabaseClient = new window.SupabaseClient();
                await this.supabaseClient.init();
                console.log('✅ SecurityManager conectado a Supabase Auth');
            } else {
                throw new Error('SupabaseClient no está disponible');
            }
        } catch (error) {
            console.warn('⚠️ Supabase Auth no disponible, usando fallback:', error);
            this.supabaseClient = null;
        }
    }
    
    // Configurar protección CSRF
    setupCSRFProtection() {
        let token = sessionStorage.getItem('csrfToken');
        if (!token) {
            token = this.generateCSRFToken();
            sessionStorage.setItem('csrfToken', token);
        }
        
        // Agregar token a todos los formularios
        document.addEventListener('DOMContentLoaded', () => {
            const forms = document.querySelectorAll('form');
            forms.forEach(form => {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = 'csrfToken';
                input.value = token;
                form.appendChild(input);
            });
        });
    }
    
    // Verificar token CSRF
    verifyCSRFToken(token) {
        const storedToken = sessionStorage.getItem('csrfToken');
        return token && storedToken && token === storedToken;
    }
    
    // Limpiar bloqueos expirados
    clearExpiredBlocks() {
        const blockData = localStorage.getItem(this.blockKey);
        if (blockData) {
            const { timestamp } = JSON.parse(blockData);
            if (Date.now() - timestamp > this.blockDuration) {
                localStorage.removeItem(this.blockKey);
                localStorage.removeItem(this.attemptsKey);
            }
        }
    }
    
    // Verificar si está bloqueado
    isBlocked() {
        const blockData = localStorage.getItem(this.blockKey);
        if (!blockData) return false;
        
        const { timestamp } = JSON.parse(blockData);
        return Date.now() - timestamp < this.blockDuration;
    }
    
    // Obtener tiempo restante de bloqueo
    getBlockTimeRemaining() {
        const blockData = localStorage.getItem(this.blockKey);
        if (!blockData) return 0;
        
        const { timestamp } = JSON.parse(blockData);
        const remaining = this.blockDuration - (Date.now() - timestamp);
        return Math.max(0, Math.ceil(remaining / 60000)); // minutos
    }
    
    // Incrementar intentos fallidos
    incrementFailedAttempts() {
        const attempts = parseInt(localStorage.getItem(this.attemptsKey) || '0') + 1;
        localStorage.setItem(this.attemptsKey, attempts.toString());
        
        if (attempts >= this.maxAttempts) {
            this.blockLogin();
            return false;
        }
        
        return true;
    }
    
    // Bloquear login
    blockLogin() {
        const blockData = {
            timestamp: Date.now(),
            attempts: this.maxAttempts
        };
        localStorage.setItem(this.blockKey, JSON.stringify(blockData));
    }
    
    // Limpiar intentos fallidos
    clearFailedAttempts() {
        localStorage.removeItem(this.attemptsKey);
        localStorage.removeItem(this.blockKey);
    }
    
    // Verificar contraseña
    verifyPassword(password) {
        // Hash simple para comparación - en producción usar bcrypt o similar
        const hashedInput = this.simpleHash(password);
        const hashedStored = this.simpleHash(this.adminPassword);
        return hashedInput === hashedStored;
    }
    
    // Hash simple (solo para demostración)
    simpleHash(str) {
        if (!str || typeof str !== 'string') {
            return '0';
        }
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString();
    }
    
    // Iniciar sesión con Supabase Auth
    async login(email, password) {
        try {
            // Intentar login con Supabase Auth primero
            if (this.supabaseClient && this.supabaseClient.isConnected()) {
                const { data, error } = await this.supabaseClient.client.auth.signInWithPassword({
                    email: email,
                    password: password
                });
                
                if (error) {
                    throw new Error(`Error de Supabase Auth: ${error.message}`);
                }
                
                if (data.user) {
                    // Crear sesión local
                    const sessionData = {
                        active: true,
                        timestamp: Date.now(),
                        user: data.user,
                        provider: 'supabase',
                        userAgent: navigator.userAgent,
                        ip: this.getClientIP()
                    };
                    
                    localStorage.setItem(this.sessionKey, JSON.stringify(sessionData));
                    localStorage.setItem(this.timestampKey, Date.now().toString());
                    
                    console.log('✅ Login exitoso con Supabase Auth');
                    return true;
                }
            }
            
            // Fallback al sistema original
            return this.fallbackLogin(password);
            
        } catch (error) {
            console.error('Error en login con Supabase:', error);
            throw error;
        }
    }
    
    // Login fallback original
    fallbackLogin(password) {
        // Verificar si está bloqueado
        if (this.isBlocked()) {
            const remaining = this.getBlockTimeRemaining();
            throw new Error(`Cuenta bloqueada. Intenta nuevamente en ${remaining} minutos.`);
        }
        
        // Verificar contraseña
        if (!this.verifyPassword(password)) {
            const canContinue = this.incrementFailedAttempts();
            if (!canContinue) {
                throw new Error('Demasiados intentos fallidos. Cuenta bloqueada por 15 minutos.');
            }
            const attempts = this.maxAttempts - parseInt(localStorage.getItem(this.attemptsKey) || '0');
            throw new Error(`Contraseña incorrecta. Te quedan ${attempts} intentos.`);
        }
        
        // Limpiar intentos fallidos
        this.clearFailedAttempts();
        
        // Crear sesión
        const sessionData = {
            active: true,
            timestamp: Date.now(),
            provider: 'local',
            userAgent: navigator.userAgent,
            ip: this.getClientIP()
        };
        
        localStorage.setItem(this.sessionKey, JSON.stringify(sessionData));
        localStorage.setItem(this.timestampKey, Date.now().toString());
        
        return true;
    }
    
    // Cerrar sesión
    async logout() {
        try {
            // Cerrar sesión en Supabase si está disponible
            if (this.supabaseClient && this.supabaseClient.isConnected()) {
                await this.supabaseClient.client.auth.signOut();
                console.log('✅ Sesión de Supabase cerrada');
            }
        } catch (error) {
            console.warn('Error cerrando sesión de Supabase:', error);
        }
        
        // Limpiar sesión local
        localStorage.removeItem(this.sessionKey);
        localStorage.removeItem(this.timestampKey);
        sessionStorage.removeItem('csrfToken');
        this.clearFailedAttempts();
    }
    
    // Verificar sesión actual
    checkCurrentSession() {
        const sessionData = localStorage.getItem(this.sessionKey);
        const timestamp = localStorage.getItem(this.timestampKey);
        
        if (!sessionData || !timestamp) {
            return false;
        }
        
        // Verificar edad de la sesión
        const sessionAge = Date.now() - parseInt(timestamp);
        if (sessionAge > this.sessionDuration) {
            this.logout();
            return false;
        }
        
        // Verificar integridad de la sesión
        try {
            const session = JSON.parse(sessionData);
            return session.active && session.timestamp === parseInt(timestamp);
        } catch (error) {
            this.logout();
            return false;
        }
    }
    
    // Obtener IP del cliente (aproximación)
    getClientIP() {
        // En producción, esto debería obtenerse del servidor
        return 'unknown';
    }
    
    // Renovar sesión
    renewSession() {
        if (this.checkCurrentSession()) {
            localStorage.setItem(this.timestampKey, Date.now().toString());
            return true;
        }
        return false;
    }
    
    // Obtener información de la sesión actual
    getCurrentSession() {
        if (!this.checkCurrentSession()) {
            return null;
        }
        
        const sessionData = localStorage.getItem(this.sessionKey);
        const timestamp = localStorage.getItem(this.timestampKey);
        
        return {
            ...JSON.parse(sessionData),
            timestamp: parseInt(timestamp),
            expiresAt: parseInt(timestamp) + this.sessionDuration
        };
    }
    
    // Verificar si la sesión está por expirar
    isSessionExpiringSoon(minutes = 30) {
        const session = this.getCurrentSession();
        if (!session) return false;
        
        const timeUntilExpiry = session.expiresAt - Date.now();
        return timeUntilExpiry <= (minutes * 60 * 1000);
    }
    
    // Sanitizar entrada
    sanitizeInput(input) {
        if (typeof input !== 'string') return input;
        
        return input
            .replace(/[<>]/g, '') // Eliminar tags HTML
            .trim()
            .substring(0, 1000); // Limitar longitud
    }
    
    // Validar email
    validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
    
    // Validar URL
    validateURL(url) {
        try {
            new URL(url);
            return url.startsWith('http://') || url.startsWith('https://');
        } catch {
            return false;
        }
    }
    
    // Validar ID de YouTube
    validateYouTubeID(id) {
        const regex = /^[a-zA-Z0-9_-]{11}$/;
        return regex.test(id);
    }
    
    // Extraer ID de YouTube desde URL
    extractYouTubeID(url) {
        const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/;
        const match = url.match(regex);
        return match ? match[1] : null;
    }
}

// Crear instancia global
window.securityManager = new SecurityManager();

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SecurityManager;
}

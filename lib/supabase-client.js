// Cliente de Supabase para TÍO SERGIO
class SupabaseClient {
    constructor() {
        this.supabaseUrl = 'https://ldzthassqyamlunfmcvu.supabase.co';
        this.supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkenRoYXNzcXlhbWx1bmZtY3Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1MzEyMjYsImV4cCI6MjA5NDEwNzIyNn0.4yHYz_VChnzti5NIi11IhUai8stMu4_PONrj8IyJAo4';
        this.client = null;
        this.isInitialized = false;
    }
    
    async init() {
        if (this.isInitialized) return;
        
        try {
            // Verificar si Supabase está disponible globalmente
            if (typeof window.supabase !== 'undefined') {
                this.client = window.supabase.createClient(this.supabaseUrl, this.supabaseKey);
                console.log('✅ Cliente Supabase inicializado');
            } else {
                // Intentar cargar desde CDN
                await this.loadSupabaseFromCDN();
            }
        } catch (error) {
            console.error('Error al inicializar Supabase:', error);
            this.client = null;
        }
        
        this.isInitialized = true;
    }
    
    async loadSupabaseFromCDN() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
            script.onload = () => {
                if (typeof window.supabase !== 'undefined') {
                    this.client = window.supabase.createClient(this.supabaseUrl, this.supabaseKey);
                    console.log('✅ Cliente Supabase cargado desde CDN');
                    resolve();
                } else {
                    reject(new Error('Supabase no disponible después de cargar CDN'));
                }
            };
            script.onerror = () => reject(new Error('Error cargando Supabase desde CDN'));
            document.head.appendChild(script);
        });
    }
    
    // Obtener todos los datos del sitio
    async getSiteData() {
        if (this.client) {
            try {
                const { data, error } = await this.client
                    .from('site_data')
                    .select('*')
                    .single();
                
                if (error) throw error;
                return data;
            } catch (error) {
                console.error('Error obteniendo datos de Supabase:', error);
                return null;
            }
        } else {
            // Fallback a localStorage
            const localData = localStorage.getItem('tiosergio_data');
            return localData ? JSON.parse(localData) : null;
        }
    }
    
    // Guardar todos los datos del sitio
    async saveSiteData(data) {
        // Actualizar timestamp
        data.config = data.config || {};
        data.config.ultimo_actualizacion = new Date().toISOString();
        
        if (this.client) {
            try {
                const { error } = await this.client
                    .from('site_data')
                    .upsert(data)
                    .select();
                
                if (error) throw error;
                
                console.log('✅ Datos guardados en Supabase');
                return { success: true, message: 'Datos guardados correctamente' };
            } catch (error) {
                console.error('Error guardando en Supabase:', error);
                // Fallback a localStorage
                localStorage.setItem('tiosergio_data', JSON.stringify(data));
                return { success: true, message: 'Datos guardados localmente' };
            }
        } else {
            // Solo localStorage
            localStorage.setItem('tiosergio_data', JSON.stringify(data));
            return { success: true, message: 'Datos guardados localmente' };
        }
    }
    
    // Verificar conexión
    isConnected() {
        return this.client !== null;
    }
    
    // Limpiar datos locales (para testing)
    async clearLocalData() {
        localStorage.removeItem('tiosergio_data');
        if (this.client) {
            await this.client
                .from('site_data')
                .delete()
                .eq('id', 'main');
        }
    }
}

// Exportar para uso global
window.SupabaseClient = SupabaseClient;

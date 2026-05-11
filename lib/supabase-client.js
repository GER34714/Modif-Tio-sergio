// Cliente de Supabase para TÍO SERGIO
class SupabaseClient {
    constructor() {
        this.supabaseUrl = 'https://YOUR_SUPABASE_URL.supabase.co';
        this.supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
        this.client = null;
        this.init();
    }
    
    async init() {
        try {
            // Inicializar Supabase
            const { createClient } = await import('@supabase/supabase-js');
            this.client = createClient(this.supabaseUrl, this.supabaseKey);
            console.log('✅ Cliente Supabase inicializado');
        } catch (error) {
            console.error('Error al inicializar Supabase:', error);
            // Fallback a localStorage si Supabase no está disponible
            this.client = null;
        }
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

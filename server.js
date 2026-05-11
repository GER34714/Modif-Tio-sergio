const fs = require('fs');
const path = require('path');
const http = require('http');
const url = require('url');

// Configuración
const DATA_FILE = path.join(__dirname, 'data', 'content.json');
const PORT = process.env.PORT || 3000;

// CORS headers
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json'
};

// Leer datos del archivo JSON
function loadData() {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error al cargar datos:', error);
        return null;
    }
}

// Guardar datos en el archivo JSON
function saveData(data) {
    try {
        // Actualizar timestamp
        data.config.ultimo_actualizacion = new Date().toISOString();
        
        // Guardar en archivo
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
        return { success: true, message: 'Datos guardados correctamente' };
    } catch (error) {
        console.error('Error al guardar datos:', error);
        return { success: false, message: 'Error al guardar datos' };
    }
}

// Manejar solicitudes
function handleRequest(req, res) {
    const parsedUrl = url.parse(req.url, true);
    const method = req.method;
    const pathname = parsedUrl.pathname;

    // Configurar headers CORS
    Object.entries(corsHeaders).forEach(([key, value]) => {
        res.setHeader(key, value);
    });

    // Manejar OPTIONS (preflight)
    if (method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Rutas API
    if (pathname === '/api/data') {
        if (method === 'GET') {
            // Obtener datos
            const data = loadData();
            if (data) {
                res.writeHead(200, corsHeaders);
                res.end(JSON.stringify(data));
            } else {
                res.writeHead(500, corsHeaders);
                res.end(JSON.stringify({ error: 'No se pudieron cargar los datos' }));
            }
        } else if (method === 'POST' || method === 'PUT') {
            // Guardar datos
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });

            req.on('end', () => {
                try {
                    const data = JSON.parse(body);
                    const result = saveData(data);
                    
                    res.writeHead(200, corsHeaders);
                    res.end(JSON.stringify(result));
                } catch (error) {
                    res.writeHead(400, corsHeaders);
                    res.end(JSON.stringify({ error: 'JSON inválido' }));
                }
            });
        } else {
            res.writeHead(405, corsHeaders);
            res.end(JSON.stringify({ error: 'Método no permitido' }));
        }
    } else if (pathname === '/api/health') {
        // Health check
        res.writeHead(200, corsHeaders);
        res.end(JSON.stringify({ 
            status: 'OK', 
            timestamp: new Date().toISOString(),
            uptime: process.uptime()
        }));
    } else {
        // Servir archivos estáticos
        serveStaticFile(req, res, pathname);
    }
}

// Servir archivos estáticos
function serveStaticFile(req, res, pathname) {
    let filePath;
    
    if (pathname === '/') {
        filePath = path.join(__dirname, 'index.html');
    } else if (pathname.startsWith('/admin/')) {
        filePath = path.join(__dirname, pathname);
    } else if (pathname.startsWith('/js/') || pathname.startsWith('/data/') || pathname.startsWith('/api/')) {
        filePath = path.join(__dirname, pathname);
    } else {
        filePath = path.join(__dirname, pathname);
    }

    // Determinar Content-Type
    const ext = path.extname(filePath);
    const contentTypes = {
        '.html': 'text/html',
        '.js': 'application/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
        '.svg': 'image/svg+xml'
    };

    const contentType = contentTypes[ext] || 'text/plain';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Archivo no encontrado');
        } else {
            res.writeHead(200, { 
                'Content-Type': contentType,
                'Access-Control-Allow-Origin': '*'
            });
            res.end(content);
        }
    });
}

// Crear servidor
const server = http.createServer(handleRequest);

server.listen(PORT, () => {
    console.log(`🚀 Servidor TÍO SERGIO corriendo en http://localhost:${PORT}`);
    console.log(`📁 Datos guardados en: ${DATA_FILE}`);
    console.log(`🔧 Panel admin: http://localhost:${PORT}/admin/`);
    console.log(`🌐 Sitio web: http://localhost:${PORT}/`);
});

// Manejar errores del servidor
server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`❌ El puerto ${PORT} ya está en uso. Intenta con otro puerto.`);
    } else {
        console.error('❌ Error del servidor:', error);
    }
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Apagando servidor...');
    server.close(() => {
        console.log('✅ Servidor apagado correctamente');
        process.exit(0);
    });
});

# Panel de Administración - TÍO SERGIO

## Descripción

Este proyecto implementa un panel de administración autoadministrable para el sitio web de TÍO SERGIO, permitiendo modificar dinámicamente:

- Videos de YouTube destacados
- Textos e información del sitio
- Programación y eventos
- Información de contacto

## Estructura del Proyecto

```
Modif-Tio-sergio/
├── index.html                 # Sitio principal (modificado para contenido dinámico)
├── admin/                     # Panel de administración
│   ├── index.html            # Redirección al login
│   ├── login.html            # Página de acceso
│   ├── dashboard.html        # Panel principal de administración
│   └── security.js           # Sistema de seguridad
├── api/
│   └── admin.js              # API de administración
├── data/
│   └── content.json          # Datos del sitio
├── js/
│   └── dynamic-loader.js     # Cargador dinámico de contenido
└── README.md                 # Este archivo
```

## Características

### 🔐 Seguridad
- Sistema de login con contraseña
- Protección contra ataques de fuerza bruta (3 intentos, bloqueo 15 min)
- Sesiones seguras con expiración (24 horas)
- Tokens CSRF para protección de formularios
- Validación y sanitización de datos

### 📝 Panel de Administración
- **Información General**: Título, descripción, horarios, contacto
- **Videos de YouTube**: Agregar, eliminar y configurar videos
- **Secciones del Sitio**: Editar textos principales y eventos destacados
- **Vista Previa**: Cambios en tiempo real

### 🎯 Funcionalidades Dinámicas
- Carga automática de contenido desde JSON
- Actualización de metadatos SEO
- Gestión de videos de YouTube con thumbnails
- Sistema de respaldo en caso de errores

## Uso

### Acceso al Panel
1. Abrir `admin/` en el navegador
2. Ingresar contraseña: `tio2025`
3. Navegar por las pestañas de configuración

### Modificar Contenido
1. **Videos de YouTube**:
   - Pegar URL completa del video
   - El sistema extrae automáticamente el ID
   - Configurar título y descripción

2. **Textos del Sitio**:
   - Editar directamente en los formularios
   - Los cambios se guardan en `data/content.json`
   - El sitio principal se actualiza automáticamente

### Datos de Configuración
Los datos se almacenan en `data/content.json` con la siguiente estructura:

```json
{
  "sitio": {
    "titulo": "...",
    "descripcion": "...",
    "horarios": "...",
    "direccion": "...",
    "telefono": "...",
    "email": "..."
  },
  "youtube": {
    "canal": "...",
    "suscripcion": "...",
    "videos": [...]
  },
  "secciones": {...}
}
```

## Instalación

### Desarrollo Local
1. Clonar el repositorio
2. Iniciar servidor local:
   ```bash
   python3 -m http.server 8000
   ```
3. Acceder a:
   - Sitio principal: `http://localhost:8000`
   - Panel admin: `http://localhost:8000/admin/`

### Producción
Para producción, se recomienda:
1. Configurar un servidor backend real para persistencia
2. Usar variables de entorno para credenciales
3. Implementar HTTPS
4. Configurar CORS adecuadamente

## Seguridad

### Contraseñas
- Contraseña por defecto: `tio2025`
- **Importante**: Cambiar en producción
- Usar hash bcrypt en backend real

### Protecciones Implementadas
- Límite de intentos de login
- Bloqueo temporal por IP
- Tokens CSRF
- Validación de entrada
- Expiración de sesiones

## Desarrollo

### Arquitectura
- **Frontend**: HTML5, CSS3, JavaScript vanilla
- **Almacenamiento**: JSON (localStorage para desarrollo)
- **Estilos**: CSS Grid, Flexbox, animaciones CSS
- **Compatibilidad**: Responsive design

### Extensiones Futuras
- Backend real con base de datos
- Sistema de usuarios y permisos
- Historial de cambios
- Exportación/importación de datos
- Integración con redes sociales

## Soporte

Para problemas o sugerencias:
- Email: info@tiosergio.com.ar
- Teléfono: 11 2327-2061

---

**© 2025 TÍO SERGIO** - Desarrollado por Ciborg 347™

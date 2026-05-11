-- Crear tabla para datos del sitio
CREATE TABLE IF NOT EXISTS site_data (
    id TEXT PRIMARY KEY DEFAULT 'main',
    sitio JSONB NOT NULL,
    secciones JSONB NOT NULL,
    youtube JSONB NOT NULL,
    imagenes JSONB NOT NULL,
    config JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE site_data ENABLE ROW LEVEL SECURITY;

-- Política para permitir lectura pública
CREATE POLICY "Enable read access for all users" ON site_data
    FOR SELECT USING (true);

-- Política para permitir inserción/actualización para todos
CREATE POLICY "Enable insert/update for all users" ON site_data
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON site_data
    FOR UPDATE USING (true);

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS site_data_id_idx ON site_data(id);
CREATE INDEX IF NOT EXISTS site_data_updated_at_idx ON site_data(updated_at);

-- Insertar datos iniciales si la tabla está vacía
INSERT INTO site_data (id, sitio, secciones, youtube, imagenes, config)
SELECT 
    'main',
    '{
        "titulo": "TÍO SERGIO - El Lugar de los Mayores",
        "descripcion": "Viviendo la mejor época de la música en vivo",
        "horarios": "Miércoles 19:00-00:00 | Sábados 22:00-06:00 | Domingos 13:00-22:00",
        "telefono": "+54 11 1234-5678",
        "email": "contacto@tiosergio.com",
        "direccion": "Av. Pres. Art. Umberto Illia 6829, Jose C. Paz, Bs. As."
    }',
    '{
        "principal": {
            "titulo": "Bienvenidos a TÍO SERGIO",
            "descripcion": [
                "El lugar donde la música clásica y el buen ambiente se encuentran.",
                "Vení a disfrutar de las mejores noches con amigos y en familia."
            ]
        },
        "evento_destacado": {
            "titulo": "Noches Inolvidables",
            "subtitulo": "Música en vivo y baile toda la noche",
            "descripcion": [
                "Disfrutá de bandas en vivo, buen ambiente y la mejor música.",
                "Un espacio único para compartir momentos inolvidables."
            ],
            "horarios": "Miércoles 19:00-00:00 | Sábados 22:00-06:00 | Domingos 13:00-22:00"
        },
        "programacion": {
            "titulo": "Programación Semanal",
            "descripcion": "La mejor música todos los días de la semana",
            "detalles": "Vení a vivir noches y tardes a pura música, baile y alegría",
            "eventos": []
        }
    }',
    '{
        "canal": "https://www.youtube.com/@elcanaldelasestrellasok",
        "suscripcion": "https://www.youtube.com/@elcanaldelasestrellasok?sub_confirmation=1",
        "videos": [
            {
                "id": "fuYq32iJdIw",
                "titulo": "Te Tengo que Olvidar",
                "descripcion": "Los Del Maranaho - Topic",
                "enlace": "https://www.youtube.com/watch?v=fuYq32iJdIw",
                "activo": true
            },
            {
                "id": "nUeQKxvwW-I",
                "titulo": "Fiesta y baile en el salón",
                "descripcion": "Otra muestra del ambiente, la diversión y la experiencia que se vive cada fecha.",
                "enlace": "https://www.youtube.com/watch?v=nUeQKxvwW-I",
                "activo": false
            },
            {
                "id": "LqA4IFqrmA4",
                "titulo": "Rock and Roll en vivo",
                "descripcion": "Baile, ritmo y momentos que muestran la esencia festiva de TÍO SERGIO.",
                "enlace": "https://www.youtube.com/watch?v=LqA4IFqrmA4",
                "activo": false
            },
            {
                "id": "c8uisiPR75k",
                "titulo": "Pista encendida",
                "descripcion": "Más escenas del salón, la música en vivo y la gente disfrutando una gran jornada.",
                "enlace": "https://www.youtube.com/watch?v=c8uisiPR75k",
                "activo": false
            }
        ]
    }',
    '{
        "logo": "https://iili.io/KpcsxCN.md.jpg",
        "anfitrion": "https://iili.io/KpcsxCN.md.jpg",
        "youtube_logo": "https://iili.io/fA4eRNj.jpg"
    }',
    '{
        "ultimo_actualizacion": "2025-01-11T15:13:00.000Z",
        "version": "1.0.0"
    }'
WHERE NOT EXISTS (SELECT 1 FROM site_data WHERE id = 'main');

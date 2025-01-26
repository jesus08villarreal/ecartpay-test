# Backend Catalog API

API REST para gestión de catálogo de productos con autenticación JWT.

## 📋 Requisitos Previos

- Docker y Docker Compose
- Node.js 16.x o superior (para desarrollo local)
- Postman (para pruebas)

## 🚀 Inicio Rápido con Docker

1. **Clonar el repositorio:**
```bash
git clone <url-del-repositorio>
cd backend-catalog
```

2. **Configurar variables de entorno:**
```bash
cp .env.example .env
```

3. **Iniciar el proyecto:**
```bash
# Primera vez o cuando se modifiquen dependencias
npm run docker:dev:build

# Las siguientes veces
npm run docker:dev
```

4. **Crear usuario admin inicial:**
```bash
npm run docker:seed
```

Credenciales por defecto:
- Email: admin@example.com
- Password: admin123456

5. **Detener el proyecto:**
```bash
npm run docker:down
```

## 💻 Desarrollo

El proyecto está configurado para desarrollar usando Docker, lo que garantiza un entorno consistente y aislado.

### Comandos principales:

1. **Iniciar el entorno de desarrollo:**
```bash
# Construir e iniciar (primera vez o al cambiar dependencias)
npm run docker:dev:build

# Solo iniciar (las siguientes veces)
npm run docker:dev
```

2. **Ver logs de los contenedores:**
```bash
docker-compose logs -f
```

3. **Ejecutar comandos dentro del contenedor:**
```bash
# Ejecutar tests
docker-compose exec api npm test

# Crear backup
docker-compose exec api npm run db:backup

# Restaurar backup
docker-compose exec api npm run db:restore
```

4. **Acceder a la base de datos:**
```bash
docker-compose exec mongo mongosh
```

5. **Reiniciar servicios:**
```bash
# Reiniciar todo
docker-compose restart

# Reiniciar un servicio específico
docker-compose restart api
```

## 🔑 Autenticación

### Registro de Usuario
```bash
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "123456"
}
```

### Login
```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "123456"
}
```

### Logout
```bash
POST /api/v1/auth/logout
Authorization: Bearer <token>
```

## 📦 Endpoints de Productos

### Crear Producto
```bash
POST /api/v1/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Producto de prueba",
  "description": "Descripción del producto",
  "price": 99.99,
  "stock": 10,
  "category": "Electrónica"
}
```

### Listar Productos
```bash
GET /api/v1/products
Authorization: Bearer <token>
```

### Obtener Producto
```bash
GET /api/v1/products/:id
Authorization: Bearer <token>
```

### Actualizar Producto
```bash
PUT /api/v1/products/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Producto actualizado",
  "price": 149.99
}
```

### Eliminar Producto
```bash
DELETE /api/v1/products/:id
Authorization: Bearer <token>
```

## 🧪 Tests

```bash
# Ejecutar todos los tests
npm test

# Ver cobertura de tests
npm run test:coverage
```

## 📚 Documentación

### Swagger
La documentación de la API está disponible en:
```bash
http://localhost:5000/api-docs
```

### Postman
1. Importar colección:
   - `src/docs/postman/backend-catalog.postman_collection.json`
2. Importar environment:
   - `src/docs/postman/environments/local.postman_environment.json`

## 💾 Base de Datos

### Backup
```bash
npm run db:backup
```

### Restore
```bash
npm run db:restore
```

## 📝 Variables de Entorno

```bash
PORT=5000                    # Puerto del servidor
MONGO_URI=mongodb://...      # URI de MongoDB
JWT_SECRET=your_secret       # Secreto para JWT
NODE_ENV=development         # Entorno (development/production)
RATE_LIMIT_WINDOW_MS=900000 # Ventana para rate limiting (15 min)
RATE_LIMIT_MAX=100          # Máximo de peticiones por ventana
CORS_ORIGIN=http://...      # Origen permitido para CORS
```

## 🛠️ Scripts Disponibles

- `npm run dev`: Iniciar en modo desarrollo
- `npm start`: Iniciar en modo producción
- `npm test`: Ejecutar tests
- `npm run docker:dev`: Iniciar con Docker
- `npm run docker:dev:build`: Construir e iniciar con Docker
- `npm run docker:down`: Detener contenedores Docker
- `npm run seed`: Crear datos iniciales
- `npm run db:backup`: Crear backup de BD
- `npm run db:restore`: Restaurar backup de BD

## 🏗️ Estructura del Proyecto

```
backend-catalog/
├── src/
│   ├── config/         # Configuraciones
│   ├── controllers/    # Controladores
│   ├── middlewares/    # Middlewares
│   ├── models/        # Modelos Mongoose
│   ├── routes/        # Rutas
│   ├── scripts/       # Scripts (backup/restore)
│   ├── tests/         # Tests
│   ├── utils/         # Utilidades
│   ├── app.js         # Express App
│   └── server.js      # Entrada principal
├── docker-compose.yml  # Configuración Docker
├── Dockerfile         # Configuración imagen Docker
└── package.json       # Dependencias y scripts
```

## ⚙️ Configuración CI/CD

El proyecto está configurado para:
1. Ejecutar tests automáticamente en cada push/PR
2. Desplegar automáticamente a Vercel en push a main

### Configuración necesaria:
1. Configurar secrets en GitHub:
   - `VERCEL_TOKEN`
   - `JWT_SECRET`
   - `MONGODB_URI` (MongoDB Atlas)

## 🐛 Solución de Problemas

### Error de conexión a MongoDB
1. Verificar que MongoDB está corriendo:
```bash
docker-compose ps
```
2. Verificar MONGO_URI en .env

### Error de permisos en Docker
```bash
sudo chown -R $USER:$USER .
```

## 📄 Licencia

ISC

## Entornos de Desarrollo

### Desarrollo Local

Para desarrollo local, el proyecto utiliza Docker Compose para gestionar la API y la base de datos MongoDB:

1. Clona el repositorio:
```bash
git clone <tu-repositorio>
cd ecartpay-test
```

2. Crea un archivo `.env` basado en `.env.example`:
```bash
cp .env.example .env
```

3. Inicia los servicios con Docker Compose:
```bash
docker-compose up
```

La API estará disponible en `http://localhost:5000` y MongoDB en `mongodb://localhost:27017/catalog_db`

### Producción (Render + MongoDB Atlas)

Para el despliegue en producción, utilizamos:
- **Render** para hospedar la API
- **MongoDB Atlas** para la base de datos

#### Configuración de MongoDB Atlas:

1. Crea una cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Crea un nuevo cluster (tier gratuito M0)
3. En "Security" → "Database Access", crea un usuario
4. En "Security" → "Network Access", permite acceso desde cualquier IP (0.0.0.0/0)
5. Obtén tu URL de conexión de MongoDB Atlas

#### Despliegue en Render:

1. Conecta tu repositorio de GitHub a Render
2. Crea un nuevo Web Service
3. Configura las siguientes variables de entorno en el dashboard de Render:
   - `MONGODB_URI`: URL de conexión de MongoDB Atlas
   - Las demás variables están configuradas en `render.yaml`

El servicio se desplegará automáticamente cuando hagas push a la rama principal.

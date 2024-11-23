# QuickBet Movies - Aplicación de Películas

## 📝 Descripción
QuickBet Movies es una aplicación web moderna desarrollada con Next.js y React que permite a los usuarios descubrir, buscar y guardar sus películas favoritas. La aplicación se integra con la API de The Movie Database (TMDB) para proporcionar información actualizada sobre películas, calificaciones y recomendaciones.

## 🚀 Características Principales

- **Descubrimiento de Películas**: 
  - Navegación por películas populares
  - Sección de películas en cartelera
  - Visualización en formato grid con imágenes y detalles

- **Búsqueda Avanzada**:
  - Búsqueda por título
  - Filtrado por géneros
  - Resultados en tiempo real

- **Detalles de Películas**:
  - Sinopsis completa
  - Calificación y valoraciones
  - Fecha de estreno
  - Duración
  - Enlaces a trailers oficiales
  - Categorías y etiquetas

- **Funcionalidades de Usuario**:
  - Sistema de favoritos
  - Autenticación de usuarios
  - Perfiles personalizados

## 🛠️ Guía de Instalación

### Requisitos Previos
```bash
- Node.js (versión 14.0 o superior)
- npm o yarn
- Cuenta en TMDB para obtener API Key
```

### 1. Configuración Inicial

```bash
# Clonar el repositorio
git clone https://github.com/LauraDuarte1003/ProyectoPeliculas.git

# Acceder al directorio
cd proyectopeliculas

# Instalar dependencias
npm install
```

### 2. Variables de Entorno

Crear un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_SUPABASE_URL= tu url
NEXT_PUBLIC_SUPABASE_ANON_KEY= tu api key

### 3. Ejecución del Proyecto

```bash
# Modo desarrollo
npm run dev

# Construir para producción
npm run build

# Iniciar versión de producción
npm start
```

## 📁 Estructura del Proyecto

```
PROYECTOPELICULAS/
├── app/
│   ├── auth/                  # Autenticación
│   │   ├── callback/         # Callbacks de autenticación
│   │   └── pages.tsx
│   ├── components/           # Componentes reutilizables
│   │   ├── Banner.tsx       # Banner principal
│   │   ├── Header.tsx       # Cabecera y navegación
│   │   └── MainContent.tsx  # Contenido principal
│   ├── pages/               # Páginas principales
│   │   ├── auth/           # Páginas de autenticación
│   │   │   ├── login.tsx   # Página de login
│   │   │   └── signup.tsx  # Página de registro
│   │   └── Details/        # Detalles de películas
│   ├── contexts/            # Contextos de React
│   │   └── AuthContext.tsx # Contexto de autenticación
│   ├── lib/                 # Utilidades
│   └── globals.css          # Estilos globales
```

## 🔧 Configuración de Componentes Principales

### 1. Banner Component (Banner.tsx)
```typescript
// Configuración necesaria:
- Asegurarse de tener la API key de TMDB configurada
- Importar los estilos necesarios
- Configurar las interfaces de TypeScript
```

### 2. Header Component (Header.tsx)
```typescript
// Configuración necesaria:
- Configurar las rutas de navegación
- Importar los componentes de autenticación
- Configurar los estilos responsivos
```

### 3. Main Content (MainContent.tsx)
```typescript
// Configuración necesaria:
- Configurar la conexión con la API de TMDB
- Implementar el sistema de grid
- Configurar el manejo de estados
```


## 🔑 Integración con APIs

### 1. Configuración de TMDB API
```javascript
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

// Ejemplo de uso:
const fetchMovies = async () => {
  const response = await fetch(
    `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=es-ES`
  );
  return response.json();
};
```


## 🔍 Funcionalidades de Búsqueda

La búsqueda implementa:
- optimizar llamadas a la API
- Filtrado por géneros

## ⚠️ Solución de Problemas Comunes

1. **Error de API Key**
```bash
Error: Invalid API key
Solución: Verificar el archivo .env.local y la API key de TMDB
```

2. **Problemas de Autenticación**
```bash
Error:  auth failed
Solución: Verificar la configuración de las credenciales
```



Desarrollado con ❤️ por LauraDuarte

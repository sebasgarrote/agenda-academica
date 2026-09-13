# Agenda Académica

Aplicación web para organizar y hacer seguimiento de actividades universitarias.

## Características

- Calendario mensual con actividades
- Vista semanal con filtros
- Modo local (localStorage) y sincronización en la nube con Supabase
- Acceso rápido al Campus UTN

## Paso a paso para publicarla online

### 1) Crear cuenta y proyecto en Supabase

1. Ir a https://supabase.com y crear una cuenta (podés usar GitHub).
2. Crear un **nuevo proyecto**.
3. Dentro del proyecto, ir a **SQL Editor** y ejecutar el script de tablas + RLS.
   - Podés usar el script que estaba en la app o el siguiente resumen:
     - Tabla `subjects`
     - Tabla `activities`
     - Tabla `notification_preferences`
     - RLS por `auth.uid() = user_id` en cada tabla.
4. Ir a **Project Settings ? API** y copiar:
   - `Project URL`
   - `anon public` key

### 2) Configurar la app

1. Copiar `.env.example` como `.env` en la raíz del proyecto.
2. Pegar la URL y la clave de Supabase:
   - `VITE_SUPABASE_URL=...`
   - `VITE_SUPABASE_ANON_KEY=...`

### 3) Probar en local

```bash
npm install
npm run dev
```

### 4) Publicar online (ejemplo: Vercel)

1. Subir el proyecto a GitHub.
2. En Vercel, crear un nuevo proyecto desde ese repositorio.
3. En **Environment Variables** de Vercel, agregar:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy.

### 5) Configurar la app la primera vez

1. Abrir la URL publicada.
2. En el header, clic en **Ingresar** y configurar Supabase (o pegar credenciales).
3. Una vez configurado, los datos se guardan en la nube vinculados a tu usuario.

## Scripts

- `npm run dev` — desarrollo
- `npm run build` — build de producción
- `npm run preview` — previsualizar build localmente

## Notas

- Modo local sin Supabase: funciona con `localStorage`.
- Al pasar a Supabase, se mantiene la navegación, calendario, filtros y campus.
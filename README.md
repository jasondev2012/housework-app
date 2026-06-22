# Housework App

Aplicación web para gestionar tareas del hogar compartidas entre 2 personas (pareja).

Stack: **React + Vite + TypeScript + TailwindCSS + Firebase** (Auth + Firestore).

## Características

- Login con Google (Firebase Authentication)
- Acceso restringido a 2 emails autorizados
- CRUD de tareas en tiempo real (Firestore)
- Filtros: Todas / Mías / Completadas
- Penalidades por tareas atrasadas
- Scoreboard de penalidades entre ambos
- Vista de calendario simple
- UI moderna y responsive

---

## Requisitos

- Node.js 18+
- Cuenta de Firebase
- Repositorio en GitHub (para deploy)

---

## 1. Configurar Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/) y crea un proyecto.
2. Activa **Authentication** → Sign-in method → **Google**.
3. Crea una app **Web** y copia la configuración.
4. Activa **Firestore Database** (modo producción o prueba).
5. Despliega las reglas de `firestore.rules`:

```bash
firebase deploy --only firestore:rules
```

6. En Authentication → Settings → Authorized domains, agrega:
   - `localhost`
   - `tu-usuario.github.io` (para GitHub Pages)

---

## 2. Variables de entorno

Copia `.env.example` a `.env` y completa con tus credenciales de Firebase:

```bash
cp .env.example .env
```

---

## 3. Usuarios autorizados

Edita `src/utils/allowedUsers.ts` con los emails reales de la pareja:

```ts
export const allowedUsers = [
  'jason@gmail.com',
  'pareja@gmail.com',
]
```

---

## 4. Desarrollo local

```bash
npm install
npm run dev
```

Abre http://localhost:5173/housework-app/

---

## 5. Build

```bash
npm run build
```

---

## 6. Deploy a GitHub Pages

### Opción A — Script incluido

```bash
npm run deploy
```

Esto ejecuta `gh-pages -d dist` y publica la carpeta `dist`.

### Opción B — GitHub Actions (recomendado para CI)

1. Sube el repo a GitHub.
2. En Settings → Pages → Source: **GitHub Actions**.
3. Agrega los secrets de Firebase en Settings → Secrets → Actions:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
4. Crea `.github/workflows/deploy.yml` (opcional, ver abajo).

### Base path

El proyecto está configurado con `base: '/housework-app/'` en `vite.config.ts`.

Si tu repo tiene otro nombre, cámbialo ahí.

---

## Estructura

```
src/
├── firebase/       # config, auth, firestore, users
├── hooks/          # useAuth, useTasks
├── components/     # UI components
├── pages/          # LoginPage, Dashboard
├── utils/          # penalidades, allowedUsers
└── types/          # TypeScript types
```

---

## Lógica de penalidades

Una tarea está **atrasada** si:

```
fecha actual > dueDate && !completed
```

Los `penaltyPoints` de tareas atrasadas se suman al usuario asignado (`assignedTo`). El cálculo es 100% frontend.

---

## GitHub Action (opcional)

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
        env:
          VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
          VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.VITE_FIREBASE_AUTH_DOMAIN }}
          VITE_FIREBASE_PROJECT_ID: ${{ secrets.VITE_FIREBASE_PROJECT_ID }}
          VITE_FIREBASE_STORAGE_BUCKET: ${{ secrets.VITE_FIREBASE_STORAGE_BUCKET }}
          VITE_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.VITE_FIREBASE_MESSAGING_SENDER_ID }}
          VITE_FIREBASE_APP_ID: ${{ secrets.VITE_FIREBASE_APP_ID }}
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
      - uses: actions/deploy-pages@v4
```

---

## Licencia

MIT

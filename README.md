# Balqaa Glow

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file from `.env.example` and fill in Firebase values from your Firebase project settings.

3. Start development server:

```bash
npm run dev
```

## Firebase Setup

The project is already wired to Firebase through `src/lib/firebase.ts`.

Required environment variables:

- `VITE_ENABLE_ADMIN` (`true` لتفعيل لوحة التحكم، و `false` لإخفائها ومنع الوصول إلى `/admin`)
- `VITE_ADMIN_PASSWORD`
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

Optional:

- `VITE_FIREBASE_MEASUREMENT_ID` (for Analytics)

Exports available from the Firebase module:

- `firebaseApp`
- `auth`
- `db`
- `storage`
- `initFirebaseAnalytics()`

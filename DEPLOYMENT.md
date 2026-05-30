# Zoctor Deployment Checklist

## Frontend

Set before building:

```env
NEXT_PUBLIC_API_URL=https://zoctor.eventsbyan.com
```

Build:

```bash
npm install
npm run build
```

For a Node-capable host, run:

```bash
npm run start
```

For static-only hosting, enable `output: "export"` in `next.config.mjs`, build, and upload the generated `out/` contents.

## Backend

Set Laravel environment:

```env
APP_URL=https://your-backend-domain.com
FRONTEND_URL=https://your-frontend-domain.com
DB_CONNECTION=mysql
CACHE_STORE=redis
OPENAI_API_KEY=
OPENAI_CHAT_MODEL=gpt-4o-mini
OPENAI_WHISPER_MODEL=whisper-1
ELEVENLABS_API_KEY=
ELEVENLABS_VOICE_ID=
```

Run:

```bash
composer install --no-dev --optimize-autoloader
php artisan key:generate
php artisan migrate --force
php artisan db:seed --force
php artisan storage:link
php artisan config:cache
php artisan route:cache
```

Make sure CORS allows your frontend domain through `FRONTEND_URL`.

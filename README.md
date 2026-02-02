# Codeikoo Todo UI (Angular)

This is a minimal Angular **standalone** app wired to a .NET Web API.

## Requirements
- Node.js (LTS recommended)

## Install & Run
```bash
npm install
npm start
```

By default, the UI calls:
- `https://localhost:5001/api/todos`

If your API is on a different URL/port, update:
- `src/app/core/api.config.ts`

## Proxy (optional)
If you want to avoid CORS during development, create `proxy.conf.json` and run:
```bash
npm run start:proxy
```

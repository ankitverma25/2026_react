# Daymark Task Space

A React learning project built with Vite. The UI includes signup/login, protected nested routes, task create/edit/delete, status filters, title search, sorting, pagination, and a local demo fallback while the API is offline.

## Run it

```sh
npm install
npm run dev
```

Use any email and a password with at least six characters to enter demo mode while the backend is unavailable. Demo changes live in React state and are not persisted after refresh.

## Connect the backend

The default API base URL is `http://localhost:5000/api`. Set `VITE_API_URL` in a `.env` file to use another base URL. Build the Express API to match [API-REQUIREMENTS.md](API-REQUIREMENTS.md) exactly; the frontend reads the response shapes documented there.

## Learn from the source

[REACT-CONCEPTS.md](REACT-CONCEPTS.md) explains each requested React concept, where it appears, when to use it, and common mistakes.

## Checks

```sh
npm run lint
npm run build
```

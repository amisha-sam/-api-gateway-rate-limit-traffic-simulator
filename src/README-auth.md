Pulsegate Authentication Module

This folder contains a production-ready frontend authentication system (React + TypeScript) designed to plug into Pulsegate's existing app. It implements:

- JWT + Refresh token flow with Axios interceptors
- Login, Register, Forgot Password, Reset Password pages
- Protected routes and profile page
- Zod form validation and React Hook Form integration
- Zustand auth store with persistent storage

Quick integration

1. Install dependencies in your app:
   - axios
   - zustand
   - react-hook-form
   - zod
   - @hookform/resolvers

   e.g. npm install axios zustand react-hook-form zod @hookform/resolvers

2. Ensure your app wraps routes with the provided <AppRouter /> (src/routes/AppRouter.tsx).

3. Configure API base URL via ENV:
   - REACT_APP_API_BASE_URL or VITE_API_BASE_URL will be used by the Axios client.

4. Backend endpoints expected (adjust paths as needed):
   - POST /api/auth/login
   - POST /api/auth/register
   - POST /api/auth/logout
   - POST /api/auth/refresh
   - POST /api/auth/forgot-password
   - POST /api/auth/reset-password
   - GET  /api/users/me
   - PUT  /api/users/profile
   - POST /api/auth/change-password

Security notes

- Prefer storing refresh tokens in secure, httpOnly cookies from the backend. This client supports withCredentials for cookie-based refresh.
- If using storage-based refresh tokens, ensure secure storage and proper rotation on backend.

The auth implementation is intentionally modular; move files into the main app structure or import the modules directly.

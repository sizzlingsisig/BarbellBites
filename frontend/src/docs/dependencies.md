# BarbellBites Dependencies

Assumption: this document targets the latest stable version of every dependency.

## Current Frontend Dependencies
Source: `frontend/package.json`

### Runtime (`dependencies`)
- react (latest)
- react-dom (latest)

### Dev (`devDependencies`)
- @eslint/js (latest)
- @types/node (latest)
- @types/react (latest)
- @types/react-dom (latest)
- @vitejs/plugin-react-swc (latest)
- eslint (latest)
- eslint-plugin-react-hooks (latest)
- eslint-plugin-react-refresh (latest)
- globals (latest)
- typescript (latest)
- typescript-eslint (latest)
- vite (latest)

## Current Backend Dependencies
Source: `backend/package.json`

### Runtime (`dependencies`)
- bcryptjs (latest)
- cookie-parser (latest)
- cors (latest)
- dotenv (latest)
- express (latest)
- jsonwebtoken (latest)
- mongoose (latest)
- morgan (latest)
- multer (latest)
- nodemon (latest)
- zod (latest)

### Dev (`devDependencies`)
- @types/bcryptjs (latest)
- @types/cookie-parser (latest)
- @types/cors (latest)
- @types/express (latest)
- @types/jsonwebtoken (latest)
- @types/morgan (latest)
- @types/multer (latest)
- @types/node (latest)
- tsx (latest)
- typescript (latest)

## MVP Planned Additions

## Frontend planned runtime additions
- react-router-dom
- @tanstack/react-query
- zustand
- react-hook-form
- @hookform/resolvers
- zod
- @mantine/core
- @mantine/hooks
- @tabler/icons-react
- clsx
- sonner
- dayjs
- @mantine/dates

## Frontend planned dev additions
- tailwindcss
- postcss
- autoprefixer
- vitest
- @testing-library/react
- @testing-library/user-event
- jsdom

## Backend optional additions
- helmet
- express-rate-limit
- compression
- vitest
- supertest

## Installation Commands (planned)
### Frontend
```bash
# Frontend Runtime (Cleaned)
npm i react-router-dom@latest @tanstack/react-query@latest zustand@latest react-hook-form@latest @hookform/resolvers@latest zod@latest @mantine/core@latest @mantine/hooks@latest @tabler/icons-react@latest clsx@latest sonner@latest dayjs@latest @mantine/dates@latest

# Frontend Dev (Unchanged)
npm i -D tailwindcss@latest postcss@latest autoprefixer@latest vitest@latest @testing-library/react@latest @testing-library/user-event@latest jsdom@latest
```

### Backend
```bash
npm i helmet@latest express-rate-limit@latest compression@latest
npm i -D vitest@latest supertest@latest
```

## Notes
- Since backend uses `tsx watch`, `nodemon` can be removed if not needed.
- Keep server-state in React Query and global client-state in Zustand.

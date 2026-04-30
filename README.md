# Auth WebApp - React + Vite + Spring Boot

A full-stack authentication web application built with React, Vite, Tailwind CSS, and Spring Boot.

This project supports email/password signup and login, JWT access tokens, refresh-token rotation, protected frontend routes, Google OAuth, GitHub OAuth, logout, and user profile name editing.

## Features

- Register with name, email, and password
- Login with email and password
- Google OAuth login
- GitHub OAuth login
- JWT-based authentication
- Refresh-token rotation
- Protected dashboard routes
- User profile page
- Edit and save profile name
- Dark/light mode toggle
- Logout with token cleanup
- Swagger API documentation
- Docker support

This project does not include an admin dashboard UI. The current frontend contains an authentication flow, dashboard overview, and user profile page.

## Tech Stack

### Frontend

- React
- Vite
- TypeScript
- Tailwind CSS
- Axios
- React Router
- Zustand
- ShadCN-style UI components
- Lucide React icons

### Backend

- Spring Boot 3.x
- Spring Security 6.x
- Spring Data JPA
- MySQL
- OAuth2 Client
- JWT
- BCrypt
- Lombok
- HikariCP
- Springdoc OpenAPI / Swagger

## Project Structure

```text
auth-app-boot-react-dev/
|
|-- auth-backend/              # Spring Boot backend
|   |-- src/
|   |-- pom.xml
|   |-- Dockerfile
|   `-- .env.example
|
|-- auth-front/                # React + Vite frontend
|   |-- src/
|   |-- package.json
|   |-- vite.config.ts
|   |-- Dockerfile
|   `-- .env.example
|
|-- docker-compose.yml
|-- run-backend.ps1
|-- .env.example
|-- .gitignore
`-- README.md
```

## Backend Setup

### Prerequisites

- Java 21+
- Maven 3.9+
- MySQL 8+

### Run Backend Locally

1. Open the backend folder:

```powershell
cd auth-backend
```

2. Create the database:

```sql
CREATE DATABASE auth_app;
```

3. Create a backend `.env` file:

```powershell
copy .env.example .env
```

4. Update `auth-backend/.env`:

```env
SPRING_PROFILES_ACTIVE=dev
SERVER_PORT=8082

DATABASE_URL=jdbc:mysql://localhost:3306/auth_app
DATABASE_USERNAME=root
DATABASE_PASSWORD=your-mysql-password
JPA_DDL_AUTO=update

JWT_SECRET=replace-with-at-least-64-random-characters-for-hs512-signing
JWT_ISSUER=auth-app
JWT_ACCESS_TTL_SECONDS=900
JWT_REFRESH_TTL_SECONDS=1209600
JWT_COOKIE_SECURE=false
JWT_COOKIE_SAME_SITE=Lax
JWT_COOKIE_DOMAIN=

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

FRONT_END_URL=http://localhost:5173
FRONT_END_SUCCESS_REDIRECT=http://localhost:5173/oauth/success
FRONT_END_FAILURE_REDIRECT=http://localhost:5173/oauth/failure
```

5. Start the backend:

```powershell
mvn.cmd spring-boot:run
```

Backend URL:

```text
http://localhost:8082
```

Swagger UI:

```text
http://localhost:8082/swagger-ui/index.html
```

## Frontend Setup

### Prerequisites

- Node.js 18+
- npm

### Run Frontend Locally

1. Open the frontend folder:

```powershell
cd auth-front
```

2. Install dependencies:

```powershell
npm.cmd install
```

3. Create a frontend `.env` file:

```powershell
copy .env.example .env
```

4. Update `auth-front/.env`:

```env
VITE_BASE_URL=http://localhost:8082
VITE_API_BASE_URL=http://localhost:8082/api/v1
```

5. Start the frontend:

```powershell
npm.cmd run dev
```

Frontend URL:

```text
http://localhost:5173
```

## Authentication Flow

### Email And Password

1. User creates an account with name, email, and password.
2. Backend validates the request.
3. Password is hashed with BCrypt.
4. User logs in with email and password.
5. Backend returns a JWT access token and sets a refresh token cookie.
6. Frontend stores the access token in memory.

### Google And GitHub OAuth

1. User clicks Google or GitHub login.
2. Backend redirects the user to the OAuth provider.
3. After successful login, backend creates or updates the user.
4. If the same email already exists, the account is reused.
5. Backend sets a refresh token cookie.
6. Frontend refreshes the session and redirects to the dashboard.

### Refresh Token

1. Access token is short-lived.
2. Refresh token is stored in an HTTP-only cookie.
3. Axios interceptor refreshes the access token when needed.

### Logout

1. Refresh token is revoked in the database.
2. Refresh cookie is cleared.
3. Current access token is blacklisted.
4. Frontend clears authentication state.

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/v1/auth/register` | Register a new user |
| `POST` | `/api/v1/auth/login` | Login with email and password |
| `POST` | `/api/v1/auth/refresh` | Refresh access token |
| `GET` | `/api/v1/auth/me` | Get current user profile |
| `PATCH` | `/api/v1/auth/me` | Update current user's name |
| `POST` | `/api/v1/auth/logout` | Logout and revoke tokens |
| `GET` | `/oauth2/authorization/google` | Start Google OAuth login |
| `GET` | `/oauth2/authorization/github` | Start GitHub OAuth login |

## Environment Variables

| Variable | Description | Example |
| --- | --- | --- |
| `DATABASE_URL` | MySQL JDBC URL | `jdbc:mysql://localhost:3306/auth_app` |
| `DATABASE_USERNAME` | Database username | `root` |
| `DATABASE_PASSWORD` | Database password | `password` |
| `JWT_SECRET` | JWT signing secret | `64-character-random-secret` |
| `JWT_ISSUER` | JWT issuer | `auth-app` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | `xxxxx.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | `xxxxxx` |
| `GITHUB_CLIENT_ID` | GitHub OAuth client ID | `github-client-id` |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth client secret | `github-client-secret` |
| `FRONT_END_URL` | Allowed frontend origin | `http://localhost:5173` |
| `VITE_BASE_URL` | Backend base URL | `http://localhost:8082` |
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:8082/api/v1` |

## Common Commands

| Task | Command |
| --- | --- |
| Run backend | `mvn.cmd spring-boot:run` |
| Package backend | `mvn.cmd -DskipTests package` |
| Run frontend | `npm.cmd run dev` |
| Build frontend | `npm.cmd run build` |
| Preview frontend build | `npm.cmd run preview` |
| Run Docker setup | `docker compose up --build` |

## Docker Setup

Create a root `.env` file:

```powershell
copy .env.example .env
```

Start the full stack:

```powershell
docker compose up --build
```

Docker starts:

- MySQL
- Spring Boot backend
- React frontend served by Nginx

## Security Notes

- Passwords are hashed with BCrypt.
- Access tokens are short-lived.
- Refresh tokens are rotated and stored server-side.
- Refresh token cookie is HTTP-only.
- Logout revokes refresh tokens.
- Logout blacklists the active access token.
- Production secrets are configured through environment variables.
- CORS is configured with frontend origin.

## Deployment Notes

### Frontend

Build frontend:

```powershell
cd auth-front
npm.cmd run build
```

Deploy `auth-front/dist/` to Vercel, Netlify, Nginx, or any static hosting provider.

### Backend

Build backend:

```powershell
cd auth-backend
mvn.cmd -DskipTests package
```

Deploy the generated JAR from:

```text
auth-backend/target/
```

For production:

- Use HTTPS.
- Set `JWT_COOKIE_SECURE=true`.
- Use a strong `JWT_SECRET`.
- Configure production database credentials.
- Add production OAuth redirect URLs in Google and GitHub developer consoles.
- Set all environment variables on the hosting platform.

## Screenshots

Add screenshots of your current UI after final design changes.

Recommended screenshots:

- Home page
- Login page
- Register page
- Dashboard overview
- Profile page

## Author

Built and customized by **Code Smasher**.

## License

This project is available for learning, customization, and portfolio use.

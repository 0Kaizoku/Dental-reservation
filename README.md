# Dental Reservation

A full-stack web application for managing patients and appointments in a dental clinic. It provides secure authentication, patient records management, appointment scheduling, dashboards, and more. The stack is split into a .NET 8 Web API backend and a Vite React TypeScript frontend.

## Features

- **Authentication (JWT)**: Login endpoint issues JWTs; frontend stores token and attaches it to API calls.
- **Patients management**: Create, read, update, delete patients; filter and search.
- **Appointments (Rendez-Vous)**: Create, update, delete, list; available-slots endpoint.
- **Profile**: View and update user profile and change password.
- **Dashboard & stats**: Overview metrics and charts.
- **Modern UI**: Vite + React + TypeScript, TailwindCSS, shadcn/ui.
- **API docs (dev)**: Swagger enabled in Development environment.

## Tech Stack

- **Backend**: ASP.NET Core 8 (`api/`), Entity Framework Core, SQL Server
- **Frontend**: React 18 + TypeScript + Vite (`frontend/`), TailwindCSS, shadcn/ui
- **Runtime**: Docker (API: ASP.NET runtime, Web: Nginx)
- **Orchestration**: Docker Compose (`docker-compose.yml`)
- **CI/CD**: GitHub Actions for building and pushing Docker images

## Project Structure

```
Dental-reservation/
├─ api/                    # ASP.NET Core Web API (net8.0)
│  ├─ Controllers/         # e.g. AuthController, PatientsController, RendezVousController...
│  ├─ Data/                # ApplicationDbContext
│  ├─ Models/              # Entities & DTOs (e.g. User, LoginDto, RdvPatient)
│  ├─ appsettings*.json    # App configuration (connection strings, JWT, etc.)
│  ├─ Program.cs           # API bootstrapping (CORS, Auth, Swagger)
│  └─ Dockerfile           # Multi-stage build for API image
├─ frontend/               # Vite React TypeScript SPA
│  ├─ src/
│  │  ├─ lib/api.ts        # API client (reads VITE_API_BASE_URL or defaults to /api)
│  │  └─ pages/            # Pages (Dashboard, Patients, Appointments, Calendar, ...)
│  ├─ vite.config.ts       # Dev server config (proxy /api to backend in dev)
│  ├─ nginx.conf           # Nginx config to serve SPA and proxy /api in Docker
│  └─ Dockerfile           # Build SPA and serve via Nginx
├─ docker-compose.yml      # Runs both services together (api + web)
├─ .env                    # Compose runtime variables (NOT committed)
├─ .env.example            # Sample env
└─ .github/workflows/      # CI workflows (Docker build/push, .NET API CI)
```

## API Endpoints (examples)

- Base URL in dev: `http://localhost:5057/api` (HTTP) and `https://localhost:7091/api` (HTTPS)
- Base URL in Docker: `http://localhost:5057/api`
- Examples:
  - `POST /api/Auth/login`
  - `GET /api/Patients`, `GET /api/Patients/{id}`, `POST /api/Patients`, `PUT /api/Patients/{id}`, `DELETE /api/Patients/{id}`
  - `GET /api/RendezVous`, `POST /api/RendezVous`, `PUT /api/RendezVous/{numRdv}`, `DELETE /api/RendezVous/{numRdv}`
  - `GET /api/RendezVous/available-slots`
  - `GET /api/Profile/me`, `PUT /api/Profile/me`, `PUT /api/Profile/password`

## Local Development

Backend (API):

1. Configure SQL Server connection string and JWT in `api/appsettings.Development.json` or user secrets.
2. Run the API using the HTTPS profile (Swagger in Development):
   - Visual Studio/VS Code: run the `https` profile.
   - CLI: `dotnet run --launch-profile https` from `api/`.
3. API listens on `https://localhost:7091` and `http://localhost:5057`.

Frontend (Vite):

1. From `frontend/`, install and run dev server:
   ```bash
   npm ci
   npm run dev
   ```
2. App is served at `http://localhost:8080`.
3. Dev proxy in `vite.config.ts` forwards `/api` to `https://localhost:7091` (self-signed cert accepted).

## Environment Variables

Runtime variables are read by the API from configuration and by Compose from `.env` (placed at the repo root):

```
# API (used by docker-compose.yml)
ConnectionStrings__DefaultConnection=Server=host.docker.internal,1433;Database=CabinetD;User Id=sa;Password=***;TrustServerCertificate=True;
JWT_KEY=your-strong-secret
JWT_ISSUER=http://api
JWT_AUDIENCE=http://api
```

- If SQL Server runs on your host with a non-default port, replace `1433` with that port (e.g., `50434`).
- For local dev, the frontend uses `VITE_API_BASE_URL` if provided at build time; otherwise it defaults to `/api` and relies on proxying.

## Docker

Build images manually:

```bash
# From repo root
docker build -f api/Dockerfile -t dental-reservation-api:latest .
docker build -f frontend/Dockerfile -t dental-reservation-web:latest .
```

Run with Docker Compose:

```bash
# Ensure .env exists with the required keys
docker compose build
docker compose up -d

# URLs
# Frontend (compose): http://localhost:8081
# API (compose):      http://localhost:5057/api
```

Notes:

- The frontend Nginx proxies `/api/*` to the API service inside the compose network.
- API HTTPS redirection can be disabled in containers via config flag (we wire `EnableHttpsRedirection=false` for compose).

## Pushing Images to Docker Hub

Manual push:

```bash
docker tag dental-reservation-api:latest YOUR_USER/dental-reservation-api:latest
docker tag dental-reservation-web:latest YOUR_USER/dental-reservation-web:latest
docker login -u YOUR_USER
docker push YOUR_USER/dental-reservation-api:latest
docker push YOUR_USER/dental-reservation-web:latest
```

## CI/CD (GitHub Actions)

- `/.github/workflows/docker-build-push.yml`: builds API and Web images and pushes to Docker Hub on push to `main` and tags (`v*`). Requires repo secrets:
  - `DOCKERHUB_USERNAME`
  - `DOCKERHUB_TOKEN` (Docker Hub Access Token)
- `/.github/workflows/dotnet-desktop.yml` (renamed in UI as “.NET API CI”): restores, builds, and publishes the API and uploads an artifact.

## Security Notes

- Do not commit real secrets. Use environment variables, GitHub Secrets, or CI/CD secret stores.
- In production, use HTTPS termination at a reverse proxy/load balancer and set trusted issuers/audiences for JWT.

## License

This project is provided as-is. Add your preferred license if you plan to distribute.

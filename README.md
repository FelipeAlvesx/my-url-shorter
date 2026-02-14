# 🔗 URL Shortener

REST API for shortening URLs, with click tracking and automatic redirection.

## 📋 Features

- ✅ Shorten long URLs by generating unique codes
- ✅ URL validation (http/https, protocol and TLD required)
- ✅ Automatic redirection to original URL
- ✅ Real-time click tracking
- ✅ List all created links
- ✅ Data persistence with SQLite
- ✅ Configurable base URL for shortened links
- ✅ Graceful shutdown

## 🚀 Technologies

- **[Node.js](https://nodejs.org/)** - JavaScript runtime
- **[Express](https://expressjs.com/)** - Minimalist web framework
- **[TypeScript](https://www.typescriptlang.org/)** - Typed superset of JavaScript
- **[Prisma](https://www.prisma.io/)** - Modern ORM for Node.js
- **[SQLite](https://www.sqlite.org/)** - Lightweight relational database
- **[Better SQLite3](https://github.com/WiseLibs/better-sqlite3)** - High-performance SQLite driver
- **[Validator](https://github.com/validatorjs/validator.js)** - String validation library

## 📦 Prerequisites

- Node.js 18+ or Bun
- npm or bun

## 🔧 Installation

1. **Clone the repository:**

```bash
git clone <repository-url>
cd api
```

2. **Install dependencies:**

```bash
npm install
# or
bun install
```

3. **Configure environment variables:**

Create a `.env` file in the project root:

```env
PORT=3000
DATABASE_URL="file:./dev.db"
BASE_URL="http://localhost:3000"
```

| Variable      | Required | Description                                              |
| ------------- | -------- | -------------------------------------------------------- |
| `PORT`        | Yes      | Port the server will listen on                           |
| `DATABASE_URL`| Yes      | SQLite connection string (e.g. `file:./dev.db`)          |
| `BASE_URL`    | Yes      | Base URL for shortened links (e.g. `http://localhost:3000`) |

4. **Run database migrations:**

```bash
npx prisma migrate dev
```

5. **Generate Prisma Client:**

```bash
npx prisma generate
```

## ▶️ Running the project

### Development mode

```bash
npm run dev
# or
bun run dev
```

The server will be running at `http://localhost:3000`

## 📡 API Endpoints

### 1. Health Check

```http
GET /ping
```

**Response:**

```json
{
    "message": "pong"
}
```

### 2. Create shortened link

```http
POST /links
Content-Type: application/json

{
  "original": "https://example.com/very-long-url"
}
```

**Success Response (201):**

```json
{
    "message": "Link criado com sucesso!",
    "shortCode": "abc123",
    "url": "http://localhost:3000/abc123"
}
```

**Validation Error (400):**

When the URL is invalid (missing protocol, invalid format, etc.):

```json
{
    "message": "URL inválida"
}
```

### 3. Redirect to original URL

```http
GET /:code
```

Example: `GET /abc123`

Redirects (HTTP 302) to the original URL and increments the click counter.

**Error Response (404):** Link not found

```json
{
    "message": "Link não encontrado"
}
```

### 4. List all links

```http
GET /links/all
```

**Response (200):**

```json
[
    {
        "id": "clxyz123...",
        "original": "https://example.com/page",
        "shortCode": "abc123",
        "clicks": 5,
        "createdAt": "2024-01-15T10:30:00.000Z"
    }
]
```

## 🗄️ Database Structure

### Model: Link

| Field     | Type     | Description                 |
| --------- | -------- | --------------------------- |
| id        | String   | Unique ID (CUID)            |
| original  | String   | Original URL                |
| shortCode | String   | Unique short code (6 chars) |
| clicks    | Int      | Click counter               |
| createdAt | DateTime | Creation date               |

## 📁 Project Structure

```
api/
├── prisma/
│   ├── schema.prisma       # Database schema
│   ├── migrations/         # Prisma migrations
│   └── prisma.config.ts    # Prisma configuration
├── src/
│   ├── db/
│   │   └── db-config.ts    # SQLite adapter configuration
│   ├── routes/
│   │   ├── linkRoute.ts    # Links routes
│   │   └── links/
│   │       ├── create.ts   # Create shortened link
│   │       ├── findAll.ts  # List all links
│   │       └── redirect.ts # Redirect by short code
│   └── index.ts            # Main server
├── package.json
├── tsconfig.json
├── prisma.config.ts
└── .env                    # Environment variables (create this)
```

## 🛠️ Available Scripts

- `npm run dev` - Start server in development mode with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start server in production mode
- `npx prisma studio` - Open visual database interface
- `npx prisma migrate dev` - Create and apply new migrations
- `npx prisma generate` - Generate Prisma Client

## 🐳 Docker

### Using Docker Compose (Recommended)

```bash
# Build and start the container
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the container
docker-compose down

# Stop and remove volumes (deletes database)
docker-compose down -v
```

To use a custom base URL with Docker, add `BASE_URL` to the `environment` section in `docker-compose.yml`:

```yaml
environment:
    - NODE_ENV=production
    - PORT=3000
    - DATABASE_URL=file:/app/data/dev.db
    - BASE_URL=https://seusite.com
```

### Using Docker directly

```bash
# Build image
docker build -t url-shortener-api .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL="file:/app/data/dev.db" \
  -e BASE_URL="http://localhost:3000" \
  -v url-shortener-data:/app/data \
  url-shortener-api
```

The API will be available at `http://localhost:3000`

## 📝 Usage Example

```bash
# Create a shortened link
curl -X POST http://localhost:3000/links \
  -H "Content-Type: application/json" \
  -d '{"original": "https://github.com/prisma/prisma"}'

# List all links
curl http://localhost:3000/links/all

# Access the shortened link (via browser or curl)
curl -L http://localhost:3000/abc123
```

## 🔒 Graceful Shutdown

The server is configured to safely disconnect the Prisma Client when receiving the SIGINT signal (Ctrl+C).

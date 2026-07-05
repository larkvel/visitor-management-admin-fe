# Visitor Management Admin Frontend

React + Vite admin dashboard for managing customer companies and platform-wide metrics.

## Features

- Platform dashboard with metrics (companies, users, visits)
- Company management (create, edit, view)
- Customer account management
- Role-based permission system

## Tech Stack

- **Frontend**: React 18.3.1
- **Build Tool**: Vite 5.4.2
- **UI Icons**: Lucide React 0.468.0
- **Web Server**: Nginx 1.27-alpine

## Setup

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```
VITE_API_BASE_URL=http://localhost:3000
```

3. Start dev server:
```bash
npm run dev
```

Dev server will be available at `http://localhost:5173`

### Docker

Build and run with Docker:
```bash
docker build -t visitor-management-admin-fe \
  --build-arg VITE_API_BASE_URL=http://api.example.com \
  .
docker run -p 8080:80 visitor-management-admin-fe
```

Or with Docker Compose:

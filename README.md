# 🚀 React Template

A modern, high-performance full-stack React template powered by **Vite+** and **TanStack Start**. Designed for developer experience, type-safety, and modularity.

## 📋 Overview

This template provides a solid foundation for building full-stack applications with the latest React 19 features. It uses a modular monolith architecture that can easily scale or be transitioned to a monorepo if needed.

## ✨ Features

- ⚛️ **React 19**: Leveraging the latest React features and improvements.
- 🚀 **TanStack Start**: Full-stack React framework with type-safe routing and SSR.
- ⚡ **Vite+**: Unified toolchain for dev, build, lint, format, and test.
- 🗄️ **Drizzle ORM**: Type-safe TypeScript ORM for PostgreSQL.
- 🎨 **Tailwind CSS v4**: Utility-first styling with the latest engine.
- 🧩 **Shadcn UI**: 50+ accessible UI components built on `@base-ui/react`.
- 📦 **Modular Design**: Clean separation of concerns within `src/core`.

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org) v22+ and [pnpm](https://pnpm.io) installed on your machine.
- [Docker](https://www.docker.com/) (optional, for local PostgreSQL).

### Installation

```bash
# Install dependencies
pnpm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your credentials
```

### Database Setup

```bash
# Start PostgreSQL via Docker (optional)
docker-compose up -d

# Run migrations
pnpm db:migrate
```

### Development

```bash
vp dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🛠️ Tech Stack

| Technology                                   | Category  | Description                                    |
| -------------------------------------------- | --------- | ---------------------------------------------- |
| [Vite+](https://viteplus.dev)                | Toolchain | Unified dev, build, lint, format, and test     |
| [React 19](https://react.dev)                | Frontend  | The library for web and native user interfaces |
| [TanStack Start](https://tanstack.com/start) | Framework | Full-stack React framework                     |
| [Tailwind CSS v4](https://tailwindcss.com)   | Styling   | Utility-first CSS framework                    |
| [Drizzle ORM](https://orm.drizzle.team)      | Database  | TypeScript ORM for SQL databases               |

## 📂 Project Structure

```
├── src/
│   ├── components/         # UI components, layouts, and providers
│   ├── core/               # Core business logic & infrastructure
│   │   ├── database/       # Drizzle client and schema definitions
│   │   ├── schema/         # Shared Zod validation schemas
│   │   └── shared/         # Shared utilities and constants
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Application-specific utilities
│   ├── routes/             # TanStack Router file-based routes
│   ├── server.ts           # Server entry point
│   └── start.tsx           # Client entry point
├── drizzle.config.ts       # Drizzle ORM configuration
├── package.json            # Project dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite/Rolldown configuration
```

## 📜 Development Commands

| Command            | Description                           |
| ------------------ | ------------------------------------- |
| `vp dev`           | Start development server on port 3000 |
| `vp build`         | Build the application for production  |
| `vp check`         | Format, lint, and type-check          |
| `vp lint --fix`    | Lint code using Oxlint                |
| `vp fmt`           | Format code using Oxfmt               |
| `vp test`          | Run tests with Vitest                 |
| `pnpm db:generate` | Generate Drizzle migrations           |
| `pnpm db:migrate`  | Apply Drizzle migrations              |

## 🔐 Environment Variables

Create a `.env.local` file in the root directory:

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/db
```

## 📄 License

This project is licensed under the MIT License.

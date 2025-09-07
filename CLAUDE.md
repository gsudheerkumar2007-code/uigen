# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Setup project (install dependencies, generate Prisma client, run migrations)
npm run setup

# Development server with Turbopack
npm run dev

# Run development server in background (logs to logs.txt)
npm run dev:daemon

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Run tests
npm test

# Reset database
npm run db:reset
```

## Architecture Overview

UIGen is a React component generator that uses Claude AI to create components with live preview capabilities. It consists of several key architectural layers:

### Core Systems

1. **Virtual File System** (`src/lib/file-system.ts`): In-memory file system that manages component files without writing to disk. Supports full file operations including create, read, update, delete, and rename.

2. **Chat Integration** (`src/app/api/chat/route.ts`): AI-powered chat endpoint that processes user requests and generates React components using the Anthropic AI SDK.

3. **Component Preview** (`src/components/preview/PreviewFrame.tsx`): Live preview system that renders generated components in real-time using a sandboxed iframe with Babel transformation.

4. **Code Editor** (`src/components/editor/CodeEditor.tsx`): Monaco Editor integration for viewing and editing generated component code.

### Data Layer

- **Database**: SQLite with Prisma ORM
- **Models**: User and Project entities
- **Authentication**: Custom auth system with JWT tokens using `jose` library
- **Anonymous Support**: Projects can be created without user accounts

### Frontend Architecture

- **Framework**: Next.js 15 with App Router and React 19
- **Styling**: Tailwind CSS v4 with shadcn/ui components
- **State Management**: React Context for chat and file system state
- **Component Library**: Radix UI primitives with custom styling

### Key Features

- **Real-time Component Generation**: Users describe components in natural language, AI generates React/TypeScript code
- **Live Preview**: Instant preview of generated components with hot reload
- **Virtual File System**: All files exist in memory only, no disk writes during development
- **Component Persistence**: Registered users can save and load projects
- **Export Functionality**: Generated code can be exported for use in other projects

### File Structure

- `src/app/`: Next.js app router pages and API routes
- `src/components/`: React components organized by feature (auth, chat, editor, preview, ui)
- `src/lib/`: Core utilities and services (file system, database, auth, transformers)
- `src/actions/`: Server actions for database operations
- `src/hooks/`: Custom React hooks
- `prisma/`: Database schema and migrations

### Testing

- **Framework**: Vitest with React Testing Library
- **Configuration**: `vitest.config.mts`
- **Test files**: Located alongside components in `__tests__` directories

### Important Notes

- The project uses a virtual file system - no actual files are written to disk during component generation
- Authentication is optional - anonymous users can use the app with limited features
- The AI integration requires an Anthropic API key in `.env` (optional, falls back to static examples)
- Components are generated using JSX transformation with Babel for live preview
- Use comments sparingly. Only comment complex code.
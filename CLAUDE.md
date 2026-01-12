# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Code Generation Guidelines

**🚨 CRITICAL REQUIREMENT 🚨**: Before generating ANY code whatsoever, Claude Code MUST ALWAYS first read and strictly adhere to the relevant documentation files within the `/docs` directory.


### Mandatory Documentation Review Process:

1. **ALWAYS check `/docs` directory first** - No exceptions
2. **Read ALL relevant docs files** before writing any code
3. **Follow documented standards exactly** - Zero deviation allowed
4. **Reference specific docs sections** when explaining code decisions

This is a **NON-NEGOTIABLE** requirement that ensures all generated code follows project-specific patterns, conventions, architectural decisions, and coding standards documented in the codebase. Failure to follow this process will result in non-compliant code that must be refactored.

- /docs/ui.md

## Project Overview

This is a Next.js 16.1.1 application for a lifting diary course, bootstrapped with `create-next-app`. It uses TypeScript, Tailwind CSS v4, and the new App Router architecture.

## Development Commands

- **Start development server**: `npm run dev` (opens at http://localhost:3000)
- **Build for production**: `npm run build`
- **Start production server**: `npm start`
- **Lint code**: `npm run lint` (uses ESLint with Next.js config)
- **Run tests**: `npm test`

## Architecture

- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS v4 with inline theme configuration
- **Fonts**: Geist Sans and Geist Mono loaded via `next/font/google`
- **TypeScript**: Strict mode enabled with path mapping (`@/*` → `./`)
- **Structure**: Standard App Router layout with `app/layout.tsx` and `app/page.tsx`

## Key Features

- Dark mode support via CSS custom properties and `prefers-color-scheme`
- Responsive design with mobile-first approach
- Custom CSS variables for theming in `app/globals.css`
- TypeScript path aliases configured for imports

## Styling System

The project uses Tailwind CSS v4 with a custom inline theme configuration that maps to CSS custom properties defined in `globals.css`. Dark mode is handled automatically via media queries.
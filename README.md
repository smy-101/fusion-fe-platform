# Fusion FE Platform

Enterprise frontend platform built with React, TypeScript, and modern tooling.

## Technology Stack

- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development with full IntelliSense
- **Vite** - Fast development server and optimized builds
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **Zustand** - Lightweight state management
- **TanStack Query** - Powerful server state management
- **React Router v7** - Modern routing for React applications
- **pnpm** - Fast, disk space efficient package manager
- **Monorepo** - Organized workspace with shared packages

## Project Structure

```
fusion-fe-platform/
├── apps/
│   └── web/                # Main React application
├── packages/
│   ├── shared/             # Shared utilities and types
│   └── ui/                 # Reusable UI components + Storybook
│       ├── .storybook/      # Storybook configuration
│       ├── src/            # Component source files
│       ├── src/*.stories.* # Storybook stories
│       └── storybook-static/ # Built Storybook output
├── package.json            # Root package configuration
├── pnpm-workspace.yaml     # Workspace configuration
└── tsconfig.json          # TypeScript configuration
```

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### Installation

```bash
# Install dependencies
pnpm install

# Start main application
pnpm dev

# Start component showcase
pnpm dev:storybook

# Build for production
pnpm build

# Build component showcase
pnpm build:storybook

# Build all packages and apps
pnpm build:all

# Run type checking
pnpm type-check

# Run linting
pnpm lint
```

## Available Scripts

### Main Application
- `pnpm dev` - Start main web application (http://localhost:3000)
- `pnpm build` - Build main application for production
- `pnpm preview` - Preview main application build

### Component Showcase (Storybook)
- `pnpm dev:storybook` - Start Storybook development server (http://localhost:6006)
- `pnpm build:storybook` - Build Storybook for production
- `pnpm preview:storybook` - Preview built Storybook (http://localhost:6007)

### Development Tools
- `pnpm build:packages` - Build only packages (shared, ui)
- `pnpm build:all` - Build all packages and applications
- `pnpm lint` - Run ESLint across all projects
- `pnpm type-check` - Run TypeScript type checking across all projects
- `pnpm clean` - Clean all build artifacts

## 🎨 Storybook Integration

The project uses **Storybook** for component documentation and testing. Storybook is integrated into the `@fusion/ui` package:

### Features
- **Interactive Components**: Test all UI components in isolation
- **Documentation**: Auto-generated docs with props and usage examples
- **Design System**: Consistent component showcase
- **Development**: Hot reload during component development

### Component Stories
Each component has a `.stories.tsx` file with:
- Multiple variants and states
- Interactive controls
- Usage examples
- Documentation

### Accessing Storybook
```bash
# Development mode
pnpm dev:storybook

# Production build
pnpm build:storybook

# Preview production build
pnpm preview:storybook
```

## Development

The project uses a monorepo structure with pnpm workspaces. Each package can be developed independently while sharing common dependencies and configurations.

### Adding New Packages

1. Create a new directory under `packages/`
2. Add a `package.json` with the workspace configuration
3. Update the root `tsconfig.json` to include the new package
4. Add the package to the workspaces array in the root `package.json`

### Building Packages

Each package can be built independently:

```bash
# Build a specific package
pnpm --filter @fusion/shared build

# Build all packages
pnpm -r build
```

## License

MIT
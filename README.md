# Next.js Starter Template

[![CI](https://github.com/yourusername/nextjs-starter/actions/workflows/ci.yml/badge.svg)](https://github.com/yourusername/nextjs-starter/actions/workflows/ci.yml)
[![Coverage](https://codecov.io/gh/yourusername/nextjs-starter/branch/main/graph/badge.svg)](https://codecov.io/gh/yourusername/nextjs-starter)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)

A modern Next.js starter template with TypeScript, security features, testing, and Docker support.

> **Note:** Update the badge URLs in this README with your actual GitHub username and repository name.

## Quick Start

### Prerequisites

- Node.js >= 20.9.0
- pnpm >= 9.0.0

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app.

## Features

- ⚡ **Next.js 16** with App Router
- 🔒 **Security** - Environment validation, CORS, security headers, XSS protection
- 🧪 **Testing** - Vitest + React Testing Library
- 🎨 **UI Components** - shadcn/ui components
- 🐳 **Docker** - Development and production containers
- 📝 **Code Quality** - ESLint, Prettier, Husky, Commitlint
- 🔧 **TypeScript** - Full type safety

## Project Structure

```
├── app/              # Next.js app directory
├── components/       # React components
│   └── ui/          # shadcn/ui components
├── lib/             # Utilities and helpers
│   └── security/    # Security utilities
├── public/          # Static assets
└── __tests__/       # Test files
```

## Available Scripts

### Development

```bash
pnpm dev          # Start dev server
pnpm build        # Build for production
pnpm start        # Start production server
```

### Code Quality

```bash
pnpm lint         # Run ESLint
pnpm lint:fix     # Fix ESLint issues
pnpm format       # Format with Prettier
pnpm type-check   # TypeScript type checking
pnpm validate     # Run all checks
```

### Testing

```bash
pnpm test         # Run tests (watch mode)
pnpm test:run     # Run tests once
pnpm test:coverage # Generate coverage report
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
NODE_ENV=development
NEXT_PUBLIC_APP_NAME="My App"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
CORS_ORIGIN=""
```

See `.env.example` for all available options.

## Security Features

This template includes comprehensive security utilities:

- **Environment Validation** - Zod-based validation (`lib/env.ts`)
- **CORS Configuration** - Middleware-based CORS (`middleware.ts`)
- **Security Headers** - CSP, HSTS, and more (`next.config.ts`)
- **Input Sanitization** - String, URL, email sanitization (`lib/security/sanitize.ts`)
- **XSS Protection** - HTML, JavaScript, CSS escaping (`lib/security/xss.ts`)

See `lib/security/README.md` for usage examples.

## Docker

### Development (with hot-reload)

```bash
docker-compose up dev
```

### Production

```bash
# Build and start
docker-compose up -d nextjs

# View logs
docker-compose logs -f nextjs

# Stop
docker-compose down
```

## Git Hooks

This project uses Husky to enforce code quality:

- **Pre-commit**: Lints and formats staged files
- **Pre-push**: Runs build and tests

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
feat(auth): add user login
fix(button): correct disabled state
docs(readme): update installation
```

## Testing

Tests are written with Vitest and React Testing Library:

```bash
# Run all tests
pnpm test

# Run with coverage
pnpm test:coverage
```

Place test files next to your code or in `__tests__` directories.

## CI/CD

This project includes GitHub Actions workflows for continuous integration and deployment:

### CI Workflow (`.github/workflows/ci.yml`)

- **Lint & Type Check**: Runs ESLint, Prettier, and TypeScript checks
- **Test**: Runs test suite with coverage reporting
- **Build**: Builds the application to verify it compiles
- **Security Audit**: Scans dependencies for vulnerabilities

Runs on every push and pull request to `main` and `develop` branches.

### CD Workflow (`.github/workflows/cd.yml`)

- **Deploy to AWS Amplify**: Automatically deploys to AWS Amplify on push to `main`
- **Deploy Docker Image**: Builds and pushes Docker images to Docker Hub

### Docker Workflow (`.github/workflows/docker.yml`)

- Builds and pushes Docker images to Docker Hub
- Supports semantic versioning tags
- Includes build caching for faster builds
- Can be triggered manually or on push to `main`

### Dependabot (`.github/dependabot.yml`)

- Automatically updates dependencies weekly
- Groups updates by dependency type
- Opens pull requests for review

## Deployment

### AWS Amplify

The CD workflow automatically deploys to AWS Amplify when you push to `main`. Configure these secrets in GitHub:

- `AWS_AMPLIFY_APP_ID` - Your Amplify App ID
- `AWS_AMPLIFY_TOKEN` - Amplify access token

To get your Amplify token:

1. Go to AWS Amplify Console
2. Navigate to App Settings > Access Tokens
3. Create a new token and add it to GitHub Secrets

### Docker

The CD workflow automatically builds and pushes Docker images to Docker Hub on push to `main` or version tags.

**Configure Docker Hub secrets:**

- `DOCKER_USERNAME` - Your Docker Hub username
- `DOCKER_PASSWORD` - Your Docker Hub access token

**Deploy to container platforms:**

- **AWS**: ECS, EKS, EC2, App Runner
- **Google Cloud**: Cloud Run, GKE
- **Azure**: Container Instances, AKS
- **Railway, Render, DigitalOcean**: All support Docker deployments

**Manual Docker deployment:**

```bash
# Build image
docker build -t nextjs-starter .

# Run container
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  nextjs-starter
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [shadcn/ui](https://ui.shadcn.com/)

## License

MIT

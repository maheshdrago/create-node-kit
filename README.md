# create-node-kit

🚀 A powerful Node.js project scaffolding tool that helps you create production-ready applications in seconds.

[![npm version](https://img.shields.io/npm/v/create-node-kit.svg)](https://www.npmjs.com/package/create-node-kit)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
<img width="1072" height="518" alt="node app" src="https://github.com/user-attachments/assets/9fa4a10d-f8d3-4868-ad69-42787536ac02" />

## ✨ Features

- 🎨 **8 Production-Ready Templates** - Express, Fastify, GraphQL, Socket.io (JavaScript & TypeScript)
- ⚡ **Fast Setup** - Get your project running in under a minute
- 🔧 **Multiple Package Managers** - Support for npm, yarn, and pnpm
- 🎯 **TypeScript Support** - Built-in TypeScript templates with proper configurations
- 🛡️ **Zod Validation** - Optional schema validation with auto-generated middleware
- 🎨 **Code Quality Tools** - ESLint and Prettier pre-configured
- 📝 **Smart Defaults** - Environment variables, .gitignore, and README auto-generated
- 🔄 **Git Ready** - Automatic git initialization with initial commit
- 🎭 **Interactive CLI** - Beautiful prompts with validation
- 📦 **Zero Config** - Works out of the box with sensible defaults

## 🚀 Quick Start

### Using npx (Recommended)

```bash
npx create-node-kit my-awesome-app
```

### Using npm

```bash
npm create node-kit my-awesome-app
```

### Using yarn

```bash
yarn create node-kit my-awesome-app
```

### Using pnpm

```bash
pnpm create node-kit my-awesome-app
```

## 📦 Available Templates

### 1. Basic Node.js + Express
Minimal Express server setup with JavaScript.
- Express.js configured
- Basic routing structure
- Environment variables ready

### 2. Express + TypeScript
TypeScript-powered Express server with type definitions.
- Full TypeScript support
- Type-safe Express setup
- Organized project structure

### 3. Fastify (JavaScript)
High-performance Fastify server.
- Lightning-fast HTTP framework
- Schema-based validation ready
- Plugin architecture

### 4. Fastify + TypeScript
High-performance Fastify with TypeScript.
- Type-safe Fastify setup
- Full TypeScript integration
- Production-ready configuration

### 5. GraphQL (JavaScript)
GraphQL API with Apollo Server.
- Apollo Server configured
- Schema and resolvers setup
- GraphQL Playground enabled

### 6. GraphQL + TypeScript
GraphQL API with Apollo Server and TypeScript.
- Type-safe GraphQL development
- Apollo Server with TypeScript
- Codegen-ready structure

### 7. Socket.io (JavaScript)
Real-time application with Socket.io.
- WebSocket support
- Event handling structure
- CORS configured

### 8. Socket.io + TypeScript
Real-time application with Socket.io and TypeScript.
- Type-safe Socket.io
- Event type definitions
- Real-time TypeScript development

## 🎯 Usage

### Interactive Mode (Recommended)

Simply run the command and answer the prompts:

```bash
npx create-node-kit my-project
```

You'll be guided through:
1. **Project Name** - Enter your project name
2. **Template Selection** - Choose from 8 available templates
3. **Package Manager** - Pick npm, yarn, or pnpm
4. **Git Initialization** - Initialize a git repository
5. **ESLint & Prettier** - Setup code quality tools
6. **Zod Validation** - Add schema validation
7. **Environment Setup** - Create .env with defaults

### CLI Mode

Skip the prompts with command-line flags:

```bash
npx create-node-kit my-project \
  --template express \
  --package-manager npm \
  --no-git \
  --no-install
```

### Available Options

```
-V, --version                  Output the version number
-t, --template <template>      Template to use (basic/express/fastify/fastifyts/graphql/graphqlts/socketio/socketiots)
-p, --package-manager <pm>     Package manager (npm/yarn/pnpm)
--no-git                       Skip git initialization
--no-install                   Skip dependency installation
-h, --help                     Display help
```

### Examples

**Create Express TypeScript project with npm:**
```bash
npx create-node-kit my-api --template express --package-manager npm
```

**Create Fastify project without git:**
```bash
npx create-node-kit fast-api --template fastifyts --no-git
```

**Create GraphQL project with pnpm:**
```bash
npx create-node-kit graphql-api --template graphqlts --package-manager pnpm
```

## 🛠️ What's Included

Every project created includes:

### Core Setup
- ✅ **Package Manager** - Configured package.json
- ✅ **Environment Variables** - .env file with sensible defaults
- ✅ **Git Ready** - .gitignore and initial commit
- ✅ **Documentation** - Auto-generated README.md

### Optional Features
- 🎨 **ESLint** - Code linting with recommended rules
- 💅 **Prettier** - Code formatting
- 🛡️ **Zod Validation** - Schema validation with middleware
  - Pre-built validation middleware
  - Example schemas
  - TypeScript type inference

### Zod Integration

When you enable Zod validation, you get:

**Example Schema** (`src/schemas/userSchema.js/ts`):
```typescript
import { z } from 'zod';

export const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  age: z.number().int().positive().optional(),
});
```

**Validation Middleware** (`src/middlewares/zodValidation.js/ts`):
```typescript
import { validateSchema } from './middlewares/zodValidation';
import { createUserSchema } from './schemas/userSchema';

app.post('/users', validateSchema(createUserSchema), createUser);
```

## 📁 Project Structure

```
my-project/
├── src/
│   ├── index.js              # Application entry point
│   ├── routes/               # API routes
│   ├── controllers/          # Route controllers
│   ├── middlewares/          # Custom middlewares
│   │   └── zodValidation.js  # Zod validation middleware (optional)
│   └── schemas/              # Zod schemas (optional)
│       └── userSchema.js     # Example user schema
├── .env                      # Environment variables
├── .gitignore               # Git ignore rules
├── .eslintrc.json           # ESLint configuration (optional)
├── .prettierrc.json         # Prettier configuration (optional)
├── package.json             # Project dependencies
└── README.md                # Project documentation
```

## 🔧 After Installation

Once your project is created, navigate to it and start developing:

```bash
cd my-project

# Start development server with hot reload
npm run dev

# Run in production mode
npm start

# Lint your code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code with Prettier
npm run format
```

## 🌍 Environment Variables

Each project comes with a `.env` file configured with common variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database (uncomment and configure as needed)
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=myapp

# JWT Secret (generate a secure random string)
# JWT_SECRET=your-super-secret-jwt-key
```

**Template-Specific Variables:**
- **GraphQL** - `GRAPHQL_PLAYGROUND=true`
- **Socket.io** - `CORS_ORIGIN=http://localhost:3000`

## 📋 Requirements

- **Node.js** >= 14.0.0
- **npm** >= 6.0.0 (or yarn >= 1.22.0, or pnpm >= 6.0.0)

## 🎨 Technologies Used

create-node-kit is built with:
- [Commander.js](https://github.com/tj/commander.js) - CLI framework
- [Inquirer.js](https://github.com/SBoudrias/Inquirer.js) - Interactive prompts
- [Chalk](https://github.com/chalk/chalk) - Terminal styling
- [Ora](https://github.com/sindresorhus/ora) - Elegant spinners
- [fs-extra](https://github.com/jprichardson/node-fs-extra) - File operations

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure:
- Code follows existing style conventions
- All tests pass
- Documentation is updated

## 🐛 Issues

Found a bug or have a feature request? [Open an issue](https://github.com/maheshdrago/create-node-kit/issues)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Inspired by popular scaffolding tools:
- [create-react-app](https://github.com/facebook/create-react-app)
- [create-vite](https://github.com/vitejs/vite/tree/main/packages/create-vite)
- [create-next-app](https://github.com/vercel/next.js/tree/canary/packages/create-next-app)

## 📮 Support

- 🐛 **Issues**: [GitHub Issues](https://github.com/maheshdrago/create-node-kit/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/maheshdrago/create-node-kit/discussions)
- 📧 **Email**: [maheshdrago@gmail.com](mailto:maheshdrago@gmail.com)

## 🗺️ Roadmap

- [ ] Add REST API template with Prisma
- [ ] Add NestJS template
- [ ] Add testing setup (Jest/Vitest)
- [ ] Add Docker configuration option
- [ ] Add CI/CD templates (GitHub Actions, GitLab CI)
- [ ] Add database migration templates
- [ ] Add authentication boilerplates (JWT, OAuth)
- [ ] Add monitoring and logging setup

---

**Made with ❤️ by [Mahesh](https://github.com/maheshdrago)**

If this tool helped you, please give it a ⭐️ on [GitHub](https://github.com/maheshdrago/create-node-kit)!

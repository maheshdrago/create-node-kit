#!/usr/bin/env node

import { program } from "commander";
import inquirer from "inquirer";
import chalk from "chalk";
import figlet from "figlet";
import ora from "ora";
import { execSync } from "child_process";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Banner
console.log(
  chalk.cyan(
    figlet.textSync("Create Node Kit", {
      font: "Standard",
      horizontalLayout: "default",
    })
  )
);
console.log(chalk.gray("🚀 A powerful Node.js project scaffolding tool\n"));

// Template configurations
const TEMPLATES = {
  basic: {
    name: "Basic Node.js + Express",
    description: "Minimal Express server setup",
    folder: "node-app",
    supportsTypeScript: false,
  },
  express: {
    name: "Express + TypeScript",
    description: "TypeScript with Express and type definitions",
    folder: "express-ts-app",
    supportsTypeScript: true,
  },
  fastify: {
    name: "Fastify (JavaScript)",
    description: "High-performance Fastify server",
    folder: "fastify-app",
    supportsTypeScript: false,
  },
  fastifyts: {
    name: "Fastify + TypeScript",
    description: "High-performance Fastify with TypeScript",
    folder: "fastify-ts-app",
    supportsTypeScript: true,
  },
  graphql: {
    name: "GraphQL (JavaScript)",
    description: "GraphQL API with Apollo Server",
    folder: "graphql-app",
    supportsTypeScript: false,
  },
  graphqlts: {
    name: "GraphQL + TypeScript",
    description: "GraphQL API with Apollo Server and TypeScript",
    folder: "graphql-ts-app",
    supportsTypeScript: true,
  },
  socketio: {
    name: "Socket.io (JavaScript)",
    description: "Real-time application with Socket.io",
    folder: "socketio-app",
    supportsTypeScript: false,
  },
  socketiots: {
    name: "Socket.io + TypeScript",
    description: "Real-time application with Socket.io and TypeScript",
    folder: "socketio-ts-app",
    supportsTypeScript: true,
  },
};

program
  .version("1.0.0")
  .argument("[project-name]", "Name of the project")
  .option(
    "-t, --template <template>",
    "Template to use (basic/express/fastify/fastifyts/graphql/graphqlts/socketio/socketiots)"
  )
  .option("-p, --package-manager <pm>", "Package manager (npm/yarn/pnpm)")
  .option("--no-git", "Skip git initialization")
  .option("--no-install", "Skip dependency installation")
  .action(async (projectName, options) => {
    try {
      // Collect project info
      const answers = await collectProjectInfo(projectName, options);

      // Create project
      await createProject(answers);

      // Success message
      displaySuccessMessage(answers);
    } catch (error) {
      console.error(chalk.red("\nError:"), error.message);
      process.exit(1);
    }
  });

async function collectProjectInfo(projectName, options) {
  const questions = [];

  // Project name
  if (!projectName) {
    questions.push({
      type: "input",
      name: "projectName",
      message: "What is your project name?",
      default: "my-node-app",
      validate: (input) => {
        if (/^([A-Za-z\-\_\d])+$/.test(input)) return true;
        return "Project name may only include letters, numbers, underscores and hashes.";
      },
    });
  }

  // Template selection
  if (!options.template) {
    questions.push({
      type: "list",
      name: "template",
      message: "Select a template:",
      choices: Object.keys(TEMPLATES).map((key) => ({
        name: `${TEMPLATES[key].name} - ${chalk.gray(
          TEMPLATES[key].description
        )}`,
        value: key,
      })),
    });
  }

  // Package manager
  if (!options.packageManager) {
    questions.push({
      type: "list",
      name: "packageManager",
      message: "Choose a package manager:",
      choices: [
        { name: "npm", value: "npm" },
        { name: "yarn", value: "yarn" },
        { name: "pnpm", value: "pnpm" },
      ],
      default: "npm",
    });
  }

  // Git initialization
  if (options.git !== false) {
    questions.push({
      type: "confirm",
      name: "git",
      message: "Initialize a git repository?",
      default: true,
    });
  }

  // ESLint & Prettier
  questions.push({
    type: "confirm",
    name: "linting",
    message: "Setup ESLint and Prettier?",
    default: true,
  });

  // Zod validation
  questions.push({
    type: "confirm",
    name: "zodValidation",
    message: "Add Zod for schema validation?",
    default: true,
  });

  // Environment variables
  questions.push({
    type: "confirm",
    name: "envSetup",
    message: "Create .env file with defaults?",
    default: true,
  });

  const answers = await inquirer.prompt(questions);

  return {
    projectName: projectName || answers.projectName,
    template: options.template || answers.template,
    packageManager: options.packageManager || answers.packageManager,
    git: options.git !== false && answers.git !== false,
    install: options.install !== false,
    linting: answers.linting,
    zodValidation: answers.zodValidation,
    envSetup: answers.envSetup,
  };
}

async function createProject(config) {
  const {
    projectName,
    template,
    packageManager,
    git,
    install,
    linting,
    zodValidation,
    envSetup,
  } = config;
  const projectPath = path.join(process.cwd(), projectName);

  // Check if directory exists
  if (fs.existsSync(projectPath)) {
    throw new Error(`Directory ${projectName} already exists!`);
  }

  //Copy template
  const spinner = ora("Creating project structure...").start();
  const templatePath = path.resolve(
    __dirname,
    "../templates",
    TEMPLATES[template].folder
  );

  await fs.copy(templatePath, projectPath);
  spinner.succeed("Project structure created!");

  //Update package.json
  spinner.start("Configuring package.json...");
  const packageJsonPath = path.join(projectPath, "package.json");
  const packageJson = await fs.readJson(packageJsonPath);
  packageJson.name = projectName;
  await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
  spinner.succeed("package.json configured!");

  //Create .env file
  if (envSetup) {
    spinner.start("Creating .env file...");
    const envContent = generateEnvContent(template);
    await fs.writeFile(path.join(projectPath, ".env"), envContent);
    spinner.succeed(".env file created!");
  }

  //Setup linting
  if (linting) {
    spinner.start("Setting up ESLint and Prettier...");
    await setupLinting(projectPath, template);
    spinner.succeed("ESLint and Prettier configured!");
  }

  //Setup Zod validation
  if (zodValidation) {
    spinner.start("Adding Zod validation...");
    await setupZodValidation(projectPath, template);
    spinner.succeed("Zod validation added!");
  }

  // Create README
  spinner.start("Generating README.md...");
  const readmeContent = generateReadme(config);
  await fs.writeFile(path.join(projectPath, "README.md"), readmeContent);
  spinner.succeed("README.md created!");

  // Git initialization
  if (git) {
    spinner.start("Initializing git repository...");
    try {
      execSync("git init", { cwd: projectPath, stdio: "ignore" });

      // Create .gitignore
      const gitignoreContent = generateGitignore();
      await fs.writeFile(
        path.join(projectPath, ".gitignore"),
        gitignoreContent
      );

      execSync("git add .", { cwd: projectPath, stdio: "ignore" });
      execSync('git commit -m "Initial commit from create-node-kit"', {
        cwd: projectPath,
        stdio: "ignore",
      });
      spinner.succeed("Git repository initialized!");
    } catch (error) {
      spinner.warn("Git initialization skipped");
    }
  }

  // Step 8: Install dependencies
  if (install) {
    spinner.start(`Installing dependencies with ${packageManager}...`);
    try {
      const installCmd =
        packageManager === "yarn" ? "yarn" : `${packageManager} install`;
      execSync(installCmd, { cwd: projectPath, stdio: "inherit" });
      spinner.succeed("Dependencies installed!");
    } catch (error) {
      spinner.fail("Failed to install dependencies");
      console.log(
        chalk.yellow("\n⚠️  You can install them manually by running:")
      );
      console.log(chalk.cyan(`  cd ${projectName}`));
      console.log(chalk.cyan(`  ${packageManager} install\n`));
    }
  }
}

function generateEnvContent(template) {
  const commonEnv = `# Server Configuration
PORT=3000
NODE_ENV=development

# Database (uncomment and configure as needed)
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=myapp
# DB_USER=
# DB_PASSWORD=

# JWT Secret (generate a secure random string)
# JWT_SECRET=your-super-secret-jwt-key

# API Keys
# API_KEY=
`;

  if (template === "graphql") {
    return commonEnv + `\n# GraphQL Specific\nGRAPHQL_PLAYGROUND=true\n`;
  }

  if (template === "graphqlts") {
    return commonEnv + `\n# GraphQL Specific\nGRAPHQL_PLAYGROUND=true\n`;
  }

  if (template === "socketio" || template === "socketiots") {
    return (
      commonEnv +
      `\n# Socket.io Configuration\nCORS_ORIGIN=http://localhost:3000\n`
    );
  }

  return commonEnv;
}

function generateGitignore() {
  return `# Dependencies
node_modules/
.pnpm-store/

# Environment variables
.env
.env.local
.env.*.local

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# Build output
dist/
build/
*.tsbuildinfo

# Testing
coverage/
.nyc_output/

# Misc
.cache/
.temp/
`;
}

async function setupLinting(projectPath, template) {
  const isTypeScript =
    template === "express" ||
    template === "fastifyts" ||
    template === "graphqlts" ||
    template === "socketiots";

  // ESLint config
  const eslintConfig = {
    env: {
      node: true,
      es2021: true,
    },
    extends: ["eslint:recommended"],
    parserOptions: {
      ecmaVersion: 12,
      sourceType: "module",
    },
    rules: {
      "no-console": "off",
      "no-unused-vars": "warn",
    },
  };

  if (isTypeScript) {
    eslintConfig.extends.push("plugin:@typescript-eslint/recommended");
    eslintConfig.parser = "@typescript-eslint/parser";
    eslintConfig.plugins = ["@typescript-eslint"];
  }

  await fs.writeJson(path.join(projectPath, ".eslintrc.json"), eslintConfig, {
    spaces: 2,
  });

  // Prettier config
  const prettierConfig = {
    semi: true,
    trailingComma: "es5",
    singleQuote: true,
    printWidth: 100,
    tabWidth: 2,
  };

  await fs.writeJson(
    path.join(projectPath, ".prettierrc.json"),
    prettierConfig,
    { spaces: 2 }
  );

  // Add scripts to package.json
  const packageJsonPath = path.join(projectPath, "package.json");
  const packageJson = await fs.readJson(packageJsonPath);
  packageJson.scripts = {
    ...packageJson.scripts,
    lint: "eslint .",
    "lint:fix": "eslint . --fix",
    format: 'prettier --write "**/*.{js,json,md}"',
  };

  // Add devDependencies
  packageJson.devDependencies = {
    ...packageJson.devDependencies,
    eslint: "^8.50.0",
    prettier: "^3.0.3",
  };

  if (isTypeScript) {
    packageJson.devDependencies["@typescript-eslint/eslint-plugin"] = "^6.7.0";
    packageJson.devDependencies["@typescript-eslint/parser"] = "^6.7.0";
  }

  await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
}

async function setupZodValidation(projectPath, template) {
  const isTypeScript =
    template === "express" ||
    template === "fastifyts" ||
    template === "graphqlts" ||
    template === "socketiots";

  // Add Zod to package.json
  const packageJsonPath = path.join(projectPath, "package.json");
  const packageJson = await fs.readJson(packageJsonPath);

  packageJson.dependencies = {
    ...packageJson.dependencies,
    zod: "^3.22.4",
  };

  await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });

  // Create validation schemas directory
  const schemasDir = path.join(projectPath, "src", "schemas");
  await fs.ensureDir(schemasDir);

  // Create example schema file
  const schemaContent = isTypeScript
    ? `import { z } from 'zod';

export const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  age: z.number().int().positive().optional(),
});

export const createUserSchema = z.object({
  body: userSchema,
});

export const updateUserSchema = z.object({
  body: userSchema.partial(),
  params: z.object({
    id: z.string(),
  }),
});

export type User = z.infer<typeof userSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
`
    : `import { z } from 'zod';

export const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  age: z.number().int().positive().optional(),
});

export const createUserSchema = z.object({
  body: userSchema,
});

export const updateUserSchema = z.object({
  body: userSchema.partial(),
  params: z.object({
    id: z.string(),
  }),
});
`;

  const schemaFile = isTypeScript ? "userSchema.ts" : "userSchema.js";
  await fs.writeFile(path.join(schemasDir, schemaFile), schemaContent);

  // Create Zod validation middleware
  const middlewareContent = isTypeScript
    ? `import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export const validateSchema = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.errors.map(err => ({
            path: err.path.join('.'),
            message: err.message,
          })),
        });
      } else {
        next(error);
      }
    }
  };
};
`
    : `import { ZodError } from 'zod';

export const validateSchema = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.errors.map(err => ({
            path: err.path.join('.'),
            message: err.message,
          })),
        });
      } else {
        next(error);
      }
    }
  };
};
`;

  const middlewareFile = isTypeScript ? "zodValidation.ts" : "zodValidation.js";
  const middlewaresDir = path.join(projectPath, "src", "middlewares");
  await fs.ensureDir(middlewaresDir);
  await fs.writeFile(
    path.join(middlewaresDir, middlewareFile),
    middlewareContent
  );
}

function generateReadme(config) {
  const { projectName, template, packageManager } = config;
  const templateInfo = TEMPLATES[template];

  return `# ${projectName}

${templateInfo.description}

## 🚀 Getting Started

### Installation

\`\`\`bash
${packageManager} install
\`\`\`

### Development

\`\`\`bash
${packageManager} run dev
\`\`\`

### Production

\`\`\`bash
${packageManager} start
\`\`\`

## 📁 Project Structure

\`\`\`
${projectName}/
├── src/
│   ├── index.js          # Entry point
│   ├── routes/           # API routes
│   ├── controllers/      # Route controllers
│   └── middlewares/      # Express middlewares
├── .env                  # Environment variables
├── .gitignore
├── package.json
└── README.md
\`\`\`

## 🛠️ Available Scripts

- \`${packageManager} run dev\` - Start development server with hot reload
- \`${packageManager} start\` - Start production server
- \`${packageManager} run lint\` - Run ESLint
- \`${packageManager} run lint:fix\` - Fix ESLint errors
- \`${packageManager} run format\` - Format code with Prettier

## 📝 Environment Variables

Copy \`.env.example\` to \`.env\` and configure:

- \`PORT\` - Server port (default: 3000)
- \`NODE_ENV\` - Environment (development/production)

## 📚 Learn More

- [Express Documentation](https://expressjs.com/)
- [Node.js Documentation](https://nodejs.org/)

## 📄 License

MIT

---

Created with ❤️ using [create-node-kit](https://github.com/maheshdrago/create-node-kit)
`;
}

function displaySuccessMessage(config) {
  const { projectName, packageManager } = config;

  console.log(
    "\n" +
      chalk.green("Success!") +
      " Created " +
      chalk.cyan(projectName) +
      "\n"
  );
  console.log("Inside that directory, you can run several commands:\n");

  console.log(chalk.cyan(`  ${packageManager} run dev`));
  console.log("    Starts the development server.\n");

  console.log(chalk.cyan(`  ${packageManager} start`));
  console.log("    Runs the app in production mode.\n");

  console.log(chalk.cyan(`  ${packageManager} run lint`));
  console.log("    Checks code quality with ESLint.\n");

  console.log("We suggest that you begin by typing:\n");
  console.log(chalk.cyan(`  cd ${projectName}`));
  console.log(chalk.cyan(`  ${packageManager} run dev`));
  console.log("\n" + chalk.yellow("Happy coding!") + "\n");
}

program.parse(process.argv);

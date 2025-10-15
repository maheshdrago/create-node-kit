#!/usr/bin/env node

import { fileURLToPath } from "url";
import path from "path";
import chalk from "chalk";
import inquirer from "inquirer";
import fs from "fs-extra";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getTargetPath(projectName) {
  let count = 1;
  let __projectPath = path.join(process.cwd(), projectName);
  let newProjectName = "";
  while (fs.existsSync(__projectPath)) {
    newProjectName = `${projectName}-${count}`;
    __projectPath = path.join(process.cwd(), newProjectName);
    count += 1;
  }

  return __projectPath;
}

async function main() {
  const { projectNameInput, language } = await inquirer.prompt([
    {
      name: "projectNameInput",
      message: "Project name (leave empty to use current folder) :",
    },
    {
      name: "language",
      type: "list",
      message: "Select language",
      choices: ["Typescript", "Javascript"],
      default: "Typescript",
    },
  ]);

  let projectName = projectNameInput || path.basename(process.cwd());
  let targetPath = getTargetPath(projectName);

  const templateDir = path.join(__dirname, "../templates/node-app");

  await fs.copy(templateDir, targetPath);

  const envExamplePath = path.join(targetPath, ".env.example");
  const envPath = path.join(targetPath, ".env");
  if (fs.existsSync(envExamplePath)) {
    await fs.rename(envExamplePath, envPath);
  }

  const pkgPath = path.join(targetPath, "package.json");
  const pkg = JSON.parse(await fs.readFile(pkgPath, "utf8"));
  pkg.name = path.basename(targetPath);
  await fs.writeFile(pkgPath, JSON.stringify(pkg, null, 2));

  console.log(
    chalk.blue(`\nCreated ${language} project in ${path.basename(targetPath)}/`)
  );
  console.log(chalk.blue("\nInstalling dependencies..."));
  execSync("npm install", { cwd: targetPath, stdio: "inherit" });

  console.log(chalk.green.bold("\nAll done!"));
  console.log(chalk.cyan(`\nNext steps:`));
  console.log(`  cd ${projectName}`);
  console.log("  npm run dev\n");
}

main().catch((err) => console.error(err));

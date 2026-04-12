import { fileURLToPath } from 'node:url';
import { dirname, join, resolve, basename } from 'node:path';
import {
  mkdirSync,
  cpSync,
  readFileSync,
  writeFileSync,
  existsSync,
  readdirSync,
} from 'node:fs';
import { execSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BOLD = '\x1b[1m';
const CYAN = '\x1b[36m';
const GREEN = '\x1b[32m';
const DIM = '\x1b[2m';
const RESET = '\x1b[0m';

function log(msg: string) {
  process.stdout.write(msg + '\n');
}

function isValidPackageName(name: string): boolean {
  return /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(name);
}

function toValidPackageName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/^[._]/, '')
    .replace(/[^a-z0-9-~._]/g, '-');
}

function copyTemplate(src: string, dest: string) {
  const entries = readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destName = entry.name === '_gitignore' ? '.gitignore' : entry.name;
    const destPath = join(dest, destName);
    if (entry.isDirectory()) {
      mkdirSync(destPath, { recursive: true });
      copyTemplate(srcPath, destPath);
    } else {
      cpSync(srcPath, destPath);
    }
  }
}

function main() {
  const args = process.argv.slice(2);

  // Print usage if --help
  if (args.includes('--help') || args.includes('-h')) {
    log('');
    log(`${BOLD}Usage:${RESET}  create-akds-app <project-name>`);
    log('');
    log(`${DIM}Scaffolds a new TypeScript + React + Vite project with the akds design system.${RESET}`);
    log('');
    process.exit(0);
  }

  let projectName = args[0]?.trim();

  if (!projectName) {
    log(`${BOLD}Usage:${RESET}  create-akds-app <project-name>`);
    log('');
    log('Please provide a project name.');
    process.exit(1);
  }

  const packageName = toValidPackageName(projectName);

  if (!isValidPackageName(packageName)) {
    log(`"${projectName}" is not a valid project name.`);
    log(`Try: ${toValidPackageName(projectName)}`);
    process.exit(1);
  }

  const targetDir = resolve(process.cwd(), projectName);

  if (existsSync(targetDir)) {
    log(`Directory "${projectName}" already exists. Choose a different name or remove it first.`);
    process.exit(1);
  }

  log('');
  log(`${BOLD}create-akds-app${RESET} — scaffolding ${CYAN}${projectName}${RESET}...`);
  log('');

  // ── Copy template ──────────────────────────────────────────────────────────
  const templateDir = join(__dirname, '../template');

  if (!existsSync(templateDir)) {
    log(`Template directory not found at: ${templateDir}`);
    process.exit(1);
  }

  mkdirSync(targetDir, { recursive: true });
  copyTemplate(templateDir, targetDir);

  // ── Patch package.json ─────────────────────────────────────────────────────
  const pkgPath = join(targetDir, 'package.json');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8')) as Record<string, unknown>;
  pkg['name'] = packageName;
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');

  log(`  ${GREEN}✔${RESET} Template copied`);

  // ── npm install ────────────────────────────────────────────────────────────
  log(`  ${GREEN}✔${RESET} Project name set to ${CYAN}${packageName}${RESET}`);
  log('');
  log('  Installing dependencies...');
  log('');

  try {
    execSync('npm install', { cwd: targetDir, stdio: 'inherit' });
  } catch {
    log('');
    log('  npm install failed. Try running it manually inside the project directory.');
    log('  (You may need to configure npm auth for the @aknishi GitHub registry — see README.)');
  }

  // ── Done ───────────────────────────────────────────────────────────────────
  const rel = basename(targetDir);

  log('');
  log(`${GREEN}${BOLD}Done!${RESET} Your project is ready.`);
  log('');
  log('  Next steps:');
  log('');
  log(`    ${DIM}$${RESET}  ${CYAN}cd ${rel}${RESET}`);
  log(`    ${DIM}$${RESET}  ${CYAN}npm run dev${RESET}`);
  log('');
  log(`  ${DIM}Open http://localhost:5173 to see your app.${RESET}`);
  log('');
}

main();

import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = dirname(dirname(fileURLToPath(import.meta.url)));

export const CLI_ROOT = root;

export function templatesDir() {
  return join(root, 'templates');
}

export function templateDir(name) {
  return join(templatesDir(), name);
}

export function isTextFile(filePath) {
  return /\.(json|twig|js|scss|css|md|npmrc|gitignore|txt|php|svg|yml|yaml|toml)$/.test(filePath);
}

export function interpolate(content, vars) {
  return Object.entries(vars).reduce(
    (acc, [key, value]) => acc.split(`@@${key}@@`).join(String(value)),
    content
  );
}

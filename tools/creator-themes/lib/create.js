import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';
import { templateDir, isTextFile, interpolate } from './constants.js';
import { templateExists } from './templates.js';

const ARABIC_NAMES = {
  sufra: 'سُفرة',
  maza: 'مَزة',
  taghmesa: 'طغميسة',
};

function slugify(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function walk(dir, base = dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.name === '.git') return [];
    if (entry.isDirectory()) return walk(full, base);
    return [full];
  });
}

function parentOf(p) {
  return p.slice(0, p.lastIndexOf(sep)) || '.';
}

function writeTree(templateName, targetDir, vars) {
  const srcDir = templateDir(templateName);
  mkdirSync(targetDir, { recursive: true });

  for (const file of walk(srcDir)) {
    const rel = relative(srcDir, file);
    const dest = resolve(targetDir, rel);
    const contents = readFileSync(file);

    mkdirSync(parentOf(dest), { recursive: true });
    writeFileSync(dest, isTextFile(file) ? interpolate(contents.toString('utf8'), vars) : contents);
  }
}

export function createTheme({ name, template = 'sufra', dir = '.', force = false, author, authorEmail, category, version }) {
  if (!name) {
    throw new Error('missing theme name: creator-themes create <name>');
  }
  if (!templateExists(template)) {
    throw new Error(`unknown template "${template}". Run "creator-themes list" to see available templates.`);
  }

  const slug = slugify(name);
  const target = resolve(dir, slug);

  if (statSync(target, { throwIfNoEntry: false })) {
    const isEmpty = readdirSync(target).length === 0;
    if (!force && !isEmpty) {
      throw new Error(`"${target}" already exists and is not empty. Use --force to overwrite.`);
    }
  }

  const vars = {
    THEME_SLUG: slug,
    THEME_NAME_EN: name.trim(),
    THEME_NAME_AR: ARABIC_NAMES[slug] || name.trim(),
    THEME_AUTHOR: author || 'Creator Themes',
    THEME_AUTHOR_EMAIL: authorEmail || 'support@creator-themes.dev',
    THEME_CATEGORY: category || 'food',
    THEME_VERSION: version || '1.0.0',
  };

  writeTree(template, target, vars);
  return { slug, target, vars };
}

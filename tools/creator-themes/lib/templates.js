import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { templatesDir, interpolate } from './constants.js';

const ARABIC_DEFAULTS = { sufra: 'سُفرة' };

function displayName(name) {
  const raw = name.replace(/^./, (c) => c.toUpperCase());
  const ar = ARABIC_DEFAULTS[name] || raw;
  return { en: raw, ar };
}

export function listTemplates() {
  const dir = templatesDir();
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .filter((entry) => existsSync(join(dir, entry.name, 'twilight.json')))
    .map((entry) => {
      const fallback = displayName(entry.name);
      let meta = {};
      try {
        meta = JSON.parse(readFileSync(join(dir, entry.name, 'twilight.json'), 'utf8'));
      } catch {
        /* ignore malformed template meta */
      }
      const vars = {
        THEME_NAME_EN: fallback.en,
        THEME_NAME_AR: fallback.ar,
      };
      return {
        name: entry.name,
        title: meta.name?.en ? interpolate(meta.name.en, vars) : fallback.en,
        titleAr: meta.name?.ar ? interpolate(meta.name.ar, vars) : fallback.ar,
        description: meta.description?.en || 'No description',
      };
    });
}

export function templateExists(name) {
  return listTemplates().some((t) => t.name === name);
}

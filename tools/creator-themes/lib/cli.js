import { basename, resolve } from 'node:path';
import { createTheme } from './create.js';
import { listTemplates } from './templates.js';
import { CLI_ROOT } from './constants.js';

const HELP = `
creator-themes — scaffold Salla Twilight themes from creator templates

Usage:
  creator-themes create <name> [options]
  creator-themes list
  creator-themes help

Commands:
  create   Generate a new Salla Twilight theme from a template.
  list     List the installed theme templates.
  help     Show this help.

Options (create):
  --template <name>   Template to use (default: sufra)
  --dir <path>        Parent directory for the new theme (default: current directory)
  --author <name>     Theme author name
  --author-email <e>  Theme support email
  --category <cat>    Theme category (default: food)
  --version <ver>     Initial theme version (default: 1.0.0)
  --force             Overwrite the target directory if it is not empty

Examples:
  creator-themes create sufra
  creator-themes create sufra --dir ..
  creator-themes create maza --template sufra --author "Your Name" --author-email you@example.com
`;

function parseArgs(args) {
  const flags = {};
  const positionals = [];
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      const [key, ...rest] = arg.slice(2).split('=');
      const value = rest.length ? rest.join('=') : args[i + 1]?.startsWith('--') ? undefined : args[i + 1];
      flags[key] = value ?? true;
      if (value !== undefined && !arg.includes('=')) i += 1;
    } else {
      positionals.push(arg);
    }
  }
  return { positionals, flags };
}

function camel(flags, key) {
  return flags[key] !== undefined ? flags[key] : undefined;
}

function printList() {
  const templates = listTemplates();
  if (!templates.length) {
    console.log('No templates installed.');
    return;
  }
  console.log(`Installed templates (in ${CLI_ROOT}/templates):\n`);
  for (const t of templates) {
    console.log(`  ${t.name.padEnd(16)} ${t.title} (${t.titleAr})`);
  }
  console.log('\nCreate one with:  creator-themes create <name> --template <template>');
}

function printHelp() {
  console.log(HELP);
}

export function run(argv) {
  const [command, ...rest] = argv;
  const { positionals, flags } = parseArgs(rest);

  switch (command) {
    case 'create': {
      const name = positionals[0];
      try {
        const { slug, target } = createTheme({
          name,
          template: camel(flags, 'template') || 'sufra',
          dir: camel(flags, 'dir') ? resolve(camel(flags, 'dir')) : process.cwd(),
          force: Boolean(flags.force),
          author: camel(flags, 'author'),
          authorEmail: camel(flags, 'author-email'),
          category: camel(flags, 'category'),
          version: camel(flags, 'version'),
        });
        console.log(`\n  ✓ Created "${slug}" theme at: ${target}`);
        console.log(`
Next steps:
  cd ${target}
  pnpm install
  pnpm run watch          # build assets (also installs Salla Twilight watcher)
  salla theme preview     # live preview with a demo store

Then upload/publish it from the Salla Partners portal:
  https://portal.salla.partners/themes
`);
        return 0;
      } catch (error) {
        console.error(`\n  ✗ ${error.message}\n`);
        return 1;
      }
    }
    case 'list':
      printList();
      return 0;
    case 'help':
    case '--help':
    case '-h':
    case undefined:
      printHelp();
      return 0;
    default:
      console.error(`Unknown command: ${command}\n`);
      printHelp();
      return 1;
  }
}

# creator-themes

Scaffold [Salla Twilight](https://docs.salla.dev) themes from regional creator templates. Inspired by how creators build and sell themes on [Salla Partners](https://salla.partners/themes).

## Install

```bash
npm install -g ./tools/creator-themes
```

## Usage

```bash
# List available templates
creator-themes list

# Create the Sufra food theme in the current directory
creator-themes create sufra

# Create it one folder outside the current project
creator-themes create sufra --dir ..

# Customize
creator-themes create maza --template sufra --author "Your Name" --author-email you@example.com --category food
```

## What you get

Every template is a real, installable Twilight theme:

- `twilight.json` — theme settings + configurable home components
- `src/views/**` — Twig layouts, pages, and components
- `src/assets/**` — SCSS (Tailwind) and JS (webpack)
- `src/locales/{ar,en}.json` — bilingual strings
- Webpack + Twilight watcher for `salla theme preview`

## Adding a template

Drop a new folder under `templates/<name>/` containing at least a `twilight.json` and the `src/` tree. Use `@@THEME_SLUG@@`, `@@THEME_NAME_EN@@`, `@@THEME_NAME_AR@@`, `@@THEME_AUTHOR@@`, `@@THEME_AUTHOR_EMAIL@@`, `@@THEME_CATEGORY@@`, `@@THEME_VERSION@@` placeholders — they are filled in at `create` time.

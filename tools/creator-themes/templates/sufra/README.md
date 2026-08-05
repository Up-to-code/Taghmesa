# سُفرة / Sufra — Food Theme for Salla

A warm Arabic **food theme** for Salla stores (restaurants, cafés, bakeries, and food delivery). Built with the **Salla Twilight** theme engine, so it renders inside real Salla stores and is configurable from the Salla Partners portal.

```
+---src
    +---assets
    |   +---images      # theme images & placeholders
    |   +---js          # webpack-bundled modules
    |   +---styles      # SCSS (Tailwind + @apply)
    +---locales
    |       ar.json     # Arabic strings
    |       en.json     # English strings
    +---views
        +---components
        |   +---header  # header + delivery banner
        |   +---footer
        |   +---home    # 8 configurable home sections
        +---layouts
        |       master.twig
        +---pages       # product, cart, blog, customer, brands...
        +---partials
|   package.json
|   twilight.json       # theme settings + home components
|   tailwind.config.js
|   webpack.config.js
```

## Quick start

Prerequisites: Node.js 20+, pnpm, and [Salla CLI](https://www.npmjs.com/package/@salla.sa/cli).

```bash
pnpm install
pnpm run watch        # build assets (Twilight watcher)
salla theme preview   # live preview against a demo store
```

## Home sections (configurable in the Partners portal)

| Component       | Description                                        |
|-----------------|----------------------------------------------------|
| Hero slider     | Full-width food banners with autoplay              |
| Quick menu      | Circular shortcut links (grills, desserts, juices) |
| Featured dishes | `salla-products-slider` of the merchant's featured products |
| Today's menu    | Dish cards with photo, title and order link        |
| Special offer   | Full-width offer banner with CTA                   |
| About the chef  | Two-column story section                           |
| Testimonials    | Customer review cards                              |
| Store features  | Delivery, freshness, COD, quality guarantee        |

## Theme settings

Open **My Themes → Sufra → Settings** in the [Partners portal](https://portal.salla.partners) to toggle:

- Sticky header, dark top nav, delivery banner text
- Home section titles
- Product breadcrumbs, sticky add-to-cart, image fit
- Dark footer

## Publishing

1. Push this folder to a GitHub repository (it is synced with your partner account).
2. In the Partners portal, create/import a theme from that repository.
3. Set up a demo store, preview, then publish to the [themes marketplace](https://salla.partners/themes).

## License

MIT — based on [SallaApp/theme-raed](https://github.com/SallaApp/theme-raed).

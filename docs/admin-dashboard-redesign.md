# Admin dashboard redesign — route and parity plan

## Module boundaries

- `components/ui`: generated shadcn primitives only. No store or admin business logic.
- `domains/admin/components/ui`: admin-composed page headers, image uploader, status presentation, and dialogs.
- `domains/admin/components/categories`: category index, create dialog, and category detail editor.
- `domains/admin/components/products`: product grid, filters, and editor dialog.
- `domains/admin/components/orders`: status tabs, cards, and order detail presentation.
- `domains/admin/hooks`: all request orchestration, feedback, pending state, and redirects.
- `app/admin/**/page.tsx`: server-side authorization/data loading and component composition only.

## Passes

### Pass 1: shadcn foundation
Current behavior: admin chrome and controls are hand-written against a large global CSS block.
Structural improvement: generated shadcn primitives provide consistent buttons, dialogs, cards, fields, tabs, sheets, and badges while admin-specific compositions stay in the admin domain.
Validation check: component registry remains valid; lint, typecheck, and production build pass.

### Pass 2: category routes
Current behavior: all categories, edits, images, subcategories, and creation share one expandable page.
Structural improvement: `/admin/categories` becomes a scannable list with a creation dialog; successful creation redirects to `/admin/categories/[id]`, where image and subcategory management live.
Validation check: create redirects to the new ID; edits, uploads, subcategory operations, and deletion constraints retain their API behavior.

### Pass 3: product grid
Current behavior: products are stacked expandable rows with an add form at the end.
Structural improvement: products become searchable/filterable cards; create and edit use one category-aware dialog while preserving image, size, state, and deletion operations.
Validation check: product CRUD and category/subcategory validation continue to pass.

The product content tab uses Tiptap StarterKit for persisted rich text. Storefront rendering is allowlist-sanitized, and compact cards derive a plain-text preview so HTML never leaks into summaries.

### Pass 4: order workflow
Current behavior: orders are expandable rows with a status select.
Structural improvement: status tabs provide an operational queue and order cards expose customer, totals, items, and transitions with a consistent blue active treatment.
Validation check: each status filter is correct and status mutation updates the visible card without a manual refresh.

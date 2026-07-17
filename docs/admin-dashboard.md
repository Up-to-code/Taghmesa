# Admin dashboard architecture

The admin area is split into real routes for overview, catalog hierarchy, products, and orders. Every page calls the shared server-side role guard; unauthorized requests terminate through Next.js' 401 boundary. The Hono write API repeats the same role check so hiding UI is never the security boundary.

Catalog hierarchy is normalized into `categories` and `subcategories`. Products reference both by ID while the existing `products.category` text remains during the migration, keeping current storefront URLs and filters compatible. Admin reads are grouped in `domains/admin/repository.ts`; interactive views and their request logic stay inside `domains/admin`.

Parity checks:

- anonymous and non-admin requests to protected pages return HTTP 401 and render the branded 401 screen;
- admin API reads and writes return 401 unless the session role is `admin`;
- existing products and orders remain visible and editable;
- category create/edit/image/subcategory flows update the relational hierarchy;
- overview totals and seven-day chart values come from database queries;
- desktop and mobile admin navigation expose the same real routes.

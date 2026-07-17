# Customer account architecture

## Module boundaries

- `lib/db/schema.ts` owns the durable profile and order-to-user relationship.
- `domains/account/repository.ts` is the only read path that assembles a customer's profile and orders.
- `lib/api/app.ts` owns authenticated profile writes and derives customer identity from the Better Auth session.
- `domains/account/components/` provides the shared food-art account shell, route tabs, order panels, and interactive profile/logout controls.
- `app/(store)/account/` uses real `orders`, `history`, and `profile` route segments under one authenticated layout; the index route redirects to current orders.
- Checkout may create anonymous orders, but attaches `user_id` only from the server session and updates that user's delivery profile in the same transaction.

## Passes and parity checks

### Pass 1: Durable customer ownership

Current behavior: orders contain delivery details but no authenticated owner; no profile record exists.

Structural improvement: add `customer_profiles` keyed by Better Auth user ID and nullable server-assigned `orders.user_id`.

Validation check: migrations apply to an existing database without changing anonymous orders; foreign keys and indexes exist.

### Pass 2: Authenticated reads and writes

Current behavior: only admin APIs require a session; customer data has no endpoint.

Structural improvement: add a customer repository and same-origin authenticated profile endpoint. Never accept a user ID from the client.

Legacy guest orders can be claimed only by an authenticated customer who supplies both the order number and the exact checkout phone number; an order that already has an owner cannot be reassigned.

Validation check: signed-out requests receive 401 and one user cannot query or update another user's profile or orders.

### Pass 3: Account experience

Current behavior: signing in redirects home and the header remains a generic sign-in link.

Structural improvement: add a server-rendered account dashboard with active/history order sections, profile completion, and session-aware desktop/mobile navigation.

Validation check: signed-out `/account` redirects to login; signed-in navigation opens the dashboard; empty and populated order states render.

### Pass 4: Checkout integration

Current behavior: checkout always starts blank and all orders are anonymous.

Structural improvement: prefill authenticated delivery details and attach new orders to the server session while keeping guest checkout intact.

Validation check: guest checkout still works; authenticated checkout appears in only that customer's dashboard.

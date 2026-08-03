# Cart parity

| criterion | nuxt_implementation | next_implementation | equivalent | evidence | notes |
| --- | --- | --- | --- | --- | --- |
| Route | `app/pages/cart.vue` | `app/cart/page.tsx` | Yes | `/cart` | Same empty, restore, item, and summary states. |
| State | Pinia `app/stores/cart.ts` | Context + `useReducer` in `CartProvider.tsx` | Yes | `CartItem` fields and actions | Both retain insertion order. |
| Persistence | Client-only store hydration | Client-only `useEffect` hydration | Yes | key `ecommerce-demo-cart` | Invalid JSON/schema becomes an empty cart. |
| Hydration | `hydrated` starts false and `onMounted` restores | `hydrated` starts false and effect restores | Yes | Header/cart restore copy | The count is not server-rendered as zero. |
| Product entry points | Product card and detail page | Product card and detail page | Yes | “Thêm vào giỏ” | Repeated adds increase quantity by one. |
| Item actions | `CartItem.vue` | `CartItem.tsx` | Yes | Increase, decrease, remove controls | Decrease has a minimum quantity of one. |
| Money | `formatVnd` | `Intl.NumberFormat('vi-VN')` | Yes | `maximumFractionDigits: 0` | Total is price × quantity. |
| Tests | `nuxt-app/tests/cart/cart.test.ts` | `next-app/tests/cart/cart.test.ts` | Yes | `shared-data/cart-test-fixture.json` | Same fixture, prices, action sequence, and expected total. |

# Structure audit

Audit date: 2026-08-03. Scope was limited to structure normalization and verification; no product, API, filter, or cart feature was added.

## Structure before normalization

```text
nuxt-app/
├── app/
│   ├── assets/css/main.css
│   ├── components/             # empty placeholder
│   ├── composables/            # empty placeholder
│   ├── layouts/default.vue
│   ├── middleware/             # empty placeholder
│   ├── pages/index.vue
│   ├── app.vue
│   └── error.vue
├── public/                     # empty placeholder
├── server/api/                 # empty placeholder
├── server/utils/               # empty placeholder
└── shared/                     # empty placeholder

next-app/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── loading.tsx
│   ├── error.tsx
│   ├── not-found.tsx
│   ├── products/page.tsx
│   └── product/[slug]/page.tsx
└── configuration files
```

No Nuxt 3-style source directories (`pages`, `components`, `composables`, `layouts`, `middleware`, `plugins`, `stores`, or `utils`) existed at the root of `nuxt-app`. No Next.js Pages Router directory existed.

## Structure after normalization

```text
nuxt-app/
├── app/
│   ├── assets/css/main.css
│   ├── layouts/default.vue
│   ├── pages/index.vue
│   ├── app.vue
│   └── error.vue
├── public/
├── server/
│   ├── api/
│   └── utils/
├── shared/
├── nuxt.config.ts
├── package.json
├── package-lock.json
└── tsconfig.json

next-app/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── loading.tsx
│   ├── error.tsx
│   ├── not-found.tsx
│   ├── products/page.tsx
│   └── product/[slug]/page.tsx
├── next.config.ts
├── package.json
├── package-lock.json
└── tsconfig.json
```

`app/stores` was not created because the initialization does not contain a Pinia store. The default `@pinia/nuxt` configuration is therefore retained. The root `public`, `server`, and `shared` directories remain in place; their empty placeholders are retained only to preserve the initialized root structure.

## Changes

- Removed unused empty Nuxt application directories: `app/components`, `app/composables`, and `app/middleware`.
- Updated `next-app/app/layout.tsx` from `lang="en"` to `lang="vi"`.
- Added `.env` to the Nuxt ignore rules; added `.env` and `.env.local` to the Next.js ignore rules.
- Files moved: none.
- Imports updated: none; no source directory was moved and no existing import referenced a removed placeholder directory.

## Configuration and version verification

- `nuxt-app`: Nuxt `4.5.1`, Vue `3.5.40`, TypeScript `5.9.3`, Node.js `22.23.2`, npm `10.9.8`.
- `next-app`: Next.js `16.2.12`, React `19.2.8`, TypeScript `5.9.3`, Node.js `22.23.2`, npm `10.9.8`.
- Both `package-lock.json` files exist. Framework versions are exact and have no `^` or `~` prefix.
- Nuxt has `@pinia/nuxt`, no `srcDir`, and no experimental, Rspack, component-islands, or SSR-streaming configuration.
- Next.js uses root `app/`, has no `pages/` or `pages/api/`, and has no experimental, Cache Components, React Compiler, or canary configuration. `app/page.tsx` remains a Server Component.

## Verification results

| Application | Commands | Result |
| --- | --- | --- |
| Nuxt | `npm install`, `npm run typecheck`, `npm run lint`, `npm run build` | Passed |
| Next.js | `npm install`, `npm run lint`, `npm run build` | Passed; build used Turbopack |

## Remaining issues

- `npm install` in `next-app` reports three high-severity dependency audit findings. No automated audit fix was applied because changing locked dependency versions is outside this task.
- The Nuxt build emits upstream plugin-timing and Node deprecation warnings; the production build completes successfully.

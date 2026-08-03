# Environment versions

Locked on 2026-08-03. Both applications use the same local Node.js distribution and npm version.

| Tool or package | Version |
| --- | --- |
| Node.js | 22.23.2 |
| npm | 10.9.8 |
| Nuxt | 4.5.1 |
| Vue | 3.5.40 |
| Pinia | 4.0.2 |
| `@pinia/nuxt` | 1.0.1 |
| Next.js | 16.2.12 |
| React | 19.2.8 |
| React DOM | 19.2.8 |
| TypeScript | 5.9.3 |
| Tailwind CSS | 4.3.3 |

Node.js is pinned in both [`.nvmrc`](../.nvmrc) and [`.node-version`](../.node-version). Each application declares `node >=22 <23` and npm `10.9.8` in its `package.json`.

## `npm ls` results

Commands were run with Node.js 22.23.2 and npm 10.9.8.

```text
# nuxt-app
npm ls nuxt vue typescript tailwindcss --depth=1
nuxt@4.5.1
vue@3.5.40
typescript@5.9.3
tailwindcss@4.3.3

npm ls @pinia/nuxt pinia --depth=0
@pinia/nuxt@1.0.1
pinia@4.0.2

# next-app
npm ls next react react-dom typescript tailwindcss --depth=1
next@16.2.12
react@19.2.8
react-dom@19.2.8
typescript@5.9.3
tailwindcss@4.3.3
```

## Verification results

| Application | Lint | Typecheck | Test | Production build |
| --- | --- | --- | --- | --- |
| `nuxt-app` | passed | passed | passed (no automated tests are defined in this initialization stage) | passed |
| `next-app` | passed | passed | passed (no automated tests are defined in this initialization stage) | passed with Turbopack |

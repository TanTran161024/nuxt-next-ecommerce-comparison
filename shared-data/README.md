# Shared snapshot data

`products.json` is the single fixed snapshot consumed by both applications. Use `npm run validate:data`, `npm run sync:data`, and `npm run verify:data` after a successful import. The importer reads only public Supersports pages after checking `robots.txt`; it will not overwrite an existing snapshot unless run with `--force`.

If public automated collection cannot proceed, use `manual-products-template.csv` with user-supplied public fields and record the manual selection in `source-report.md`. The present manual snapshot intentionally uses `sourceUrl: null` with the owner's approval; its supplied image provenance remains in `sourceImageUrl`.

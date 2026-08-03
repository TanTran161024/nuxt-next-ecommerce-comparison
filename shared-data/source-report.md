# Source report

## Automated collection attempt

- Preferred source: `https://supersports.com.vn/collections/giay-dep-nam` and public brand collections.
- Attempt date: 2026-08-03.
- `robots.txt`: fetched with HTTP 200. The requested collection paths were not disallowed for the generic user agent.
- Terms page reviewed: `https://supersports.com.vn/pages/dieu-khoan-va-dieu-kien`.
- Public pages read: robots.txt, terms page, Nike collection page 1, Nike collection page 2.
- Eligible Nike product cards on page 1: 7.
- Access issue: Nike collection page 2 returned HTTP 500.

The importer stopped immediately after this unsuccessful pagination request. It did not retry the failed request, use a proxy, rotate IPs, evade bot controls, use a private API, request authenticated content, or switch to another retailer.

## Current snapshot status

No sourced 50-product snapshot was created. Creating synthetic records and claiming they were collected from Supersports would be inaccurate. `manual-products-template.csv` contains 50 clearly labelled draft records (five brands × ten products) for manual completion. Their names, colors, and prices are plausible demo values only; they are not claimed to be collected from Supersports. User-supplied public Wikimedia Commons image links were added to `sourceImageUrl`; the user will supply the product `sourceUrl` values.

The snapshot owner explicitly approved omitting product-page URLs for this manual dataset. The converter therefore writes `sourceUrl: null` while retaining the 50 supplied `sourceImageUrl` values. This exception applies only to this manual snapshot and must not be presented as product-page data collected from Supersports.

Run `npm run convert:manual-data`, `npm run validate:data`, `npm run sync:data`, and `npm run verify:data`.

## Completed manual snapshot

- Snapshot captured at: `2026-08-03T09:04:22.459Z`.
- Final brands: NIKE, ADIDAS, NEW_BALANCE, CROCS, PUMA. No replacement was applied.
- Products per brand: 10 each (50 total).
- Products per category: running-shoes 12, sneakers 12, slides 10, clogs 10, flip-flops 6.
- Manually supplied fields: draft name, brand, category, color, price, and 50 public image-source URLs.
- Derived fields: slug from name, neutral description, `onSale`, local SVG path, and featured flag.
- Intentionally absent: original price, product-page URL, rating, stock, SKU, and personal data.
- Local SVG assets are neutral 4:3 placeholders created locally and synchronized identically into both applications; no source image was copied or downloaded.

When manually complete, this report must be updated with the collection URLs, selected brands, per-brand and per-category counts, directly collected fields, derived fields, demo fields, and the local-SVG rationale.

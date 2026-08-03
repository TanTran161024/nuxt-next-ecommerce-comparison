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

No sourced 50-product snapshot was created. Creating synthetic records and claiming they were collected from Supersports would be inaccurate. `manual-products-template.csv` now contains 50 clearly labelled draft records (five brands × ten products) for manual completion. Their names, colors, and prices are plausible demo values only; they are not claimed to be collected from Supersports and have no source URLs or source image URLs.

Before conversion, replace each draft name or price as needed and enter a unique public `sourceUrl` for every record. Then run `npm run convert:manual-data`, `npm run validate:data`, `npm run sync:data`, and `npm run verify:data`.

When manually complete, this report must be updated with the collection URLs, selected brands, per-brand and per-category counts, directly collected fields, derived fields, demo fields, and the local-SVG rationale.

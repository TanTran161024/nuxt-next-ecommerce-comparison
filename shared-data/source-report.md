# Source report

- Source of truth: `shared-data/manual-products-template.csv` (50 manually entered rows).
- CSV rows: 50.
- Products per brand: {"NIKE":10,"ADIDAS":10,"NEW_BALANCE":10,"CROCS":10,"PUMA":10}.
- Products per category: {"running-shoes":12,"sneakers":12,"slides":10,"flip-flops":6,"clogs":10}.
- Price range: 799.000–3.699.000 VND.
- Sale products: 0.
- Downloaded source images: 26.
- Benchmark placeholders: 24.
- Benchmark format: WebP, 800×600, contain fit, neutral background, quality 82.
- Products checksum (SHA-256): `4d8fd2a3c22816566a6c0cae7660cca3c36ab8ec618b81b512d0c3d3f1213160`.
- Added fields: id, slug, currency, onSale, neutral description, image path, imageAlt, derived Wikimedia file-page sourceUrl, and featured flag.
- Manual CSV fields name, brand, category, color, price, originalPrice, and sourceImageUrl were not changed.
- No product search, scraping, source-image substitution, hotlinking, rating, stock, SKU, or size data was added.

## Failed image URLs

- https://commons.wikimedia.org/wiki/Special:Redirect/file/Adidas_shoe.JPG: HTTP 429
- https://commons.wikimedia.org/wiki/Special:Redirect/file/Adidas_Run_DMC_shoe.jpg: HTTP 429
- https://commons.wikimedia.org/wiki/Special:Redirect/file/Crocs-synthetic-clogs.jpg: HTTP 429
- https://commons.wikimedia.org/wiki/Special:Redirect/file/Crocs_shoe.jpg: HTTP 404
- https://commons.wikimedia.org/wiki/Special:Redirect/file/Crocs_with_charms.png: HTTP 429
- https://commons.wikimedia.org/wiki/Special:Redirect/file/Crocs_crocband_%2834601773801%29.jpg: HTTP 429
- https://commons.wikimedia.org/wiki/Special:Redirect/file/HK_Fashion_Plastic_Clogs_n_Shoes_n_Colourful_Crocs_Footwear.JPG: HTTP 429
- https://commons.wikimedia.org/wiki/Special:Redirect/file/Crocs_Sandalias.jpg: HTTP 429
- https://commons.wikimedia.org/wiki/Special:Redirect/file/Crocs_Sandalias_2.jpg: HTTP 429
- https://commons.wikimedia.org/wiki/Special:Redirect/file/Imitation_Crocs_Sandals.jpg: HTTP 429
- https://commons.wikimedia.org/wiki/Special:Redirect/file/New_Balance_Women%27s_990_Running_Shoes.jpg: HTTP 429
- https://commons.wikimedia.org/wiki/Special:Redirect/file/Trail_running.JPG: HTTP 429
- https://commons.wikimedia.org/wiki/Special:Redirect/file/New_Balance_shoes_and_Aorus_football_table_%2852593376310%29.jpg: HTTP 429
- https://commons.wikimedia.org/wiki/Special:Redirect/file/Trail_running_shoes.JPG: HTTP 429
- https://commons.wikimedia.org/wiki/Special:Redirect/file/Puma_Clyde.jpg: HTTP 429
- https://commons.wikimedia.org/wiki/Special:Redirect/file/Puma_schuhe.jpg: HTTP 429
- https://commons.wikimedia.org/wiki/Special:Redirect/file/Puma_Jago_Zig_Zag_Running_Shoe.jpg: HTTP 429
- https://commons.wikimedia.org/wiki/Special:Redirect/file/Pumashoes.jpg: HTTP 429
- https://commons.wikimedia.org/wiki/Special:Redirect/file/Puma_association_football_shoes.jpg: HTTP 429
- https://commons.wikimedia.org/wiki/Special:Redirect/file/Puma_Shoes.JPG: HTTP 429
- https://commons.wikimedia.org/wiki/Special:Redirect/file/Puma_pink.gif: HTTP 429
- https://commons.wikimedia.org/wiki/Special:Redirect/file/Puma_Smash_Leather.jpg: HTTP 429
- https://commons.wikimedia.org/wiki/Special:Redirect/file/Speedcat_OG_Sneakers_PUMA.jpg: HTTP 429
- https://commons.wikimedia.org/wiki/Special:Redirect/file/Puma_Suede.jpg: HTTP 429

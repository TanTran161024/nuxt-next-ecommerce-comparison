# Checklist tương đương Nuxt/Next

Ngày kiểm tra: 2026-08-04. Phạm vi là các route lõi và snapshot dữ liệu; không thực hiện Lighthouse và không chỉnh sửa giao diện.

## Phương pháp

- Chạy `npm run test:parity-snapshot`, `npm run test:data` và `npm run data:verify` tại thư mục gốc.
- Đọc route handler, trang và metadata của cả hai ứng dụng; production build xác nhận các route được biên dịch.
- Chạy lint, typecheck và Vitest của từng ứng dụng. Các test hiện có kiểm tra lọc, slug, dữ liệu chi tiết và sản phẩm liên quan.
- Không thể thực hiện smoke test HTTP đồng thời trên hai server build trong môi trường thực thi do chính sách chặn việc khởi tạo process nền. Kết quả route/API bên dưới dựa trên route handler, test và production build thành công.

| Mã kiểm tra | Nội dung | Kết quả Nuxt | Kết quả Next | Có tương đương hay không | Ghi chú |
| --- | --- | --- | --- | --- | --- |
| DATA-01 | Số lượng sản phẩm snapshot | 50 | 50 | Có | Script mới xác nhận cả hai trùng `shared-data/products.json` byte-for-byte. |
| DATA-02 | Slug | Trùng toàn bộ 50 slug nguồn chung | Trùng toàn bộ 50 slug nguồn chung | Có | So sánh deep equality toàn bộ record. |
| DATA-03 | Category | Trùng snapshot nguồn | Trùng snapshot nguồn | Có | Bao gồm giá trị category của từng sản phẩm. |
| DATA-04 | Giá | Trùng snapshot nguồn | Trùng snapshot nguồn | Có | Bao gồm `price` và `originalPrice`. |
| DATA-05 | Màu | Trùng snapshot nguồn | Trùng snapshot nguồn | Có | Bao gồm `color` của từng sản phẩm. |
| DATA-06 | Ảnh | 50 ảnh SHA-256 khớp ảnh benchmark | 50 ảnh SHA-256 khớp ảnh benchmark | Có | Đường dẫn ảnh và bytes của từng file đều được kiểm tra. |
| ROUTE-01 | `/` | `app/pages/index.vue` | `app/page.tsx` | Có | Production build thành công ở cả hai. |
| ROUTE-02 | `/products` | `app/pages/products.vue` | `app/products/page.tsx` | Có | Có cùng danh sách và bộ lọc lõi. |
| ROUTE-03 | `/product/[slug]` | `app/pages/product/[slug].vue` | `app/product/[slug]/page.tsx` | Có | Lookup slug, related products và 404 cùng contract. |
| ROUTE-04 | `/api/products` | `server/api/products/index.get.ts` | `app/api/products/route.ts` | Có | Cùng response list và validation filter. |
| ROUTE-05 | `/api/products/[slug]` | `server/api/products/[slug].get.ts` | `app/api/products/[slug]/route.ts` | Có | Cùng response `item`/`relatedItems`; slug thiếu trả 404. |
| FILTER-01 | Category | So sánh không phân biệt hoa/thường, giá trị hợp lệ | Cùng logic | Có | Test Nuxt và Next xác nhận `running-shoes` có 12 item. |
| FILTER-02 | Min price | Điều kiện `>= minPrice` | Cùng logic | Có | Parse số không âm; API từ chối giá trị không hợp lệ. |
| FILTER-03 | Max price | Điều kiện `<= maxPrice` | Cùng logic | Có | Parse số không âm; API từ chối giá trị không hợp lệ. |
| FILTER-04 | Color | So sánh không phân biệt hoa/thường | Cùng logic | Có | Giá trị phải thuộc tập màu snapshot. |
| FILTER-05 | Kết hợp điều kiện | AND brand/category/color/min/max | Cùng logic | Có | Thứ tự và điều kiện trong hai utility tương đương. |
| FILTER-06 | Đặt lại | Xóa store và query về `{}` | Điều hướng về `/products` | Có | Cả hai trả lại danh sách không lọc gồm 50 item. |
| FILTER-07 | Không có kết quả | `ProductEmptyState` | Empty-state nội tuyến | Có | Ví dụ filter hợp lệ `maxPrice=0` trả mảng rỗng. |
| STATE-01 | Loading | Skeleton ở home, list, detail | `loading.tsx` ở root/list/detail | Có | Cùng mục đích UX; cách tổ chức do framework khác nhau. |
| STATE-02 | Error | Retry cho list/detail; `app/error.vue` toàn cục | `error.tsx` cho root/list/detail, có retry ở list/detail | Có | Nội dung/lớp CSS không hoàn toàn giống nhau, nhưng cùng trạng thái và thao tác phục hồi. |
| STATE-03 | Empty | Empty state riêng có reset | Empty state có link reset | Có | Cùng điều kiện `total = 0`. |
| STATE-04 | 404 | `app/error.vue`, API 404 | `not-found.tsx`, API 404 | Có | Cả trang chi tiết và API slug không tồn tại đều có xử lý 404. |
| META-01 | Metadata trang chủ | Title/description và Open Graph | Title/description từ root layout | Có | Title/description giống nhau; Next không khai báo Open Graph tương ứng. |
| META-02 | Metadata danh sách | Title `Sản phẩm` và description riêng | Kế thừa title/description trang chủ | Không | Next chưa có `metadata` hoặc `generateMetadata` cho `/products`. |
| META-03 | Metadata chi tiết | Title/description/OG động theo sản phẩm | `generateMetadata` động theo sản phẩm | Có | Cùng title, description và ảnh Open Graph theo product; cấu trúc API framework khác nhau. |
| META-04 | Metadata slug không tồn tại | Fallback title trang sản phẩm; error page không đặt metadata 404 riêng | `generateMetadata` trả title 404 riêng | Không | Đây là chênh lệch metadata thực tế. Không sửa theo yêu cầu không thêm chức năng. |
| CHECK-01 | Lint | Pass | Pass | Có | `npm run lint`. |
| CHECK-02 | Typecheck strict | Pass | Pass | Có | `npm run typecheck`. |
| CHECK-03 | Unit tests | 23/23 pass | 8/8 pass | Có | `npm test`; số test khác nhau nhưng các kịch bản lõi đều có coverage. |
| CHECK-04 | Production build | Pass (Nuxt 4.5.1) | Pass (Next 16.2.12) | Có | Next cảnh báo nhiều lockfile; Nuxt cảnh báo plugin/deprecation, không làm build thất bại. |

## Tự động kiểm tra snapshot

`scripts/check-snapshot-integrity.mjs` được chạy bằng:

```sh
npm run test:parity-snapshot
```

Script dùng `shared-data/products.json` làm nguồn chuẩn, xác nhận schema snapshot, số record, equality byte-for-byte của hai file product ứng dụng, equality sâu của các record (gồm slug/category/giá/màu/ảnh), và SHA-256 của 50 ảnh ứng dụng với benchmark.

## Kết luận

Tính tương đương dữ liệu, route, API, lọc và các trạng thái lõi đạt yêu cầu. Có hai chênh lệch metadata cần được ghi nhận: Next chưa có metadata riêng cho danh sách, còn Nuxt chưa có metadata 404 riêng cho slug không tồn tại. Không có sửa đổi giao diện lớn hay số liệu Lighthouse trong giai đoạn này.

## Cập nhật metadata — Đã khắc phục (2026-08-04)

Phần này giữ nguyên lịch sử ghi nhận phía trên và thay thế kết luận của hai mục metadata sau khi đã có test và production build xác nhận.

| Mã kiểm tra | Nội dung | Kết quả Nuxt | Kết quả Next | Có tương đương hay không | Bằng chứng | Ghi chú |
| --- | --- | --- | --- | --- | --- | --- |
| META-01-R | Metadata trang chủ | `homePageMetadata` được dùng bởi `/` | `homeMetadata` được dùng bởi root layout | Có | Hai test metadata đều pass; title/description cùng mục đích trang chủ. | Không thay đổi hành vi trang chủ. |
| META-02-R | Metadata `/products` | Title/description danh sách sản phẩm | `productsPageMetadata` được export bởi `app/products/page.tsx` | Có | Test Nuxt/Next xác nhận metadata list khác homepage; lint, typecheck, test và build pass. | Đã khắc phục chênh lệch META-02 cũ; Next vẫn là Server Component. |
| META-03-R | Metadata chi tiết hợp lệ | Title chứa tên product, description từ product | `productMetadata` dùng bởi `generateMetadata` | Có | Test Nuxt/Next xác nhận title chứa tên và description đúng snapshot. | Giữ metadata động theo product. |
| META-04-R | Metadata và HTTP 404 cho slug không tồn tại | `app/error.vue` đặt title/description 404; route handler trả 404 | `productNotFoundMetadata`; API route trả HTTP 404 | Có | Test route Nuxt và Next xác nhận 404; test metadata xác nhận không chứa metadata product hợp lệ. | Đã khắc phục chênh lệch META-04 cũ, không đổi giao diện 404. |

Kết luận cập nhật: cả hai chênh lệch metadata đã được khắc phục. Không chạy Lighthouse hay đo hiệu năng.

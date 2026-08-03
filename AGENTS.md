# Quy ước làm việc — Nuxt/Next E-commerce Comparison

## Mục tiêu và phạm vi

Repository này phục vụ tiểu luận “Nghiên cứu framework Nuxt JS và so sánh với Next.js trong phát triển website thương mại điện tử bán giày dép”. Nuxt là đối tượng nghiên cứu trọng tâm; Next.js là ứng dụng đối chiếu rút gọn. Hai ứng dụng phải độc lập, dùng cùng một snapshot dữ liệu, có giao diện gần tương đương và dùng chung kịch bản kiểm thử.

Phạm vi lõi chỉ gồm: trang chủ đơn giản; danh sách sản phẩm; lọc theo danh mục, giá, màu; chi tiết theo slug; sản phẩm liên quan; API danh sách và chi tiết; metadata tĩnh/động; loading, error, empty state, 404; responsive; production build; kiểm thử và Lighthouse.

Giỏ hàng chỉ triển khai sau khi phần lõi ổn định. Đặt hàng mô phỏng là phần mở rộng riêng của Nuxt. Không đưa Stripe, email, wishlist, review, vận chuyển, mã giảm giá, dashboard hoặc admin vào phạm vi lõi.

## Phiên bản và môi trường khóa

- Nuxt phải đúng `4.5.1`.
- Next.js phải đúng `16.2.12`.
- Cả hai ứng dụng dùng Node.js `22.x` LTS cùng một bản patch và cùng phiên bản npm. Bản patch và phiên bản npm được ghi lại khi khóa môi trường ở giai đoạn khởi tạo.
- TypeScript phải bật `strict`.
- Không dùng dependency ở trạng thái preview, canary, beta, RC hoặc nightly.
- Sau khi khóa môi trường và lockfile, không tự động nâng cấp dependency. Mọi thay đổi phiên bản phải có chủ đích, được ghi nhận và áp dụng đối xứng khi phù hợp.

## Cấu trúc Nuxt 4.5.1 bắt buộc

Trong `nuxt-app/`, dùng các thư mục sau:

```text
app/pages
app/components
app/layouts
app/composables
app/middleware
app/error.vue
server/api
server/utils
shared
public
```

Không dùng cấu trúc Nuxt 3 cũ với `pages`, `components` hoặc `layouts` ở thư mục gốc của ứng dụng.

## Cấu trúc Next.js 16.2.12 bắt buộc

Trong `next-app/`, dùng App Router và tối thiểu các tuyến:

```text
app/page.tsx
app/products/page.tsx
app/product/[slug]/page.tsx
```

- Mặc định dùng Server Components.
- Chỉ dùng Client Components cho phần cần tương tác, ví dụ bộ lọc.
- API dùng Route Handlers.
- Dùng `generateMetadata` cho metadata động khi phù hợp.
- Cung cấp `loading.tsx`, `error.tsx` và `not-found.tsx` cho các trạng thái cần thiết.

## Dữ liệu, tương đương và đánh giá

- `shared-data/` là nguồn snapshot dữ liệu chung, có version/ghi ngày chụp dữ liệu. Không sao chép rồi chỉnh sửa riêng từng ứng dụng.
- Chuẩn hóa contract dữ liệu, query filter và kịch bản kiểm thử trước khi triển khai từng app.
- Giao diện, nội dung mẫu, hành vi lọc và tiêu chí responsive phải tương đương ở mức có thể so sánh được; khác biệt do framework cần được ghi vào `docs/`.
- Lưu cấu hình đo, kết quả build/test/Lighthouse và điều kiện chạy vào `experimental-results/` để có thể tái lập.

## Quy trình thay đổi

1. Thực hiện theo các giai đoạn trong `README.md`.
2. Không khởi tạo Nuxt hoặc Next.js trước giai đoạn được yêu cầu.
3. Mỗi giai đoạn hoàn tất phải có một commit riêng nếu Git khả dụng; commit nêu rõ phạm vi thay đổi. Nếu chưa có Git, ghi nhận trạng thái này trong báo cáo công việc.
4. Trước khi kết thúc một giai đoạn, chạy kiểm tra phù hợp với thay đổi và ghi kết quả/giới hạn.

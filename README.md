# Nuxt JS và Next.js — E-commerce giày dép

Repository này là không gian làm việc cho tiểu luận “Nghiên cứu framework Nuxt JS và so sánh với Next.js trong phát triển website thương mại điện tử bán giày dép”. Ứng dụng Nuxt 4.5.1 là trọng tâm nghiên cứu; ứng dụng Next.js 16.2.12 là đối chiếu rút gọn. Cả hai độc lập nhưng cùng snapshot dữ liệu, giao diện gần tương đương và kịch bản kiểm thử thống nhất.

Hiện tại chỉ có skeleton repository. Chưa khởi tạo Nuxt, Next.js hoặc cài dependency.

## Cấu trúc

```text
nuxt-next-ecommerce-comparison/
├── nuxt-app/                # Ứng dụng Nuxt, sẽ khởi tạo ở giai đoạn 2
├── next-app/                # Ứng dụng Next.js, sẽ khởi tạo ở giai đoạn 3
├── shared-data/             # Snapshot dữ liệu dùng chung và contract
├── scripts/                 # Script kiểm tra/đo lường dùng chung
├── docs/                    # Thiết kế, kịch bản và ghi nhận so sánh
├── experimental-results/    # Build, test, Lighthouse và số liệu tái lập
├── AGENTS.md                # Quy ước bắt buộc cho tác nhân/phát triển
└── README.md
```

## Lộ trình theo các prompt tiếp theo

1. **Khảo sát và nền tảng (đã thực hiện):** kiểm tra repository, tạo skeleton, quy ước và lộ trình; chưa khởi tạo ứng dụng.
2. **Khóa môi trường và khởi tạo Nuxt:** chọn một Node.js 22.x LTS patch và npm dùng chung, khởi tạo chính xác Nuxt 4.5.1 với TypeScript strict, xác nhận cấu trúc `app/` bắt buộc và khóa dependency.
3. **Khởi tạo Next đối chiếu:** khởi tạo chính xác Next.js 16.2.12 với TypeScript strict, App Router và cùng môi trường đã khóa; khóa dependency.
4. **Chuẩn hóa dữ liệu và hợp đồng:** tạo snapshot danh mục/sản phẩm giày dép ở `shared-data/`, xác định schema, slug, lọc danh mục/giá/màu và dữ liệu phục vụ trạng thái rỗng/404.
5. **Triển khai lõi Nuxt:** trang chủ, danh sách/lọc, chi tiết slug, liên quan, API, metadata, loading/error/empty/404 và responsive theo Nuxt 4.5.1.
6. **Triển khai lõi Next:** tái hiện cùng hành vi và giao diện gần tương đương bằng App Router, Server Components mặc định, Client Components tối thiểu, Route Handlers và metadata động.
7. **Kiểm thử, build và đo lường:** chạy cùng kịch bản chức năng, production build và Lighthouse; lưu cấu hình, kết quả và điều kiện đo trong `experimental-results/`.
8. **Phân tích tiểu luận và mở rộng có kiểm soát:** tổng hợp khác biệt, ưu/nhược điểm và bằng chứng. Chỉ sau khi lõi ổn định mới cân nhắc giỏ hàng; đặt hàng mô phỏng là phần mở rộng dành riêng cho Nuxt.

## Phạm vi lõi để so sánh

- Trang chủ đơn giản, danh sách sản phẩm, lọc theo danh mục/giá/màu.
- Chi tiết sản phẩm theo slug và sản phẩm liên quan.
- API danh sách và chi tiết; metadata tĩnh và động.
- Loading, error, empty state, 404, responsive, production build, kiểm thử và Lighthouse.

Ngoài phạm vi lõi: Stripe, email, wishlist, review, vận chuyển, mã giảm giá, dashboard và admin.

## Tái lập và kiểm soát phiên bản

Phiên bản bắt buộc là Nuxt `4.5.1` và Next.js `16.2.12`. Khi bước khóa môi trường được thực hiện, README sẽ bổ sung chính xác Node.js 22.x patch, npm và các lockfile tương ứng. Không nâng cấp tự động sau thời điểm đó. Xem [AGENTS.md](AGENTS.md) để biết đầy đủ quy ước kỹ thuật và quy trình commit theo giai đoạn.

# UI redesign report

## Tham khảo

Đã truy cập Giày Cũ Sài Gòn (trang chủ và tất cả sản phẩm) cùng MaxxSport (trang chủ và giỏ). Các điểm tham khảo là phân vùng hero/thương hiệu/lưới, sidebar lọc và phân tầng điều hướng. Không sao chép logo, thương hiệu, banner, ảnh, nội dung, màu nhận diện hay mã nguồn.

## Thay đổi

- Token chung tại `nuxt-app/app/assets/css/tokens.css` và `next-app/app/tokens.css`.
- Header sticky, điều hướng active, menu mobile, Escape, badge giỏ và footer gọn ở cả hai app.
- Homepage cùng thứ tự hero, 5 brand, 10 featured, category chips và khối nghiên cứu.
- Product card/grid cùng ảnh 4:3, chiều cao nội dung ổn định, giá, sale, focus và phản hồi thêm giỏ.
- Trang products cùng breadcrumb, sidebar filter desktop, toolbar kết quả/reset và empty state.

## Logic và route

Không thay đổi snapshot dữ liệu, API, query filter, metadata, related product, CartItem/localStorage/action hay các route. Không thêm sắp xếp vì logic hiện có không hỗ trợ.

## Khác biệt framework

Nuxt dùng Pinia và component `.vue`; Next dùng Context/Reducer và client component cho header/filter/cart. Cấu trúc nội dung và token CSS được giữ tương đương.

## Kiểm tra

Lint/typecheck đã được chạy trong quá trình sửa. Screenshot/Playwright không khả dụng trong phiên này; checklist thủ công: kiểm tra `/`, `/products`, `/product/<slug>`, `/cart` và slug không tồn tại ở 375px, 768px, 1024px, 1440px; mở/đóng menu bằng Escape; áp dụng/reset filter; thêm/xóa giỏ.

## Giới hạn

Chưa tạo ảnh screenshot vì browser automation không khả dụng. Filter mobile hiện thu gọn theo responsive của form, chưa có drawer overlay riêng; logic URL vẫn giữ nguyên.

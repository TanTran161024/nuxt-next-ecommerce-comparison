# Reference UI audit

## Nguồn đã truy cập

- https://giaycusaigon.com/ — truy cập được; thấy cụm thương hiệu, các nhóm sản phẩm và các khối sản phẩm theo thứ tự dọc.
- https://giaycusaigon.com/tat-ca-san-pham — truy cập được; thấy tiêu đề, sidebar bộ lọc theo giá/loại/thương hiệu, tổng kết quả, điều khiển sắp xếp và lưới sản phẩm.
- https://maxxsport.com.vn/cart — truy cập được nhưng trang phản hồi chủ yếu cấu trúc menu; đủ để tham khảo cách phân tầng điều hướng và điểm vào giỏ.
- https://maxxsport.com.vn/ — truy cập được; thấy header phân tầng, danh sách thương hiệu và trình bày thẻ sản phẩm.

## Điều quan sát và áp dụng

Trang chủ tham khảo dùng các khu vực rõ ràng: dẫn nhập, thương hiệu, rồi nhóm sản phẩm. Trang mới sẽ dùng hero tĩnh, 5 thẻ thương hiệu, 10 sản phẩm featured, nhóm loại và lời giải thích mục tiêu nghiên cứu.

Trang danh sách tham khảo ưu tiên bộ lọc tách khỏi lưới. Hai ứng dụng sẽ dùng sidebar trên desktop và drawer trên mobile, giữ nguyên query/API hiện có. Không bổ sung sắp xếp vì logic hiện tại chưa hỗ trợ.

Phần giỏ được tổ chức thành danh sách mặt hàng và bản tóm tắt độc lập trên desktop, thu về một cột trên mobile. Trạng thái rỗng giữ CTA về danh sách sản phẩm.

## Không sao chép

Không dùng logo, tên, banner, ảnh, icon riêng, câu chữ, mã, màu nhận diện hay bố cục theo từng pixel của các trang tham khảo. Không đưa hotline, đăng nhập, wishlist, voucher, vận chuyển hoặc checkout vào demo.

## Thiết kế đề xuất

Hai app dùng cùng token: nền xám xanh rất nhạt, bề mặt trắng, chữ than, xanh teal làm màu nhấn, thẻ bo 14px và container 1280px. Header sticky, desktop nav có trạng thái active; mobile có menu điều khiển bằng nút và Escape. Product card ưu tiên ảnh 4:3, chiều cao nội dung ổn định và phản hồi ngắn ngay tại nút thêm giỏ.

## Component sẽ sửa

- Layout, header, footer, tokens và CSS nền.
- Product card, grid, filter, skeleton, empty/error/404.
- Trang home, products, product detail, cart ở cả Nuxt và Next.

## Logic phải giữ nguyên

Snapshot 50 sản phẩm, API/response, route và query filter; metadata; related products; CartItem schema/key/localStorage và toàn bộ action giỏ; phiên bản framework/package manager; test logic hiện có.

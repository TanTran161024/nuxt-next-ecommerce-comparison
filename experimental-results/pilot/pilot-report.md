# Pilot report

- Status: **PILOT_FAILED**
- Bắt đầu: 2026-08-04T16:37:36.524Z
- Kết thúc lần retry: 2026-08-04T16:42:35.064Z
- Commit SHA: `890fb5c1cf02be370fc0107eece38002920e607d`
- Working tree trước pilot: chỉ benchmark tooling/results đang thay đổi; trạng thái chi tiết được lưu ở report attempt.
- Node.js: `v22.23.2`
- npm: `10.9.8`
- Lighthouse: `13.4.1`
- Chrome: `C:\Program Files\Google\Chrome\Application\chrome.exe`
- Lighthouse config: desktop, cold cache, simulated throttling, CPU 1x.
- Preflight: PASS.

## Kết quả đã lưu

- Nuxt build run 1: thành công; raw time `23.9029563` seconds.
- Next build run 1: thành công; raw time `10.8665804` seconds.
- Lighthouse Nuxt: 3/3 route thành công (`home`, `products`, `product-detail`).
- Lighthouse Next: 0/3; Next chưa khởi động do pilot dừng ở xác nhận giải phóng port 3000.
- JSON đã tạo: 3; HTML đã tạo: 3.
- Lighthouse CSV hợp lệ: 3 dòng; build CSV hợp lệ: 2 dòng.
- Summary build và Lighthouse đã tạo từ dữ liệu pilot thực tế; sample standard deviation để trống vì chỉ có một lượt/nhóm.

## Lỗi và retry

Lần đầu Lighthouse Nuxt/home lỗi do quoting `--output-path` trên Windows; log và report attempt cũ được giữ lại. Một retry duy nhất đã được thực hiện sau khi sửa runner. Retry tạo thành công ba report Nuxt, nhưng runner dừng khi bộ dò port cũ coi một kết nối TCP không phải listener là port 3000 còn bị chiếm. Sau đó `netstat` không còn listener ở port 3000 hoặc 3001. Bộ dò đã được sửa để chỉ kiểm tra `LISTENING`, nhưng không chạy pilot lần thứ ba theo giới hạn retry.

- Server: Nuxt đã được dừng; không còn listener 3000/3001 sau pilot.
- Chrome profiles tạm còn lại: 0.
- Functional tests: không chạy vì pilot dừng trước bước functional.
- Cần kiểm tra thủ công: FT-11 Loading, FT-12 Error, FT-14 Responsive.

Pilot chưa đủ điều kiện để chạy benchmark chính thức 5 lượt vì thiếu 3 report Next và functional test pilot. Không dùng pilot để xếp hạng framework.

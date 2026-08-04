# Pilot-02 report

- Status: **PILOT_PASS_WITH_WARNINGS**
- Preflight: PASS.
- Commit SHA: `890fb5c1cf02be370fc0107eece38002920e607d`
- Working tree trước pilot: chỉ benchmark tooling/results thay đổi.
- Node.js/npm: `v22.23.2` / `10.9.8`.
- Lighthouse: `13.4.1`.
- Chrome: `C:\Program Files\Google\Chrome\Application\chrome.exe`.
- Lighthouse config: `desktop`, `cold`, `simulate`, `1x`.

## Xác nhận bản sửa Windows

- `--output-path="<path>"` đã tạo thành công JSON và HTML cho cả sáu route trong pilot-02; Lighthouse CLI cũng chấp nhận cú pháp này với một đường dẫn kiểm tra có khoảng trắng (chế độ `--help`, không tạo report).
- Kiểm tra port chỉ xét socket TCP `LISTENING`; sau pilot không còn listener tại 3000 hoặc 3001. TIME_WAIT/CLOSE_WAIT không chặn runner.

## Kết quả thực tế

- Nuxt build: PASS, 1 lượt; raw time trong `raw-data/build-results.csv`.
- Next build: PASS, 1 lượt; raw time trong `raw-data/build-results.csv`.
- Lighthouse Nuxt: 3/3 route thành công.
- Lighthouse Next: 3/3 route thành công.
- JSON: 6; HTML: 6; Lighthouse CSV: 6 dòng; build CSV: 2 dòng.
- Chrome profile tạm: đã dọn, còn 0 profile.
- Functional benchmark: đã chạy thành công; FT-01 đến FT-10 là PASS có log.
- Cần review thủ công: FT-11 Loading, FT-12 Error, FT-13 Empty state UI, FT-14 Responsive/visual layout.

Summary chỉ mô tả dữ liệu pilot thực tế; sample standard deviation để trống vì mỗi nhóm có một lượt đo. Pilot đủ điều kiện kỹ thuật để chuẩn bị benchmark chính thức 5 lượt, sau khi hoàn thành các mục review thủ công; không dùng pilot để xếp hạng framework.

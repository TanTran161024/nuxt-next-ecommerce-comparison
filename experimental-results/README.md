# Kết quả thực nghiệm

Thư mục này lưu điều kiện chạy, log thô, báo cáo Lighthouse, ảnh chụp và bảng tổng hợp có thể tái lập. Template không phải là kết quả đo; chỉ điền dữ liệu sau khi thực nghiệm thật.

## Chuẩn bị môi trường

Điền [environment-template.md](environment/environment-template.md) trước mỗi đợt đo. Không thay thế giá trị chưa biết bằng ước lượng.

## Build và chạy production

Từ thư mục gốc, build từng ứng dụng:

```powershell
npm --prefix nuxt-app run build
npm --prefix next-app run build
```

Chạy chúng trong hai terminal riêng, với cổng khác nhau:

```powershell
# Terminal Nuxt
$env:PORT = '3000'
node nuxt-app/.output/server/index.mjs

# Terminal Next
npm --prefix next-app run start -- -p 3001
```

Xác minh các URL production trước khi đo, ví dụ `http://127.0.0.1:3000/products` và `http://127.0.0.1:3001/products`.

## Lighthouse

Sử dụng cùng phiên bản Lighthouse và cùng trình duyệt đã ghi ở environment. Với từng framework và từng page, đo **5 lần** trong điều kiện tương đương. Khi Lighthouse CLI đã được chuẩn bị trong môi trường, lưu cả HTML lẫn JSON, ví dụ:

```powershell
lighthouse http://127.0.0.1:3000/products --output html --output json --output-path experimental-results/lighthouse/nuxt/products-run-01
lighthouse http://127.0.0.1:3001/products --output html --output json --output-path experimental-results/lighthouse/next/products-run-01
```

Đặt tên báo cáo theo `<page>-run-<01-05>.report.html` và `<page>-run-<01-05>.report.json`; lưu log build theo `<framework>-run-<nn>.log`.

## Ảnh chụp và dữ liệu gốc

- Đặt ảnh theo `<page>-<viewport>-run-<nn>.png`, ví dụ `products-desktop-run-01.png`, trong `screenshots/nuxt` hoặc `screenshots/next`.
- Ghi từng lần đo thật vào `raw-data/lighthouse-results.csv` (tạo từ template), không ghi vào file `*-template.csv`.
- Ghi thời gian build thực vào `raw-data/build-results.csv` (tạo từ template).
- Giữ nguyên kết quả xấu, lỗi hoặc ngoại lệ và mô tả chúng trong `notes`; không xóa để chọn kết quả đẹp.
- Không làm tròn số liệu gốc trước khi tổng hợp. Chỉ dùng script tổng hợp sau khi hoàn thành việc nhập CSV thật.

## Tổng hợp

```powershell
node scripts/summarize-experimental-results.mjs
```

Script đọc `raw-data/lighthouse-results.csv` và ghi `summary/lighthouse-summary.csv` cùng `summary/lighthouse-summary.md`. `scripts/summarize-build-results.mjs` tương tự tạo `build-summary.csv` và `build-summary.md` sau khi có log build thật. Nếu file chưa tồn tại hoặc không có dòng dữ liệu thật, script dừng với thông báo rõ ràng và không tạo số liệu. Có fixture tách biệt trong `scripts/fixtures/` chỉ để kiểm tra script; fixture không thuộc kết quả thực nghiệm.

# Source Code Thiệp Cưới Điện Tử - Bích Duyên & Việt Tiến (Sunswedding Clone)

Source code thiệp cưới điện tử trực tuyến cao cấp, sao chép trọn vẹn từ mẫu thiết kế `https://sunswedding.com/vuong-ha`, tối ưu hiển thị hoàn hảo trên Mobile & Desktop, mượt mà với hiệu ứng mở phong bì 3D, phát nhạc đám cưới tự động, sổ lưu bút, xác nhận tham dự (RSVP), hộp mừng cưới QR Code Vietcombank và album ảnh cưới chất lượng cao.

---

## 🌟 Các Tính Năng Nổi Bật

1. **Hiệu Ứng Mở Bao Thư 3D (3D Envelope Opening)**:
   - Tự động nhận diện tên khách mời từ URL param `?guest=...` (Ví dụ: `index.html?guest=bạn Minh Hiếu`).
   - Hiệu ứng lật nắp phong bì 3D (`rotateX: -180deg`) khi chạm vào bao thư.
   - Tự động phát nhạc nền lãng mạn ngay khi mở thư.

2. **Trình Phát Nhạc Cưới Nổi (Floating Music Player)**:
   - Đĩa than vinyl xoay 360 độ góc dưới màn hình.
   - Hỗ trợ danh sách 3 bài hát cưới chọn lọc (*Lễ đường*, *Ta là của nhau*, *Một đời*).
   - Tự động chuyển bài tiếp theo khi kết thúc.

3. **Hiệu Ứng Cánh Hoa Rơi 60FPS (Canvas Falling Petals)**:
   - Cánh hoa đào/hồng cùng hạt ánh kim rơi nhẹ nhàng, cực nhẹ và mượt mà trên mọi điện thoại.

4. **Album Ảnh Cưới Lookbook & Lightbox Phóng To**:
   - Khung Hero Carousel tự chuyển cảnh và bố cục tạp chí cưới nghệ thuật FOREVER LOVE & LOVE WHISPERS.
   - Trình phóng to toàn màn hình Lightbox hỗ trợ vuốt chạm cảm ứng trên di động và phím mũi tên trên máy tính.

5. **Sổ Lưu Bút & Nhắn Gửi Yêu Thương (Wishes & RSVP)**:
   - Tự động điền tên khách mời từ liên kết thiệp.
   - Khay chèn biểu tượng cảm xúc Emoji cưới nhanh gọn, không tràn mép.
   - Bộ 3 thẻ ảnh chọn khách của Cô dâu / Chú rể / Cả hai.
   - Bắn pháo hoa Confetti chúc mừng khi gửi thành công.

6. **Hộp Mừng Cưới (Lucky Money Box)**:
   - Chuyển đổi linh hoạt giữa tài khoản Cô dâu (Bích Duyên) và Chú rể (Việt Tiến).
   - Mã QR Vietcombank quét nhanh trên app ngân hàng.
   - Nút 1-chạm sao chép số tài khoản kèm thông báo Toast.

8. **Đồng Hồ Đếm Ngược (Live Countdown Timer)**:
   - Đếm ngược Ngày - Giờ - Phút - Giây theo thời gian thực đến thời điểm 18/12/2026 tại Phước Long, Đồng Nai.

---

## 📁 Cấu Trúc Thư Mục

```text
d:\invitation\
├── index.html              # Thiệp cưới chính
├── image\                  # Toàn bộ 16 ảnh cưới (wedding-01..16.jpg) và QR ngân hàng
├── css\
│   ├── style.css           # CSS mẫu cổ điển
│   └── animations.css      # Hoạt ảnh mở thư 3D
├── js\
│   ├── data.js             # Cấu hình dữ liệu chung (ngày cưới 18/12, Phước Long Đồng Nai, ảnh, ngân hàng)
│   ├── envelope.js, music.js, petals.js, gallery.js, countdown.js, rsvp.js, wishes.js, app.js
└── README.md               # Hướng dẫn chi tiết
```

---

## 🚀 Cách Chạy Thiệp Cưới

### Cách 1: Chạy trực tiếp trên trình duyệt
Bạn chỉ cần nhấp đúp vào tệp `index.html` hoặc mở bằng bất kỳ trình duyệt nào (Chrome, Edge, Safari, Firefox).

Để thử nghiệm gửi thiệp cho khách mời bất kỳ, mở theo định dạng:
```text
file:///D:/invitation/index.html?guest=bạn%20Minh%20Hiếu
```

### Cách 2: Chạy qua Local Web Server
Nếu bạn có Node.js:
```bash
# Cài đặt và khởi chạy server cục bộ nhanh
npx serve d:\invitation
# hoặc
npx live-server d:\invitation
```

### Cách 3: Đưa lên mạng miễn phí (Vercel / GitHub Pages / Netlify)
- **Vercel**: Kéo thả thư mục `d:\invitation` vào [Vercel Dashboard](https://vercel.com).
- **GitHub Pages**: Đẩy thư mục này lên GitHub Repo và bật GitHub Pages trong Settings -> Pages.
- **Netlify**: Kéo thả thư mục vào [Netlify Drop](https://app.netlify.com/drop).

---

## ✏️ Hướng Dẫn Tùy Chỉnh Thông Tin

Mọi thông tin về cặp đôi, ngày cưới, ảnh, bài hát, tài khoản ngân hàng được quy tụ gọn gàng trong tệp **`js/data.js`**:

- **Đổi tên cô dâu & chú rể**: Sửa mục `couple.groom.name` và `couple.bride.name`.
- **Đổi ngày giờ cưới**: Sửa `weddingDate: "2026-12-18T09:00:00"`.
- **Đổi tài khoản ngân hàng & mã QR**: Sửa mục `bankAccounts.groom` và `bankAccounts.bride`.
- **Thêm/bớt bài hát cưới**: Thêm đường link mp3 vào danh sách `playlist`.
- **Thay đổi ảnh cưới**: Cập nhật ảnh trong thư mục `image/` (`wedding-01.jpg` đến `wedding-16.jpg`).

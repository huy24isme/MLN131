# 💼 Chiếc Cặp Nguyện Vọng - Game Show Lớp Học

Ứng dụng web Game Show tương tác trực quan dành cho sinh hoạt lớp, tiết học ngoại khóa hoặc hoạt động ôn tập kiến thức. 

Được xây dựng bằng **React + Vite + TypeScript + Tailwind CSS**, tối ưu trình chiếu máy chiếu trên lớp học, hỗ trợ âm thanh Web Audio chân thực và **triển khai 1-click lên Vercel**.

---

## 🎯 Tính năng nổi bật

1. **Linh hoạt số đội (2 - 5 đội):** Tùy chỉnh số đội và đặt tên theo Tổ 1, Tổ 2,... hoặc tên riêng.
2. **8 Chiếc Cặp Bí Ẩn:** Thiết kế 3D kim loại, hiệu ứng mở kịch tính với 8 trạng thái:
   - `+10 Điểm`
   - `Nhân đôi điểm (x2)`
   - `Đổi điểm với 1 đội`
   - `Chia đôi điểm (/2)`
   - `Trừ 5 điểm`
   - `Trừ 10 điểm`
   - `Mất toàn bộ điểm (về 0)`
   - `Không có gì (+0)`
3. **20 Câu hỏi ma trận tương tác:**
   - Điểm số rải từ 1 đến 5 điểm và duy nhất 1 câu **JACKPOT 10 điểm**.
   - Điểm và nội dung câu hỏi được ẩn giấu cho đến khi lật mở.
   - Đồng hồ đếm ngược 10 giây kèm âm thanh tíc tắc & cảnh báo hết giờ.
   - Bảng đáp án đối chiếu cho Quản trò (MC).
4. **Trình chỉnh sửa câu hỏi tích hợp:** MC/Giáo viên có thể sửa câu hỏi, đáp án, điểm số trực tiếp trên web và tự động lưu vào trình duyệt (`localStorage`).
5. **Vòng thương lượng kịch tính (Deal or No Deal):**
   - Đội điểm thấp nhất đàm phán trước.
   - BTC ra giá mua cặp (tối đa 8 điểm).
   - 10 giây suy nghĩ: Chấp nhận bán an toàn hoặc mạo hiểm giữ cặp để mở.
6. **Âm thanh chân thực (Web Audio API):** Không lo lỗi tải file mp3, chạy mượt mà ngay cả khi offline.
7. **Bảng vinh danh & Pháo hoa Confetti:** Trao cúp vàng cho đội vô địch 🏆.

---

## 🚀 Hướng dẫn chạy trên máy tính (Local)

1. Mở terminal tại thư mục dự án và cài đặt dependencies (nếu chưa):
```bash
npm install
```

2. Khởi chạy giao diện thử nghiệm:
```bash
npm run dev
```
Truy cập địa chỉ hiển thị trên terminal (thường là `http://localhost:5173`).

---

## 🌐 Hướng dẫn Đẩy lên GitHub & Deploy lên Vercel

### Bước 1: Khởi tạo và Đẩy lên GitHub

1. Tạo một repository mới trên [GitHub](https://github.com/new) (ví dụ đặt tên: `chiec-cap-nguyen-vong`).
2. Chạy các lệnh sau trong terminal của bạn:

```bash
git init
git add .
git commit -m "Initial commit - Game Chiec Cap Nguyen Vong"
git branch -M main
git remote add origin https://github.com/<tai-khoan-github-cua-ban>/chiec-cap-nguyen-vong.git
git push -u origin main
```

---

### Bước 2: Deploy lên Vercel (Miễn phí 100%)

1. Truy cập [vercel.com](https://vercel.com/) và đăng nhập bằng tài khoản GitHub.
2. Bấm nút **"Add New..."** ➜ Chọn **"Project"**.
3. Chọn repository `chiec-cap-nguyen-vong` bạn vừa đẩy lên.
4. Vercel sẽ tự động nhận diện cấu hình:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Bấm **"Deploy"** và chờ khoảng 30 giây.
6. Bạn sẽ nhận được đường link web trực tuyến dạng `https://chiec-cap-nguyen-vong.vercel.app` để mở trên lớp học bất cứ lúc nào!

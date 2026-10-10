# POTATO V4 — Tự nghĩ → 3–2–1 → Nói · Thảo luận và Debate 3v3

Website chạy thực tế bằng Node.js (không cần npm install). **Raleway** là font giao diện; **Playfair Display** chỉ dùng cho chữ nhấn. Có giao diện responsive, logo POTATO với chữ O đầu tiên là củ khoai tây.

## 1. Khởi động trên Windows

1. Giải nén ZIP, vào đúng thư mục `POTATO_Web` có file `server.js`.
2. Bấm thanh địa chỉ File Explorer (`Ctrl + L`) → gõ `cmd` → Enter.
3. Nhập `node server.js`.
4. Mở http://localhost:3000 trong Chrome hoặc Edge.

Yêu cầu: Node.js 18.17+. Không cần tắt Smart App Control. Nếu hiện **EADDRINUSE** do web cũ còn mở: tắt cửa sổ server cũ bằng `Ctrl + C`, hoặc chạy:

```cmd
set PORT=3001
node server.js
```

Rồi mở http://localhost:3001.

## 2. Nói & suy nghĩ: luồng V4

1. Chọn một chủ đề và thời gian **suy nghĩ** (15/60/120 giây), **nói** (45/60/90 giây).
2. Bấm **Bắt đầu** → POTATO **xin quyền micro ngay**, trước khi bắt đầu đồng hồ suy nghĩ. Nếu không cấp quyền vẫn có thể nhập văn bản.
3. Hết thời gian suy nghĩ, hệ thống tự chạy **3 → 2 → 1**.
4. Ngay sau đó **đồng hồ nói tự bật**, POTATO tự thử kích hoạt SpeechRecognition (Chrome/Edge) để chép giọng nói thành chữ. **Không phải bấm “Bắt đầu nói” lần nữa.**
5. Hết giờ nói, POTATO tự dừng và gửi bản chép đến hệ thống gợi hỏi **nếu đủ ít nhất 20 ký tự**. Nếu micro bị chặn hoặc bản chép quá ngắn, người dùng có thể nhập/chỉnh chữ rồi bấm **Nhận góp ý**.
6. Người dùng nói lại quan điểm, rút bài học. **Tổng kết cuối** có nhận xét từ Gemini khi khóa API hợp lệ (không có khóa = góp ý theo quy tắc và luôn ghi nhãn rõ).

**Giới hạn trình duyệt:** Một số trình duyệt có thể chặn `SpeechRecognition.start()` được gọi tự động sau countdown dù quyền micro đã được cấp. Khi đó đồng hồ nói vẫn bắt đầu đúng giờ nhưng cần bấm **Bật lại mic** một lần hoặc nhập chữ. Đây là giới hạn trình duyệt, không thể đảm bảo vượt qua ở mọi thiết bị.

## 3. Hai chế độ phòng trò chuyện

### Vòng tròn (2–12 người)

- Tạo phòng → mời bạn bằng mã 6 ký tự → mỗi người nộp ý kiến riêng → quản trò mở thảo luận → luân phiên trình bày, hỏi và ghi nhận ý hay.
- Micro được hỏi quyền **ngay lúc tạo hoặc tham gia phòng**. Thành viên có thể tắt/bật trong phòng.

### Debate 3v3 (6 người, 3 ủng hộ – 3 phản đối)

- Chủ phòng mặc định thuộc **phe ủng hộ**; các thành viên mới có thể chọn phe, đổi phe trước khi bắt đầu nếu còn chỗ.
- **Chỉ mở vòng chuẩn bị khi có đúng 3 người mỗi phe.** Cả 6 phải nộp ý kiến nguyên bản trước khi lộ cho nhau.
- Sau chuẩn bị: **6 lượt đan xen hai phe**, tương ứng ba nhóm: mở đầu & lập trường → lập luận & phản biện → kết luận & thông điệp.
- Người điều phối nhấn **Chuyển lượt**; mỗi lượt có đồng hồ 45/75/120 giây. Sau lượt 6, trang tự mở tổng kết ghi nhận từ thành viên.
- **Mic Debate tự tắt trong thời gian chuẩn bị, chỉ người đến lượt được phát tiếng.** Người nghe có thể gửi câu hỏi bằng văn bản. Khi đến lượt, mic tự mở nếu người dùng chưa tự tắt.

### Âm thanh phòng

Bản V4 thêm **WebRTC peer-to-peer** qua tín hiệu API và SSE/HTTP. Microphone audio được truyền trực tiếp giữa các trình duyệt, **không được lưu vào `data/store.json` và không gửi đến Gemini**. Chỉ các nội dung người dùng chủ động gửi vào phòng mới thành văn bản trên server.

**Đây là bản demo STUN-only.** Trên một số mạng 4G, doanh nghiệp hoặc NAT chặt, audio ngang hàng có thể không kết nối được nếu chưa có TURN relay. Để dùng rộng rãi cần bổ sung TURN, xác thực mạnh, chống lạm dụng và giám sát.

## 4. Gemini AI

Sao chép `.env.example` thành `.env`, thay `GEMINI_API_KEY` bằng khóa riêng:

```env
PORT=3000
HOST=127.0.0.1
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
GEMINI_MODEL=gemini-2.5-flash
```

Lưu và khởi động lại server. **Không upload `.env`, API key hoặc `data/store.json` lên GitHub.** API Key được đọc ở backend. AI chỉ góp ý nội dung bản chép, **không nghe và chấm trực tiếp giọng nói**.

## 5. Cập nhật từ POTATO V3

1. Tắt server cũ (`Ctrl + C`).
2. Giải nén V4 sang thư mục riêng, không ghi đè vội.
3. **Sao chép file `.env` và `data/store.json` từ V3 vào V4** nếu muốn giữ API Key và dữ liệu. Sao lưu file cũ trước khi ghi đè.
4. Mở CMD tại thư mục `POTATO_Web` mới rồi chạy `node server.js`.
5. Nếu đã deploy lên Render: commit tất cả mã nguồn V4 (bao gồm file MỚI `public/js/room-voice.js`) lên GitHub. Render có thể tự deploy nhánh main. Đặt `HOST=0.0.0.0` trên Render, KHÔNG upload file `.env`.

Đối với Render Free, ổ đĩa mặc định không lưu bền vững `data/store.json` qua mọi lần deploy/khởi động lại. Bản V4 vẫn là MVP, chưa phù hợp để quản lý dữ liệu học sinh quy mô lớn.

## 6. Cấu trúc mã

```text
POTATO_Web/
├── server.js                # Node HTTP, phòng / team / lượt / WebRTC signaling
├── lib/
│   ├── ai.js                # Gemini hoặc gợi hỏi mẫu
│   └── store.js             # Lưu lịch sử và hồ sơ vào JSON
├── public/
│   ├── index.html
│   ├── styles.css           # UI desktop & mobile
│   ├── favicon.svg
│   ├── manifest.webmanifest
│   └── js/
│       ├── app.js           # Luồng đếm giờ, tranh luận, sự kiện
│       ├── room-voice.js    # Âm thanh WebRTC peer-to-peer
│       └── catalog.js      # Bộ câu hỏi, trò chơi, thử thách
├── tests/                   # Kiểm thử API, HTML templates, timer, debate, voice
├── data/.gitkeep
└── .env.example
```

## 7. Chạy kiểm thử

```cmd
npm run check
npm test
npm run test:ui
npm run test:timer
npm run test:debate
npm run test:voice
npm run test:ai
```

Không cần cài thêm thư viện NPM để chạy.

## 8. Lưu ý dữ liệu và an toàn

- Micro chỉ được xin quyền sau hành động nhấn của người dùng; có thể từ chối và nhập văn bản.
- Trang nhận dạng dựa vào Web Speech API: có thể cần dịch vụ trực tuyến của trình duyệt và đôi khi nghe sai.
- Đánh giá debate từ nút ghi nhận của người tham gia, **không phải AI tự xác định phe thắng**.
- Phòng khách dùng token ngẫu nhiên, **chưa có hệ thống tài khoản hay bảo vệ lạm dụng đủ chuẩn production**. Trước khi đưa lên Internet cho đông người, cần cơ sở dữ liệu bền vững, kiểm duyệt, quyền riêng tư cho trẻ vị thành niên, TLS/HTTPS, TURN.

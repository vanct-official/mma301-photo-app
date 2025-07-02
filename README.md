# 📸 PhotoMemoApp

Ứng dụng React Native cho phép người dùng chụp ảnh, lưu vị trí chụp, xem lại ảnh trên bản đồ và tự động mô tả nội dung ảnh bằng AI (Gemini).

---

## 🚀 Tính năng chính

* Chụp ảnh từ camera
* Lưu vị trí GPS nơi chụp ảnh
* Tự động mô tả nội dung ảnh bằng Google Gemini AI
* Xem lại ảnh đã chụp và vị trí trên bản đồ
* Lưu trữ cục bộ bằng AsyncStorage
* Xoá ảnh không cần thiết

---

## 📁 Cấu trúc thư mục

```
PhotoMemoApp/
├── App.js
├── components/
│   ├── PhotoCard.js
│   └── MapModal.js
├── screens/
│   └── HomeScreen.js
├── services/
│   └── gemini.js
├── utils/
│   └── storage.js
├── package.json
```

---

## 🧠 Cài đặt Gemini backend

### 📂 Cấu trúc backend (ví dụ: `gemini-backend/`):

```
gemini-backend/
├── index.js
├── .env
├── package.json
```

### 🔧 Cài đặt:

```bash
cd gemini-backend
npm install express axios cors dotenv
```

### ✍️ Tạo file `.env`:

```env
GEMINI_API_KEY=AIzaSy...your-api-key-here
PORT=3000
```

### ▶️ Chạy backend:

```bash
node index.js
```

### 📍 Lưu ý:

* API sử dụng model mới: `gemini-1.5-flash`
* Backend chạy tại `http://<YOUR_LOCAL_IPV4>:3000/gemini`

Xem địa chỉ IP của máy tính (Windows):

```bash
ipconfig
```

Tìm dòng `IPv4 Address`, ví dụ: `192.168.1.100`

---

## ⚙️ Cài đặt frontend (React Native Expo)

### 1. Cài đặt thư viện:

```bash
cd PhotoMemoApp
npm install
npx expo install \
  expo-image-picker \
  expo-location \
  @react-native-async-storage/async-storage \
  react-native-maps

npm install axios uuid
```

### 2. Cập nhật `services/gemini.js`:

```js
// ví dụ:
export const getDescriptionFromGemini = async (base64Image) => {
  const res = await axios.post('http://192.168.1.100:3000/gemini', { image: base64Image });
  return res.data.description;
};
```

### 3. Chạy ứng dụng:

```bash
npx expo start
```

Sau đó quét QR code để chạy trên điện thoại hoặc dùng emulator.

---

## 📌 Lưu ý khi test trên thiết bị thật:

* Máy tính và điện thoại phải kết nối chung mạng Wi-Fi
* Không dùng `localhost`, hãy dùng IPv4 address thật
* Nếu firewall chặn port 3000, hãy mở port hoặc tắt firewall

---

## 🌟 Gợi ý mở rộng

* Đăng nhập người dùng
* Tổ chức ảnh theo album
* Upload ảnh lên Firebase / Google Cloud / S3

---

> © 2025 - PhotoMemoApp by VanCt

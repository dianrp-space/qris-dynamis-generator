# QRIS Dynamic Generator - API Key Authentication

## Setup Environment Variables

1. Edit file `.env` di folder backend:

```bash
cd backend
```

2. Ubah file `.env`:

```bash
# API Key untuk autentikasi (ganti dengan key yang aman)
API_KEY=your_secure_api_key_here

# Server port
PORT=3001
NODE_ENV=production
```

## Install Dependencies

```bash
cd backend
npm install
```

## API Authentication dengan API Key

### API Endpoints:

**1. Generate QRIS Dinamis:**

```bash
curl -X POST http://localhost:3001/api/generate \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_secure_api_key_here" \
  -d '{
    "staticQris": "QRIS_CODE_HERE",
    "amount": 1000
  }'
```

**2. Parse QR dari Gambar:**

```bash
curl -X POST http://localhost:3001/api/parse-image \
  -H "X-API-Key: your_secure_api_key_here" \
  -F "file=@qr_image.jpg"
```

### Response Format:

**Generate API:**

```json
{
  "dynamicQris": "00020101021226610014COM...",
  "qrImage": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
}
```

**Parse API:**

```json
{
  "qris": "00020101021126610014COM..."
}
```

## Frontend Configuration

Frontend menggunakan API key yang sama. Update di `script.js`:

```javascript
// API Key - sesuaikan dengan backend .env
const API_KEY = "your_secure_api_key_here";
```


# QRIS Dynamic Generator - Security Setup

## Setup Environment Variables

1. Copy `.env` file dan edit sesuai kebutuhan:

```bash
cd backend
cp .env .env.local
```

2. Edit file `.env`:

```bash
# Ganti dengan key rahasia yang kuat (minimal 32 karakter)
API_SECRET_KEY=your_super_secret_jwt_key_minimum_32_characters_long

# Ganti dengan password API yang kuat
API_PASSWORD=your_strong_api_password_here

# JWT token duration
JWT_EXPIRES_IN=24h

# Server port
PORT=3001
NODE_ENV=production
```

## Install Dependencies

```bash
cd backend
npm install jsonwebtoken bcryptjs dotenv
```

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

## Production Deployment

1. **Generate secure API key:**

```bash
# Generate random secure key
openssl rand -hex 32
```

2. **Update .env di server:**

```bash
API_KEY=generated_secure_key_from_step_1
NODE_ENV=production
PORT=3001
```

3. **Update script.js dengan API key yang sama**

4. **Restart aplikasi**

## Security Features

✅ **API Key Authentication** (Header: `X-API-Key`)  
✅ **No password prompts** (Frontend bebas akses)  
✅ **Environment variables** (tidak hardcode)  
✅ **Simple & secure** (cocok untuk internal tools)  
✅ **Easy deployment** (minimal configuration)

## Usage Examples

### JavaScript/Fetch:

```javascript
// Generate QRIS
const response = await fetch("/api/generate", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-API-Key": "your_api_key_here",
  },
  body: JSON.stringify({
    staticQris: "QRIS_CODE",
    amount: 1000,
  }),
});
```

### Python:

```python
import requests

headers = {'X-API-Key': 'your_api_key_here'}
data = {'staticQris': 'QRIS_CODE', 'amount': 1000}

response = requests.post(
    'http://localhost:3001/api/generate',
    headers=headers,
    json=data
)
```

## Important Notes

- **Ganti API_KEY default** sebelum production
- **Gunakan HTTPS** di production
- **Backup environment variables**
- **API key sama** untuk backend dan frontend

## Frontend Authentication

Frontend akan otomatis:

1. Minta password saat pertama kali digunakan
2. Simpan token di localStorage
3. Auto-refresh token jika expired
4. Request password lagi jika token invalid

## Production Deployment

1. **Generate secure keys:**

```bash
# Generate API secret key (32+ characters)
openssl rand -base64 32

# Generate strong password
openssl rand -base64 24
```

2. **Set environment variables di server:**

```bash
export API_SECRET_KEY="your_generated_secret_key"
export API_PASSWORD="your_generated_password"
export NODE_ENV="production"
```

3. **Restart aplikasi**

## Security Features

✅ **JWT Token Authentication**  
✅ **Password tidak di-hardcode** (environment variables)  
✅ **Token auto-expire** (24 jam default)  
✅ **Frontend auto-handle auth**  
✅ **Secure token storage** (localStorage)  
✅ **API rate limiting ready** (bisa ditambah)

## Important Notes

- **JANGAN commit file `.env` ke git**
- **Ganti password default sebelum production**
- **Gunakan HTTPS di production**
- **Backup environment variables**

# 🎥 YouTube-Like Backend Application

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.x-green.svg)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/JWT-Authentication-orange.svg)](https://jwt.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive full-stack backend for a YouTube-like video streaming platform with additional social features like tweets, comments, playlists, and subscriptions.

## ✨ Features

### 👤 User Management
- User registration and authentication
- JWT-based access and refresh tokens
- User profile management (avatar, cover image, account details)
- Password management (reset/change)

### 🎬 Video Management
- Upload and manage videos
- Video metadata handling (title, description, tags, visibility)
- Watch history tracking

### 🌐 Social Features
- Tweet posting and management (micro-posts)
- Comments on videos
- Likes on videos, comments, and tweets
- Subscriptions / Channels
- Playlists creation and management

### 📊 Dashboard
- User statistics and analytics (views, likes, watch time)

## 📁 Project Structure (Example)
```
src/
├── controllers/
├── routes/
├── models/
├── middlewares/
├── services/
├── workers/
└── utils/
config/
scripts/
tests/
postman/
uploads/ or storage/
```

## 🚀 Installation

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables** in `.env` (create from `.env.example`):
   - `PORT` (default: 8000)
   - `DATABASE_URL` (MongoDB connection string)
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN`, `JWT_REFRESH_EXPIRES_IN`
   - `STORAGE_LOCAL_PATH` or S3 credentials
   - `FFMPEG_PATH` (if using local transcoding)
   - `REDIS_URL` (optional)

## 📡 API Endpoints

### 👤 User Routes
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `POST /api/users/logout` - Logout user (protected)
- `POST /api/users/refresh-token` - Refresh access token (protected)
- `GET /api/users/current-user` - Get current user (protected)
- `PATCH /api/users/update-account` - Update account details (protected)
- `POST /api/users/change-password` - Change password (protected)
- `PATCH /api/users/avatar` - Update avatar (protected, file upload)
- `PATCH /api/users/cover-image` - Update cover image (protected, file upload)
- `GET /api/users/c/:username` - Get user channel profile
- `GET /api/users/history` - Get watch history (protected)
- `GET /api/users/:userId/tweets` - Get user tweets
- `GET /api/users/:userId/videos` - Get user videos
- `GET /api/users/:userId/playlists` - Get user playlists

### 🎬 Video Routes
- `POST /api/videos/upload` - Upload a video (multipart/form-data, protected)
- `GET /api/videos/:id` - Get video metadata
- `GET /api/videos/:id/stream` - Stream video / serve HLS manifest
- `GET /api/videos` - List / search videos
- `DELETE /api/videos/:id` - Delete video (owner only)

### 🐦 Tweet Routes
- `POST /api/tweets` - Create tweet (protected)
- `GET /api/tweets` - List tweets
- `GET /api/tweets/:id` - Get tweet
- `DELETE /api/tweets/:id` - Delete tweet (owner only)

### 📝 Playlist Routes
- `POST /api/playlists` - Create playlist (protected)
- `GET /api/playlists/:id` - Get playlist
- `PATCH /api/playlists/:id` - Update playlist (owner)
- `DELETE /api/playlists/:id` - Delete playlist (owner)

### ➕ Additional Features
- `POST /api/videos/:id/comments` - Comment on a video
- `POST /api/:resource/:id/like` - Like/unlike resource (video/comment/tweet)
- `POST /api/subscriptions/:channelId` - Subscribe/unsubscribe

For complete endpoint details, inspect the files in `src/routes/`.

## ▶️ Running the Server

- **Development:**
  ```bash
  npm run dev
  ```

- **Production:**
  ```bash
  npm run build
  npm start
  ```

Default PORT is 8000 unless overridden in `.env`.

## 🛠️ Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT (access + refresh)
- **File Upload:** Multer (local or S3)
- **Video Processing:** ffmpeg (worker)
- **Optional:** Redis for jobs/caching
- **Testing:** Jest + Supertest
- **Linting/Formatting:** ESLint + Prettier

## 📜 Development Scripts (package.json)
- `npm run dev` — start dev server (nodemon)
- `npm run build` — build transpiled code (if using TypeScript)
- `npm start` — start production server
- `npm test` — run tests
- `npm run worker` — start background worker (transcoding/jobs)

## 🔧 Middleware
- **Auth middleware** — verifies JWT tokens for protected routes
- **Multer middleware** — handles multipart uploads with validation
- **Rate limiter** — protect sensitive endpoints (uploads/auth)
- **Validation middleware** — request body validation (Joi/Zod)

## 🗄️ Database Models (Examples)
- User
- Video
- Tweet
- Comment
- Like
- Playlist
- Subscription
- Job (transcoding / processing)

## 💾 Storage & Video Processing
- Uploads stored locally or in S3-compatible storage
- Worker picks up raw uploads, runs ffmpeg to transcode and generate HLS (m3u8 + segments)
- Serve HLS from a static file server or CDN
- Consider resumable uploads for large files (tus or chunked uploads)

## 🔒 Security
- JWT-based authentication and refresh flow
- Password hashing (bcrypt)
- Input validation & sanitization
- CORS configuration
- Rate limiting on auth and upload endpoints
- Store secrets in environment variables (do not commit `.env`)

## 🧪 Testing
- Unit tests with Jest
- Integration tests with Supertest (use test DB and teardown)
- Postman collections for API testing (see `postman/` folder)
- CI should run lint, tests, and build

## 📄 License
[Add your license here] (e.g., MIT)

## 📧 More Information
For endpoint details, middleware behavior, and schema definitions, inspect the route and model files under `src/` (`src/routes`, `src/controllers`, `src/models`).

**Contact:** yogeshkurmalker7@gmail.com

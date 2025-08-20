# ChopURL - URL Shortener 🚀 [Live now!](https://url-shortner-amber-pi.vercel.app/)

A modern, full-stack URL shortener built with React (frontend) and Node.js/Express/MongoDB (backend).

---

## ✨ Features

### Frontend

- **Reactive Forms** for robust and type-safe input handling.
- **Instant URL shortening** with real-time feedback.
- **QR code generation** for every short URL.
- **Animated statistics** (uptime, user count, etc.).
- **Responsive design** for all devices.
- **Dark/light theme detection** and switching.
- **User authentication** (sign up/sign in).
- **Copy-to-clipboard** and easy sharing.

### Backend

- **RESTful API** built with Express.
- **MongoDB Atlas** for scalable data storage.
- **API key authentication** for secure endpoints.
- **Short URL creation, redirection, and click tracking.**
- **User management** (register, login).
- **Rate limiting and memory limits** for demo safety.
- **Environment-based configuration**.

---

## 🛠️ Folder Structure

```
backend/
  controllers/    # Route logic (login, user, URL)
  middlewares/    # Auth, compression, etc.
  models/         # Mongoose schemas
  routes/         # API endpoints
  index.js        # Express app entry

frontend/
  src/
    components/   # React UI components
    App.tsx       # Main app logic
    ...
  public/         # Static assets
```

---

## 🔗 API Endpoints

- `POST /api/login` - User login
- `POST /api/register` - User registration
- `POST /api/shorten` - Shorten a long URL
- `GET /:shortUrl` - Redirect to original URL
- `GET /api/stats` - Get usage statistics
- All endpoints require an **API key** (see `.env` setup).

---

## 🔒 Authentication & Security

- JWT-based user authentication.
- API key required for all backend routes.
- Rate limiting and input validation.

---

## 🚀 Getting Started

### Backend

1. `cd backend && npm install`
2. Create `.env` with:
   ```
   DATABASE_URL=mongodb://localhost:27017/
   API_SECRET_KEY=your_jwt_secret
   JWT_SECRET=your_super_secret_jwt_key
   ```
3. `npm start`

### Frontend

1. `cd frontend && npm install`
2. Change the endpoints for reverse proxy in `vite.config.ts` and `.vercel.json`
3. Create `.env` with:
   ```
   VITE_API_SECRET_KEY=your_api_key
   VITE_API_URL=http://localhost:3000
   JWT_SECRET=your_super_secret_jwt_key
   ```
4. `npm run dev`

---

## 📈 Usage

- Enter a long URL and click **Shorten**.
- Copy the generated short URL or scan the QR code.
- View stats for total URLs and clicks.
- Register/login for personalized features.

---

## 🤝 Contributing

1. Fork the repo and create your branch.
2. Follow code style and add tests if possible.
3. Submit a PR with a clear description.

---

## 🧑‍💻 Tech Stack

- **Frontend:** React, TypeScript, Axios, Vite
- **Backend:** Node.js, Express, Mongoose
- **Database:** MongoDB Atlas

---

## 📄 License

This project is not licensed and is developed from scratch. You are free to use, modify, and distribute this code for personal or educational purposes. Commercial use is not intended by the author.

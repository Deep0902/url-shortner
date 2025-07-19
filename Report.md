# ChopURL - Project Report

## 1. Introduction

ChopURL is a modern, full-stack URL shortener application designed to provide fast, secure, and user-friendly URL shortening services. The project leverages React for the frontend and Node.js/Express with MongoDB for the backend, aiming to deliver a seamless experience for both anonymous and authenticated users.

---

## 2. Motivation & Intentions

### Why I Started
- To learn and implement a full-stack application using modern technologies.
- To solve the common problem of sharing long URLs in a concise, manageable format.
- To explore authentication, security, and scalable architecture in a real-world scenario.

### Project Goals
- Build a robust and scalable URL shortener.
- Provide user authentication and personalized features.
- Ensure security and reliability for all users.

---

## 3. Architecture Overview

### Frontend
- **Framework:** React + TypeScript + Vite
- **Features:** Reactive Forms (using React Hook Form for strongly typed form controls), QR code generation, animated statistics, dark/light theme, responsive design, user authentication, copy-to-clipboard, and sharing.
- **State Management:** React Context API for theme and global state, local state for form and UI controls.
- **Routing:** React Router for SPA navigation.
- **Form Handling:** All forms use strongly typed controls and validation, ensuring robust user input and error handling.
- **Accessibility:** Semantic HTML and ARIA attributes for better accessibility.
- **Progressive Web App:** VitePWA integration for installable experience and offline support.
- **Mobile Optimization:** Custom meta theme-color and responsive layouts for mobile browsers.

### Backend
- **Framework:** Node.js + Express
- **Database:** MongoDB Atlas (cloud-hosted, scalable)
- **Features:** RESTful API, API key authentication, JWT-based user authentication, rate limiting, environment-based configuration, click tracking, user management.
- **Testing:** Supertest and Jest for API endpoint validation.
- **Security:** Passwords are encrypted using AES before storage and transmission. JWT tokens are issued on login and validated for protected routes.
- **Session Management:** JWT tokens are stored in HTTP-only cookies or local/session storage for persistent authentication.
- **Error Handling:** Centralized error middleware for consistent API responses.
- **Logging:** Console and error logs for debugging and monitoring.

---

## 4. Pain Points & Solutions

### Pain Points
- **Authentication:** Implementing secure JWT and API key validation for all endpoints, handling token expiration and refresh.
- **URL Uniqueness:** Ensuring short URLs are unique for both global and user-specific cases, avoiding collisions.
- **Rate Limiting:** Preventing abuse while maintaining usability for demo users, especially for anonymous requests.
- **Responsive UI:** Achieving a consistent look across devices and supporting theme switching, including mobile browser integration.
- **Statistics:** Efficiently aggregating and displaying real-time stats, handling large datasets.
- **Form Validation:** Ensuring all forms are robust, type-safe, and provide clear feedback.
- **Session Persistence:** Managing user sessions securely and reliably across browser reloads and devices.

### Solutions
- Used middleware for API key and JWT validation, including token expiration checks.
- Leveraged nanoid for generating unique short URLs and checked for collisions in the database.
- Integrated rate limiting and memory limits in Express using middleware.
- Utilized CSS variables, media queries, and meta theme-color for theme and responsiveness.
- Aggregated stats in backend controllers and animated them in the frontend using CountUp.
- Implemented React Hook Form for strongly typed, reactive forms with custom validation.
- Stored JWT tokens securely and checked for valid sessions on app load.

---

## 5. Highlighting Features

### Frontend
- **Reactive Forms:** Strongly typed, robust input handling with custom validation and error messages.
- **Instant URL Shortening:** Real-time feedback, error handling, and loading indicators.
- **QR Code Generation:** For every short URL, enabling easy mobile access and sharing.
- **Animated Statistics:** Uptime, user count, and usage stats with smooth transitions.
- **Responsive Design:** Works seamlessly on all devices, including mobile and tablets.
- **Theme Detection & Switching:** Auto-detects system theme, allows manual switching, and updates browser UI color.
- **User Authentication:** Register, login, and personalized dashboard with session persistence.
- **Copy-to-Clipboard & Sharing:** Quick sharing options for users, with visual feedback.
- **Progressive Web App:** Installable on mobile and desktop, with offline support.
- **Accessibility:** Keyboard navigation, ARIA labels, and semantic HTML.

### Backend
- **RESTful API:** Modular, scalable endpoints for all core features, with clear separation of concerns.
- **MongoDB Atlas:** Cloud database for reliability, scalability, and easy backups.
- **API Key Authentication:** Secures all backend routes, with configurable keys.
- **Short URL Creation & Redirection:** Fast and reliable, with collision checks.
- **Click Tracking:** Tracks usage for analytics and user dashboards.
- **User Management:** Register, login, password reset, and user-specific URL stats.
- **Rate Limiting:** Protects against abuse, configurable per endpoint.
- **Environment Configuration:** Easy setup for development, staging, and production.
- **JWT Authentication:** Secure token issuance and validation for user sessions.
- **Error Handling & Logging:** Centralized error responses and logging for maintainability.

---

## 6. Tech Stack

- **Frontend:** React, TypeScript, Vite, Axios, Framer Motion, QRCode.react, React Hook Form
- **Backend:** Node.js, Express, Mongoose, nanoid, bcrypt, dotenv, compression, jsonwebtoken
- **Database:** MongoDB Atlas
- **Testing:** Jest, Supertest

---

## 8. API Endpoints

- `POST /api/login` - User login (returns JWT token and user info)
- `POST /api/register` - User registration
- `POST /api/shorten` - Shorten a long URL (requires authentication)
- `GET /:shortUrl` - Redirect to original URL
- `GET /api/stats` - Get usage statistics
- `POST /api/forgot-password` - Password reset
- `POST /api/user` - Get user info (requires JWT)
- All endpoints require an **API key** and most require a valid JWT token.

---

## 9. Security Considerations

- **API key required for all backend routes:**  
  Every request must include a valid API key in the headers, preventing unauthorized access.
- **Rate limiting and input validation to prevent abuse:**  
  Middleware restricts the number of requests per IP and validates all user input to prevent attacks.

---

## 10. Future Improvements

- Add custom expiration for URLs.
- Implement analytics dashboard for users.
- Enhance error handling and logging.
- Add support for social login (Google, GitHub, etc.).
- Improve accessibility and internationalization.
- Add email verification and password strength checks.
- Implement admin dashboard for managing users and URLs.
- Add support for custom short URLs.

---

## 11. Conclusion

ChopURL demonstrates a modern approach to building scalable, secure, and user-friendly web applications. The project provided valuable experience in full-stack development, authentication, API design, and responsive UI. It is open for contributions and further enhancements.

---

**End of Report**
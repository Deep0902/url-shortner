# URL Shortner

A simple URL shortener built with React (frontend) and Node.js/Express with MongoDB (backend).  
Features:
- Shorten long URLs to easy-to-share short links
- Track number of clicks per short URL
- QR code generation for each short URL
- API key authentication for backend endpoints
- Memory limit for stored URLs (demo purpose)

## Getting Started

### Backend
1. Install dependencies: `npm install`
2. Set up `.env` with your MongoDB Atlas connection and API key:
3. Start the server: `npm start`

### Frontend
1. Install dependencies: `npm install`
2. Set up `.env` with your API key:
3. Start the app: `npm run dev`

## Usage
- Enter a long URL and click "Shorten".
- Copy the generated short URL or scan the QR code.
- View stats for total URLs and clicks.

## Tech Stack
- Frontend: React, TypeScript, Axios
- Backend: Node.js, Express, Mongoose
- Database: MongoDB Atlas

## License
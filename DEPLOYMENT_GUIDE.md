# Movie Booking App - Full Stack Deployment Guide

## 🎬 Project Overview

A **BookMyShow-inspired** full-stack movie booking application built with:
- **Frontend**: React + React Router + Axios
- **Backend**: Node.js + Express.js + MongoDB
- **Database**: MongoDB Atlas (Cloud)
- **Deployment**: Vercel (Frontend) + Render (Backend)

---

## 📋 Prerequisites

1. **Node.js** (v14+) and npm installed
2. **Git** installed
3. **GitHub account** (for pushing code)
4. **MongoDB Atlas account** (free tier available)
5. **Vercel account** (free tier)
6. **Render account** (free tier)

---

## 🚀 Phase 1: Local Development & Testing

### Step 1: Setup MongoDB Locally (Optional - for testing)

Skip this if using MongoDB Atlas directly.

```powershell
# For Windows, download and install MongoDB Community Edition
# https://www.mongodb.com/try/download/community

# Or use Docker (if installed)
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Step 2: Backend Setup

```powershell
cd "C:\Users\raksh\OneDrive\Desktop\movie booking app\backend"

# Install dependencies
npm install

# Create .env file (copy from .env template)
# Edit .env with your values:
# MONGODB_URI=mongodb://127.0.0.1:27017/moviebooking  (local)
# PORT=5000
# JWT_SECRET=your_secret_key_here

# Seed the database with sample data
npm run seed

# Start the backend server
npm start
```

Expected output:
```
Connected to MongoDB
Server is running on port 5000
```

### Step 3: Frontend Setup

```powershell
cd "C:\Users\raksh\OneDrive\Desktop\movie booking app\frontend"

# Install dependencies
npm install

# Start the React dev server
npm start
```

Expected: Browser opens http://localhost:3000

### Step 4: Test Locally

1. **Register**: http://localhost:3000/register
   - Create a test user account
2. **Login**: http://localhost:3000/login
   - Use registered credentials
3. **Browse Movies**: View seeded movies on home page
4. **Book Seats**: Click a movie → Select show → Book seats
5. **View Bookings**: Click "My Bookings" to see booking history
6. **Admin Panel**: Login as `admin@example.com` / `Admin@123` → Click "Admin"
   - View all bookings
   - Add new movies

---

## ☁️ Phase 2: Cloud Deployment

### Step A: Setup MongoDB Atlas (Cloud Database)

1. **Create MongoDB Atlas Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up (free tier available)

2. **Create a Cluster**
   - Click "Create" → Select **M0 Sandbox (Free)**
   - Region: Choose closest to you (e.g., us-east-1)
   - Cluster Name: `moviebooking`

3. **Create Database User**
   - Go to **Database Access** → Add Database User
   - Username: `moviebookinguser`
   - Password: `YourSecurePassword123` (save this!)

4. **Whitelist IP Address**
   - Go to **Network Access**
   - Click "Add IP Address"
   - Select **Allow Access from Anywhere** (0.0.0.0/0) for development
   - ⚠️ For production: Whitelist specific IPs only

5. **Get Connection String**
   - Go to **Databases** → Click "Connect"
   - Choose **Drivers** → Select **Node.js**
   - Copy the connection string:
   ```
   mongodb+srv://moviebookinguser:YourSecurePassword123@moviebooking.xxxx.mongodb.net/?retryWrites=true&w=majority
   ```

---

### Step B: Deploy Backend to Render

1. **Push Code to GitHub**

   ```powershell
   cd "C:\Users\raksh\OneDrive\Desktop\movie booking app"
   git init
   git add .
   git commit -m "Initial commit"
   
   # Create repo on GitHub first, then:
   git remote add origin https://github.com/YOUR_USERNAME/movie-booking-app.git
   git branch -M main
   git push -u origin main
   ```

2. **Deploy to Render**

   - Go to https://dashboard.render.com/
   - Sign up with GitHub
   - Click **New +** → Select **Web Service**
   - Connect your GitHub repository
   - Configure:
     - **Name**: `movie-booking-backend`
     - **Runtime**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Root Directory**: `backend`

   - Add Environment Variables:
     ```
     MONGODB_URI = mongodb+srv://moviebookinguser:YourSecurePassword123@moviebooking.xxxx.mongodb.net/moviebooking?retryWrites=true&w=majority
     PORT = 5000
     JWT_SECRET = your_jwt_secret_key_here
     ```

   - Click **Create Web Service**
   - Wait for deployment (≈2-3 minutes)
   - Copy the **Deploy URL** (e.g., `https://movie-booking-backend.onrender.com`)

3. **Test Backend API**

   ```
   GET https://movie-booking-backend.onrender.com/
   Expected: "Welcome to the Movie Booking API!"
   
   GET https://movie-booking-backend.onrender.com/api/movies
   Expected: Array of movies from MongoDB Atlas
   ```

---

### Step C: Deploy Frontend to Vercel

1. **Update API Base URL**

   In `frontend/src/services/api.js`, change:
   ```javascript
   const API_BASE_URL = 'https://movie-booking-backend.onrender.com/api';
   ```

   Then commit and push to GitHub:
   ```powershell
   cd frontend
   git add src/services/api.js
   git commit -m "Update API base URL for production"
   git push
   ```

2. **Deploy to Vercel**

   - Go to https://vercel.com/
   - Sign up with GitHub
   - Click **Add New...** → Select **Project**
   - Import your GitHub repository
   - Configure:
     - **Framework Preset**: `Create React App`
     - **Root Directory**: `frontend`
   - Click **Deploy**
   - Wait for deployment (≈3-5 minutes)
   - Copy the **Deployment URL** (e.g., `https://movie-booking-app.vercel.app`)

3. **Enable CORS on Backend**

   Update `backend/server.js` to allow Vercel domain:
   ```javascript
   app.use(cors({
     origin: ['http://localhost:3000', 'https://movie-booking-app.vercel.app'],
     credentials: true
   }));
   ```

   Push to GitHub:
   ```powershell
   git add backend/server.js
   git commit -m "Allow Vercel domain in CORS"
   git push
   ```

   Render will auto-redeploy.

---

## 🏗️ Cloud Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Vercel)                        │
│          https://movie-booking-app.vercel.app              │
│  - React App (Home, Login, Booking, Admin Dashboard)       │
│  - Client-side routing with React Router                   │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/HTTPS (Axios)
                         │
┌────────────────────────▼────────────────────────────────────┐
│                   Backend (Render)                          │
│          https://movie-booking-backend.onrender.com        │
│  - Express.js REST API                                     │
│  - JWT Authentication                                      │
│  - CRUD operations for Movies, Shows, Bookings             │
└────────────────────────┬────────────────────────────────────┘
                         │ MongoDB Driver (Mongoose)
                         │
┌────────────────────────▼────────────────────────────────────┐
│               Database (MongoDB Atlas)                      │
│          Cloud-hosted MongoDB Cluster                       │
│  - Collections: Users, Movies, Shows, Bookings             │
│  - Indexed for fast queries                                │
│  - Automatic backups                                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 Environment Variables

### Backend (.env)
```env
# Database
MONGODB_URI=mongodb+srv://moviebookinguser:PASSWORD@moviebooking.xxxx.mongodb.net/moviebooking?retryWrites=true&w=majority

# Server
PORT=5000

# Authentication
JWT_SECRET=your_super_secret_key_12345
```

### Frontend (src/services/api.js)
```javascript
const API_BASE_URL = 'https://movie-booking-backend.onrender.com/api';
```

---

## 📊 API Endpoints (Production)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | - | Register user |
| POST | `/api/auth/login` | - | Login user |
| GET | `/api/movies` | - | Get all movies |
| GET | `/api/movies/:id` | - | Get movie details |
| POST | `/api/movies` | ✓ Admin | Create movie |
| PUT | `/api/movies/:id` | ✓ Admin | Update movie |
| DELETE | `/api/movies/:id` | ✓ Admin | Delete movie |
| GET | `/api/shows` | - | Get all shows |
| GET | `/api/shows/:id` | - | Get show details |
| POST | `/api/shows` | ✓ Admin | Create show |
| PUT | `/api/shows/:id` | ✓ Admin | Update show |
| DELETE | `/api/shows/:id` | ✓ Admin | Delete show |
| POST | `/api/bookings` | ✓ | Create booking |
| GET | `/api/bookings/user/:userId` | ✓ | Get user bookings |
| GET | `/api/bookings` | ✓ Admin | Get all bookings |

---

## ✅ Deployment Checklist

- [ ] MongoDB Atlas cluster created and data seeded
- [ ] Backend deployed to Render with correct environment variables
- [ ] Frontend deployed to Vercel with correct API base URL
- [ ] CORS enabled for Vercel domain on backend
- [ ] Test login/registration on production
- [ ] Test movie listing and booking flow
- [ ] Admin dashboard functional
- [ ] JWT token persists in localStorage
- [ ] Mobile responsiveness verified

---

## 📱 Features Delivered

### User Side
✅ Registration & Login (JWT-based)
✅ Browse movies by language/genre
✅ View movie details (description, duration, rating)
✅ Select shows (date & time)
✅ Seat selection grid (8 rows × 10 seats)
✅ Booking confirmation with price calculation
✅ Booking history (view past bookings)
✅ Logout

### Admin Side
✅ Admin login (special user role)
✅ Add/Edit/Delete movies
✅ Add/Edit/Delete shows
✅ View all bookings
✅ User management (optional: add more roles)

### Technical
✅ Cloud database (MongoDB Atlas)
✅ JWT authentication
✅ REST APIs with proper status codes
✅ Error handling & validation
✅ Responsive UI (BookMyShow-inspired)
✅ Production-ready deployment

---

## 🐛 Troubleshooting

### Backend deployment fails on Render
- Check environment variables are set correctly
- Verify MongoDB Atlas IP whitelist includes Render servers
- Check Render logs for detailed error messages

### Frontend can't connect to backend
- Verify API_BASE_URL in `src/services/api.js` is correct
- Check CORS is enabled on backend for Vercel domain
- Verify backend is running on Render (check status)

### Login/Register fails
- Check MongoDB connection string is correct
- Verify JWT_SECRET is set on backend
- Check browser console for API error details

### Bookings not saving
- Verify user is authenticated (token in localStorage)
- Check MongoDB booking collection has proper indexes
- Review backend error logs on Render

---

## 📚 Learning Resources

- **Viva Topics**:
  1. What is JWT? Why use it?
  2. What is MongoDB Atlas? Benefits?
  3. How does Render differ from traditional hosting?
  4. What is CORS? Why is it needed?
  5. How does React Router work?
  6. What is a REST API? How do you design one?

- **Additional Reading**:
  - Render Docs: https://render.com/docs
  - Vercel Docs: https://vercel.com/docs
  - MongoDB Atlas Docs: https://www.mongodb.com/docs/atlas/

---

## 🚀 Production Best Practices (For Later)

1. Add rate limiting to prevent abuse
2. Implement password reset (forgot password)
3. Add email verification for registration
4. Implement payment gateway (Stripe/Razorpay)
5. Add real-time seat availability updates (WebSockets)
6. Implement admin analytics & reporting
7. Add logging & monitoring (e.g., Sentry)
8. Use environment-specific configurations
9. Implement automated tests (Jest, Cypress)
10. Setup CI/CD pipeline (GitHub Actions)

---

## 📞 Support

For issues during deployment:
1. Check Render deployment logs
2. Check Vercel deployment logs
3. Check MongoDB Atlas activity logs
4. Review error messages in browser console

---

**Happy Deploying! 🎉**

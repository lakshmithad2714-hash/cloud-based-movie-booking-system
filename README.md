# 🎬 Movie Booking App - Cloud Computing Project

A full-stack **BookMyShow-inspired** movie booking application built for cloud computing and deployment education.

## 🌟 Features

### For Users
- 🔐 User authentication (Register/Login with JWT)
- 🎬 Browse movies by language and genre
- 📽️ View detailed movie information
- 🎟️ Select showtimes (date & time)
- 💺 Interactive seat selection (8×10 grid)
- 💰 Instant price calculation
- 📋 Booking history tracking
- 🔓 Secure logout

### For Admins
- 👨‍💼 Admin dashboard access
- ➕ Add new movies
- ✏️ Edit/Delete movies
- 📌 Manage showtimes
- 📊 View all bookings
- 👥 User bookings analytics

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19 + React Router 6 + Axios |
| **Backend** | Node.js + Express.js 5 |
| **Database** | MongoDB + Mongoose ODM |
| **Auth** | JWT (JSON Web Tokens) + bcryptjs |
| **Deployment** | Vercel (Frontend) + Render (Backend) + MongoDB Atlas |
| **Styling** | Plain CSS (BookMyShow-inspired) |

---

## 📂 Project Structure

```
movie booking app/
├── frontend/                      # React App
│   ├── src/
│   │   ├── components/            # Reusable components
│   │   │   └── Header.js
│   │   ├── pages/                 # Route pages
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Home.js
│   │   │   ├── MovieDetails.js
│   │   │   ├── Booking.js
│   │   │   ├── BookingHistory.js
│   │   │   └── AdminDashboard.js
│   │   ├── services/              # API calls
│   │   │   └── api.js
│   │   ├── styles/                # CSS files
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   │   └── index.html
│   └── package.json
│
├── backend/                       # Express Server
│   ├── models/                    # Mongoose schemas
│   │   ├── User.js
│   │   ├── Movie.js
│   │   ├── Show.js
│   │   └── Booking.js
│   ├── controllers/               # Business logic
│   │   ├── authController.js
│   │   ├── movieController.js
│   │   ├── showController.js
│   │   └── bookingController.js
│   ├── routes/                    # API routes
│   │   ├── authRoutes.js
│   │   ├── movieRoutes.js
│   │   ├── showRoutes.js
│   │   └── bookingRoutes.js
│   ├── middleware/                # auth, admin checks
│   │   ├── auth.js
│   │   └── admin.js
│   ├── server.js                  # Express server
│   ├── seed.js                    # Database seeding
│   ├── .env                       # Environment variables
│   └── package.json
│
└── DEPLOYMENT_GUIDE.md            # Cloud deployment steps
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js v14+
- npm or yarn
- MongoDB (local or Atlas)
- Git

### Setup & Run

**1. Backend Setup**
```powershell
cd backend
npm install

# Create .env file with:
# MONGODB_URI=mongodb://127.0.0.1:27017/moviebooking
# PORT=5000
# JWT_SECRET=your_secret_key

npm run seed       # Seed sample data
npm start          # Start on port 5000
```

**2. Frontend Setup** (in a new terminal)
```powershell
cd frontend
npm install
npm start          # Opens http://localhost:3000
```

**3. Test the App**
- Register at http://localhost:3000/register
- Login with your credentials
- Browse and book movies
- Admin login: `admin@example.com` / `Admin@123`

---

## 📡 API Overview

### Auth
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login user

### Movies (CRUD)
- `GET /api/movies` - List all movies
- `GET /api/movies/:id` - Get movie details
- `POST /api/movies` - Add movie (admin only)
- `PUT /api/movies/:id` - Edit movie (admin only)
- `DELETE /api/movies/:id` - Delete movie (admin only)

### Shows
- `GET /api/shows` - List shows
- `POST /api/shows` - Add show (admin only)

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/user/:userId` - User's bookings
- `GET /api/bookings` - All bookings (admin only)

---

## ☁️ Cloud Deployment

See **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** for detailed instructions on:

1. **MongoDB Atlas Setup** (Cloud Database)
2. **Backend Deployment to Render**
3. **Frontend Deployment to Vercel**
4. **Environment Configuration**
5. **Troubleshooting & Best Practices**

**Quick Links:**
- Frontend URL: `https://movie-booking-app.vercel.app` (after deployment)
- Backend URL: `https://movie-booking-backend.onrender.com` (after deployment)
- Database: MongoDB Atlas (cloud-hosted)

---

## 📚 Key Concepts (For Viva/Interview)

### JWT Authentication
- Tokens stored in `localStorage`
- Attached to API requests via `Authorization: Bearer <token>` header
- Verifies user identity without server-side sessions
- Tokens expire after 7 days

### MongoDB & Mongoose
- **Collections**: Users, Movies, Shows, Bookings
- **Relationships**: Shows reference Movies, Bookings reference Users/Shows
- **Indexes**: Email (unique), userId (for fast lookups)
- **Validation**: Mongoose schemas enforce data integrity

### REST API Design
- **Stateless**: Each request is independent
- **HTTP Methods**: GET (read), POST (create), PUT (update), DELETE (remove)
- **HTTP Status Codes**: 200 (OK), 201 (Created), 400 (Bad), 401 (Unauthorized), 404 (Not Found), 500 (Server Error)
- **Error Handling**: Consistent JSON error responses

### Middleware
- **auth.js**: Verifies JWT token before allowing access to protected routes
- **admin.js**: Checks if user has admin role
- Used in route definitions to enforce permissions

### React Hooks
- `useState`: Manage component state
- `useEffect`: Fetch data on component mount
- `useParams`: Extract URL parameters
- `useNavigate`: Programmatic navigation

### CORS (Cross-Origin Resource Sharing)
- Allows frontend (different domain) to access backend API
- Configured in `backend/server.js`
- Whitelists specific domains for security

---

## 🎨 UI/UX Design

- **Color Scheme**: Red (#ef4444), Dark (#0f1724), White
- **Layout**: Grid-based movie cards, responsive design
- **Components**: Header (nav), Cards (movies), Forms (login/booking), Tables (admin)
- **Mobile-Friendly**: CSS media queries (implemented in styles)

---

## 🔒 Security Features

✅ Password hashing with bcryptjs
✅ JWT-based stateless authentication
✅ Protected routes (auth middleware)
✅ Admin role-based access control
✅ MongoDB Atlas IP whitelisting
✅ Environment variables for secrets
✅ Input validation on backend

---

## 🧪 Testing Scenarios

### User Workflow
1. Register new account
2. Login with credentials
3. Browse home page (list of movies)
4. Click movie → See shows
5. Select show → Book seats
6. Confirm booking → See confirmation
7. View booking history
8. Logout

### Admin Workflow
1. Login as admin@example.com / Admin@123
2. Go to Admin Dashboard
3. Add new movie
4. View all bookings
5. Delete a movie

---

## 📝 Database Schema

### Users Collection
```json
{
  "_id": ObjectId,
  "name": "John Doe",
  "email": "john@example.com",
  "passwordHash": "bcrypt_hash",
  "isAdmin": false,
  "createdAt": "2026-02-10T..."
}
```

### Movies Collection
```json
{
  "_id": ObjectId,
  "title": "Inception",
  "language": "English",
  "genre": ["Sci-Fi", "Thriller"],
  "description": "A thief who steals corporate secrets...",
  "duration": 148,
  "rating": 8.8,
  "createdAt": "2026-02-10T..."
}
```

### Shows Collection
```json
{
  "_id": ObjectId,
  "movie": ObjectId (ref: Movie),
  "date": "2026-02-14T...",
  "startTime": "18:00",
  "screen": "Screen 1",
  "totalSeats": 80,
  "price": 120
}
```

### Bookings Collection
```json
{
  "_id": ObjectId,
  "user": ObjectId (ref: User),
  "show": ObjectId (ref: Show),
  "movie": ObjectId (ref: Movie),
  "seats": ["A1", "A2", "A3"],
  "totalPrice": 360,
  "status": "booked",
  "createdAt": "2026-02-10T..."
}
```

---

## 🐛 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Cannot GET /api/movies" | Backend not running or API not mounted |
| "Network error" | Check if frontend & backend URLs match |
| "Invalid token" | Clear localStorage & login again |
| "CORS error" | Add frontend URL to CORS in backend |
| "No movies showing" | Run `npm run seed` to populate database |

---

## 📦 Dependencies

### Frontend
```json
{
  "react": "^19.2.4",
  "react-dom": "^19.2.4",
  "react-router-dom": "^6.15.0",
  "axios": "^1.13.5",
  "react-scripts": "^5.0.1"
}
```

### Backend
```json
{
  "express": "^5.2.1",
  "mongoose": "^7.5.0",
  "jsonwebtoken": "^9.1.0",
  "bcryptjs": "^2.4.3",
  "cors": "^2.8.6",
  "dotenv": "^16.3.1"
}
```

---

## 🎓 Learning Outcomes

After completing this project, you'll understand:

1. **Frontend**: React ecosystem, routing, state management, API integration
2. **Backend**: Express server, middleware, controllers, routes, error handling
3. **Database**: MongoDB schema design, relationships, indexing
4. **Authentication**: JWT tokens, password hashing, protected routes
5. **Cloud**: Deploying apps to production (Vercel, Render, MongoDB Atlas)
6. **DevOps**: Environment variables, Git/GitHub, CI/CD concepts

---

## 🤝 Contributing

This is an educational project. Feel free to:
- Add more features (real payment gateway, WebSockets, etc.)
- Improve UI with animations
- Add unit/integration tests
- Optimize database queries

---

## 📄 License

MIT License - Free to use and modify

---

## 🎯 Next Steps

1. ✅ Run locally and test all features
2. ✅ Follow [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for cloud deployment
3. ✅ Share links with friends
4. ✅ Deploy improvements
5. ✅ Prepare viva/interview questions

---

**Built with ❤️ for Cloud Computing Learning**

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Movie = require('./models/Movie');
const Show = require('./models/Show');
const Booking = require('./models/Booking');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/moviebooking';

async function seed() {
  await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB for seeding');

  // Clear existing data (careful in production)
  await User.deleteMany({});
  await Movie.deleteMany({});
  await Show.deleteMany({});
  await Booking.deleteMany({});

  // Create admin user
  const adminPassword = 'Admin@123';
  const admin = await User.create({
    name: 'Admin',
    email: 'admin@example.com',
    password: adminPassword,
    phone: '9999999999',
    role: 'admin',
    isAdmin: true
  });

  // Sample movies
  const movies = await Movie.insertMany([
    { title: 'Inception', language: 'English', genre: ['Sci-Fi', 'Thriller'], description: 'A thief who steals corporate secrets...', duration: 148, rating: 8.8, posterUrl: '/images/posters/inception.svg', releaseDate: new Date('2010-07-16') },
    { title: 'The Dark Knight', language: 'English', genre: ['Action', 'Drama'], description: 'Batman raises the stakes...', duration: 152, rating: 9.0, posterUrl: '/images/posters/dark-knight.svg', releaseDate: new Date('2008-07-18') },
    { title: 'Interstellar', language: 'English', genre: ['Sci-Fi', 'Adventure'], description: 'A team of explorers travel through a wormhole...', duration: 169, rating: 8.6, posterUrl: '/images/posters/interstellar.svg', releaseDate: new Date('2014-11-07') }
  ]);

  // Create 1-2 shows per movie
  const shows = [];
  for (const m of movies) {
    shows.push(await Show.create({ movie: m._id, date: new Date(), startTime: '18:00', screen: 'Screen 1', totalSeats: 80, price: 120 }));
    shows.push(await Show.create({ movie: m._id, date: new Date(), startTime: '21:00', screen: 'Screen 2', totalSeats: 80, price: 150 }));
  }

  // Create a sample user and one booking for demonstration
  const demoPassword = 'User@123';
  const demoUser = await User.create({
    name: 'lakshmiha',
    email: 'lakshmiha@example.com',
    password: demoPassword,
    phone: '8888888888',
    isAdmin: false
  });

  if (shows.length > 0) {
    await Booking.create({ user: demoUser._id, show: shows[0]._id, movie: movies[0]._id, seats: ['A1', 'A2'], totalPrice: shows[0].price * 2, status: 'booked' });
  }

  console.log('Seeding completed. Created admin:', admin.email);
  console.log('Sample movies:', movies.map(m => m.title));
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error('Seeding error', err);
  process.exit(1);
});

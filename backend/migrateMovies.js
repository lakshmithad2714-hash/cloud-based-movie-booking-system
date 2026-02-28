require('dotenv').config();
const mongoose = require('mongoose');
const Movie = require('./models/Movie');

const cities = ["Bangalore", "Chennai", "Mumbai"];

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    console.log('Connected to MongoDB');
    const movies = await Movie.find({});

    for (let i = 0; i < movies.length; i++) {
        const movie = movies[i];

        // Set poster properly
        if (movie.posterUrl && !movie.poster) {
            movie.poster = movie.posterUrl;
        }

        // Set an exact City property if not found
        if (!movie.city || !cities.includes(movie.city)) {
            movie.city = cities[i % cities.length];
        }

        await movie.save();
        console.log(`Updated ${movie.title} with City: ${movie.city}`);
    }

    console.log('Migration complete');
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});

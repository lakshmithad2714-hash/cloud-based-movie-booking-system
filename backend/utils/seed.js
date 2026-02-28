const Movie = require("../models/Movie");

const seedMovies = async () => {
    try {
        const count = await Movie.countDocuments();

        if (count === 0) {
            console.log("No movies found. Seeding data...");

            await Movie.insertMany([
                {
                    title: "Kantara",
                    city: "Bangalore",
                    language: "Kannada",
                    poster: "https://image.tmdb.org/t/p/w500/u9bRzzGtbV6T7hXy.jpg"
                },
                {
                    title: "Leo",
                    city: "Chennai",
                    language: "Tamil",
                    poster: "https://image.tmdb.org/t/p/w500/leo.jpg"
                },
                {
                    title: "Pathaan",
                    city: "Mumbai",
                    language: "Hindi",
                    poster: "https://image.tmdb.org/t/p/w500/pathaan.jpg"
                }
            ]);

            console.log("Movies seeded successfully.");
        }
    } catch (error) {
        console.error("Error seeding movies:", error);
    }
};

module.exports = seedMovies;

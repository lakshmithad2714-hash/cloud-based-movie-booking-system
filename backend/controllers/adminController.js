const Booking = require('../models/Booking');

// GET /api/admin/stats - Admin dashboard statistics
const getAdminStats = async (req, res) => {
    try {
        const totalBookings = await Booking.countDocuments({ status: 'Booked' });
        const cancelledBookings = await Booking.countDocuments({ status: 'Cancelled' });

        const bookedMoviesList = await Booking.find({ status: 'Booked' })
            .populate('user', 'email')
            .sort({ createdAt: -1 });

        const cancelledMoviesList = await Booking.find({ status: 'Cancelled' })
            .sort({ createdAt: -1 });

        res.status(200).json({
            totalBookings,
            cancelledBookings,
            bookedMoviesList: bookedMoviesList.map(b => ({
                id: b._id,
                title: b.movieTitle,
                seats: b.seats.join(', '),
                showTime: b.showTime,
                userEmail: b.email || b.user?.email,
                amount: b.totalPrice,
                status: b.status
            })),
            cancelledMoviesList: cancelledMoviesList.map(b => ({
                title: b.movieTitle,
                seats: b.seats.join(', '),
                cancelDate: b.updatedAt
            }))
        });
    } catch (err) {
        console.error('BACKEND: GET ADMIN STATS ERROR:', err);
        res.status(500).json({ error: 'Failed to fetch admin stats' });
    }
};

module.exports = { getAdminStats };

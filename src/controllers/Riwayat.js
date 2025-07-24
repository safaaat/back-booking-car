import Booking from "../models/BookingModel.js";
import Riwayat from "../models/Riwayat.js";

export const getRiwayat = async (req, res) => {
    try {
        const riwayats = await Riwayat.findAll();

        return res.status(200).json(riwayats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const CheckBooking = async () => {
    const bookings = await Booking.findAll();
    const now = Math.floor(Date.now() / 1000); // waktu sekarang dalam detik

    const completedBookings = bookings
        .filter((booking) => now > booking.end_time)
        .map((booking) => booking.toJSON());

    completedBookings.map((data) => {
        Riwayat.create({
            id_booking: data.id,
            id_car: data.id_car,
            name_car: data.name_car,
            is_confirmed: data.is_confirmed,
            url_images: data.url_images,
            name_user: data.name_user,
            email: data.email,
            phone_number: data.phone_number,
            start_time: data.start_time,
            end_time: data.end_time
        })
    })
}
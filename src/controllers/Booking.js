import Booking from "../models/BookingModel.js";
import Car from "../models/CarModel.js";

export const getBooking = async (req, res) => {
    try {
        const bookings = await Booking.findAll();

        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const postBooking = async (req, res) => {
    const { id_car, is_confirmed, name_car, url_images, name_user, email, phone_number, start_time, end_time } = req.body;

    try {
        // Check apakah ada Car
        const cars = await Car.findOne({ where: { id: id_car } });
        if (!cars) return res.status(400).json({ message: "tidak memiliki car" });


        // Check apakah nama,email,number phone,start_time and end_time tidak boleh kosong
        if (!name_user) return res.status(400).json({ message: "name tidak boleh kosong" });
        if (!email) return res.status(400).json({ message: "email tidak boleh kosong" });
        if (!phone_number) return res.status(400).json({ message: "number phone tidak boleh kosong" });
        if (!start_time) return res.status(400).json({ message: "Waktu mulai booking tidak boleh kosong." });
        if (!end_time) return res.status(400).json({ message: "Waktu selesai booking tidak boleh kosong." });

        const carsByName = await Booking.findOne({
            where: {
                name_user: name_user,
                id_car: id_car
            }
        });
        if (carsByName) return res.status(400).json({ message: "Anda sudah melakukan booking untuk mobil ini." });

        const carsByConfirmed = await Booking.findOne({
            where: {
                id_car: id_car,
                is_confirmed: true
            }
        });
        if (carsByConfirmed) return res.status(400).json({ message: "Mobil ini sudah di booking" })

        await Booking.create({ id_car, is_confirmed, name_car, url_images, name_user, email, phone_number, start_time, end_time })

        res.status(200).json({ message: `${name_user} anda berhasil booking car. Tunggu confirmasi admin` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const confirmasiBooking = async (req, res) => {
    const { id, } = req.params
    const { id_car } = req.body

    try {
        const bookings = await Booking.findOne({ where: { id } });
        if (!bookings) return res.status(400).json({ message: "tidak memiliki booking car." });
        if (bookings.is_confirmed) return res.status(400).json({ message: "booking car ini sudah di confirmasi." })

        const bookingByIdCar = await Booking.findAll({
            where: {
                id_car: id_car
            }
        })
        if (bookingByIdCar.length >= 1) {
            const is_confirmed = true;
            await Booking.update(
                { is_confirmed },
                { where: { id } }
            )

            await Booking.destroy({
                where: {
                    id_car: req.body.id_car,
                    is_confirmed: false
                }
            });

            return res.status(200).json({ message: "Booking car berhasil dikonfirmasi." })
        }

        const is_confirmed = true;
        await Booking.update(
            { is_confirmed },
            { where: { id } }
        )

        res.status(200).json({ message: "Booking car berhasil dikonfirmasi." })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const removeBookings = async (req, res) => {
    const { id } = req.params;

    try {
        const bookings = await Booking.findOne({
            where: {
                id: id,
                is_confirmed: false
            }
        });
        if (!bookings) return res.status(400).json({ message: "data booking tidak ada" });

        await bookings.destroy({ where: { id } });

        res.status(200).json({ message: "hapus data booking success" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
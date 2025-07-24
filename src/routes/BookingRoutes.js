import express from "express";
import { getBooking, postBooking, confirmasiBooking, removeBookings } from "../controllers/Booking.js";

const router = express.Router();

router.get("/booking", getBooking);
router.post("/booking", postBooking);
router.patch("/confirmasi_booking/:id", confirmasiBooking);
router.delete("/booking/remove/:id", removeBookings);

export default router;
import cron from "node-cron";
import { CheckBooking } from "../controllers/Riwayat.js";

// Jalankan setiap hari jam 00:00
cron.schedule("0 0 * * *", async () => {
    console.log("Running scheduled CheckBooking at 00:00");
    await CheckBooking(); // gunakan versi yang tidak pakai req/res
});

//Jalankan saat server start
CheckBooking();
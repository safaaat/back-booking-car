import express from "express";
import cors from "cors";
import dotenv from "dotenv";
<<<<<<< HEAD
// import { CarRoutes } from "./routers/Index.js";
import db from "./config/database.js";
=======
import database from "./src/config/database.js";
import { CarRoutes, BookingRoutes, AdminRoutes, RiwayatRoutes } from "./src/routes/Index.js";
import { fileURLToPath } from "url";
import path from "path";
// import "./schedulers/BookingScheduler.js";
>>>>>>> db9d238 (create SCR)

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());

// Jika kamu mau lebih spesifik:
app.use(cors({
    origin: process.env.URL_FRON_END, // frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// Tes koneksi DB saat server start
try {
    await db.authenticate();
    console.log("✅ Database connected");
} catch (error) {
    console.error("❌ Gagal konek DB:", error.message);
}

<<<<<<< HEAD
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// // Router
// app.use(CarRoutes);
=======
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/images", express.static(path.join(__dirname, "src/public/images")));
>>>>>>> db9d238 (create SCR)

app.get("/", (req, res) => {
    res.send("Hello World");
})

app.listen(PORT, () => {
    console.log(`run Server ${PORT}`)
})
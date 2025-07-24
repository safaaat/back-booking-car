import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { CarRoutes } from "./routers/Index.js";

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

app.get("/", (req, res) => {
    res.send("Hello World");
})

// Router
app.use(CarRoutes);

app.listen(PORT, () => {
    console.log(`run Server ${PORT}`)
})
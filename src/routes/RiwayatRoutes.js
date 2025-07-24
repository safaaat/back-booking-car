import express from "express";
import { getRiwayat } from "../controllers/Riwayat.js";

const router = express.Router();

router.get("/riwayat", getRiwayat);

export default router;
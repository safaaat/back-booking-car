import express from "express";
import { login, register } from "../controllers/Admin.js";

const router = express.Router();

router.post("/admin/register", register);
router.post("/admin/login", login);

export default router;
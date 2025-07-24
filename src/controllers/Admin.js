import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";

export const login = async (req, res) => {
    const { password } = req.body

    try {
        const admin = await Admin.findOne();
        const isMatch = await bcrypt.compare(String(password), admin.password);
        if (!isMatch) return res.status(400).json({ message: "password yang anda masukan salah" });

        const adminNoPass = await Admin.findOne({
            attributes: { exclude: ['password'] }
        });
        res.status(200).json(adminNoPass);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const register = async (req, res) => {
    const { password } = req.body;

    try {
        const admin = await Admin.findOne();
        if (admin) return res.status(400).json({ message: "admin tidak boleh lebih dari 1" })

        // const pass = password.string();
        const hashedPassword = await bcrypt.hash(String(password), 10);

        await Admin.create({ password: hashedPassword });

        res.status(200).json({ message: "register success" })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
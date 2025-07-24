import multer from "multer";
import sharp from "sharp";
import path from "path";
import Car from "../models/CarModel.js";
import * as fs from 'node:fs/promises';

const TYPE_IMAGE = {
    "image/jpg": "jpg",
    "image/jpeg": "jpeg",
    "image/png": "png",
}

const fileFilter = (req, file, cb) => {
    const acceptMime = Object.keys(TYPE_IMAGE);

    if (!acceptMime.includes(file.mimetype)) {
        const error = new multer.MulterError("INAPPROPRIATE_FILE_FORMAT");
        error.field = file.fieldname;
        return cb(error, false);
    } else {
        cb(null, true);
    }
}

const maxSize = 1 * 1024 * 1024; //1MB

export const uploadFile = multer({
    fileFilter,
    limits: { fileSize: maxSize }
}).fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
    { name: "image5", maxCount: 1 },
]);

// Middleware khusus untuk menangani batasan ukuran file
export const handleFileUploadSizeLimit = (err, req, res, next) => {
    // err instanceof multer.MulterError = untuk check apakah multer memiliki error
    if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
            res.status(400).json({ message: `Ukuran file ${err.field} terlalu besar. Maksimum 1MB diizinkan.` });
        } else if (err.code === "INAPPROPRIATE_FILE_FORMAT") {
            res.status(400).json({ message: "format gambar tidak sesuai. Hanya format JPG, JPEG, atau PNG yang diizinkan." });
        } else {
            res.status(500).json({ error: "Terjadi kesalahan dalam mengunggah file." });
        }
    } else {
        next(err);
    }
};

// Middleware untuk handle apakah users sudah upload name and image
export const checkImageAndName = async (req, res, next) => {
    const { name } = req.body;

    const cars = await Car.findOne({ where: { name } });

    // Check Input name and files
    if (cars) return res.status(400).json({ message: "Nama mobil sudah di gunakan" });
    if (!name) return res.status(400).json({ message: "Name car harus di isi" });
    if (!req.files["image1"]) return res.status(400).json({ message: "Image tidak boleh kosong" });

    next();
}

// Fungsi middleware untuk mengubah format gambar menjadi WebP setelah diunggah
export const processImages = async (req, res, next) => {
    try {
        // Lakukan pengolahan gambar untuk setiap field
        const imageFields = ["image1"];
        let imageWebp;
        let urlWebp;

        for (const field of imageFields) {
            if (req.files[field]) {
                // Ambil path file yang diunggah
                const imagePath = req.files[field][0].buffer;
                // Random uuid
                const uuid = crypto.randomUUID();
                const fileName = `${new Date().getTime() + uuid}.webp`

                // Lakukan proses dengan sharp untuk mengonversi ke format WebP
                await sharp(imagePath)
                    .webp() // Konversi ke format WebP
                    .toFile(path.join("public/images/car", fileName));

                const newImage = { [field]: fileName }
                const newUrl = { [field]: `images/car/${fileName}` }

                imageWebp = { ...imageWebp, ...newImage };
                urlWebp = { ...urlWebp, ...newUrl };
            }
        }

        req.newImages = imageWebp;
        req.newUrl = urlWebp;
        // Lanjutkan ke middleware berikutnya atau route handler
        next();
    } catch (error) {
        // Tangani kesalahan jika ada
        console.error("Error processing images:", error);
        return res.status(500).send("Internal Server Error");
    }
}

export const getImageNamesFromId = async (req, res, next) => {
    let arrayImage = [];

    for (const arrayId of req.body.arrayId) {
        const cars = await Car.findOne({
            where: {
                id: arrayId
            }
        });
        const imagesAll = JSON.parse(cars.image);
        const array = Object.values(imagesAll);
        arrayImage = [...arrayImage, ...array];
    };

    req.arrayRemoveImage = arrayImage;

    next()
}

export const loopRemoveImage = async (req, res, next) => {
    for (const element of req.arrayRemoveImage) {
        await fs.unlink(`./public/images/car/${element}`);
    }

    req.newArrayImage = req.newArrayImage;
    req.newArrayUrl = req.newArrayUrl;
    next();
}

export const validateCarRequest = async (req, res, next) => {
    const { id, name } = req.body;

    if (!id) return res.status(400).json({ message: "id harus di isi" });
    if (!name) return res.status(400).json({ message: "name car harus di isi" });

    const car = await Car.findOne({
        where: {
            id: Number(id)
        }
    });
    if (!car) return res.status(400).json({ message: "tidak memiliki car" });

    next()
}
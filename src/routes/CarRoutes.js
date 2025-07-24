import express from "express";
import { getCar, postCar, removeCar, editCar } from "../controllers/Cars.js";
import { uploadFile, handleFileUploadSizeLimit, checkImageAndName, processImages, getImageNamesFromId, loopRemoveImage, validateCarRequest } from "../middleware/CarMiddleware.js";

const router = express.Router();

router.get("/car", getCar);
router.post("/car", uploadFile, handleFileUploadSizeLimit, checkImageAndName, processImages, postCar);
router.delete("/car/remove", getImageNamesFromId, loopRemoveImage, removeCar);
router.patch("/car/edit", uploadFile, handleFileUploadSizeLimit, validateCarRequest, editCar);

export default router;
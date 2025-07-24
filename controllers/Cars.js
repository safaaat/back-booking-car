import Car from "../models/CarModel.js";

export const getCar = async (req, res) => {
    try {
        const cars = await Car.findAll();

        res.status(200).json(cars);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const postCar = async (req, res) => {
    const { name } = req.body;

    const image = JSON.stringify(req.newImages);
    const url = JSON.stringify(req.newUrl);

    try {
        const cars = await Car.findOne({
            where: {
                name: name
            }
        });

        if (cars) return res.status(401).json({ message: "name already in use" })

        await Car.create({ name, image, url });

        res.status(200).json({ message: "add car success" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const removeCar = async (req, res) => {
    const { arrayId } = req.body;

    try {
        await Car.destroy({
            where: {
                id: arrayId
            }
        });

        res.status(200).json({ message: "Remove car success" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const editCar = async (req, res) => {
    const { arrayId } = req.body

    try {
        res.status(200).json({ message: "Edit car success" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
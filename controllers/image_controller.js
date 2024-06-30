const path = require('path');
const fs = require('fs');
const getRandomImage = require('../libs/image_access');

const getImageByCity = async (req, res) => {
    const city = req.query.city ? req.query.city.toLowerCase() : null;
    const id = req.query.id ? req.query.id.toLowerCase() : null; 

    if (!city) {
        const defaultImagePath = path.join(__dirname, '../public/images/destination/default.jpeg');
        return res.sendFile(defaultImagePath);
    }

    try {
        const imagePath = path.join(__dirname, '../public/images/destination', city);
        await fs.promises.access(imagePath, fs.constants.F_OK);

        if (id) {
            const specificImagePath = path.join(imagePath, `${id}.jpeg`);
            try {
                await fs.promises.access(specificImagePath, fs.constants.F_OK);
                return res.sendFile(specificImagePath);
            } catch (err) {
                console.log(`File dengan ID ${id} tidak ditemukan, mengambil gambar acak.`);
            }
        }

        const randomImage = await getRandomImage(imagePath);
        res.sendFile(randomImage);
    } catch (err) {
        const defaultImagePath = path.join(__dirname, '../public/images/destination/default.jpeg');
        res.sendFile(defaultImagePath);
    }
};

module.exports = {
    getImageByCity
};

const path = require('path');
const fs = require('fs');
const getRandomImage = require('../libs/image_access');

const getImageByCity = async (req, res) => {
    const city = req.query.city.toLowerCase();
    const id = req.query.city.toLowerCase();
    try {
        const imagePath = path.join(__dirname, '../public/images/destination', city);
        await fs.promises.access(imagePath, fs.constants.F_OK);

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

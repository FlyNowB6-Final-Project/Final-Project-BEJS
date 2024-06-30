const path = require('path');
const fs = require('fs');

function getRandomImage(cityPath) {
    return new Promise((resolve, reject) => {
        fs.readdir(cityPath, (err, files) => {
            if (err || files.length === 0) {
                reject(err || new Error('Folder kosong'));
            } else {
                const randomIndex = Math.floor(Math.random() * files.length);
                const randomImage = path.join(cityPath, files[randomIndex]);
                resolve(randomImage);
            }
        });
    });
}

module.exports = getRandomImage;

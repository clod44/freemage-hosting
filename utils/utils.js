const path = require('path');
const fs = require('fs');

function getUploadedImageCount() {
    const directoryPath = path.join(__dirname, '../uploads');
    try {
        const files = fs.readdirSync(directoryPath);
        return files.length;
    } catch (error) {
        console.error('Error reading directory:', error);
        return 0;
    }
}
let uploadedImageCount = getUploadedImageCount()
module.exports = {
    uploadedImageCount
};

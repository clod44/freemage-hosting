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



function c(text="", err = false) {
    if(text.length == 0) {
        console.log()
        return;
    }
    const currentDate = new Date().toLocaleString();
    const logMessage = `[${currentDate}] : ${text}`;
    if(err){
        console.error(logMessage);
    }else{
        console.log(logMessage);
    }
}


module.exports = {
    c,
    uploadedImageCount
};

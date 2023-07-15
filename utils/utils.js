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



const logsDirectory = path.join(__dirname, '..', 'logs');
let currentDate = new Date().toISOString().replace(/:/g, '-').replace(/T/g, '_').split('.')[0];
const logFileName = `logs_${currentDate}_UTC.txt`;
const logFilePath = path.join(logsDirectory, logFileName);

// Create the logs directory if it doesn't exist
if (!fs.existsSync(logsDirectory)) {
    fs.mkdirSync(logsDirectory);
}

// Create the log file if it doesn't exist
if (!fs.existsSync(logFilePath)) {
    fs.writeFileSync(logFilePath, '');
}
const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });

// Save a reference to the original console.log and console.error functions
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

// Override console.log
console.log = function (...args) {
    if (args.length === 0) {
        originalConsoleLog();
        logStream.write('\n');
        return;
    }

    const date = new Date();
    const datePart = date.toLocaleDateString('en-GB');
    const timePart = date.toLocaleTimeString('en-GB');
    const logMessage = `[LOG] [${datePart} - ${timePart}] : ${args.join(' ')}`;

    logStream.write(logMessage + '\n');
    originalConsoleLog(logMessage);
};

// Override console.error
console.error = function (...args) {
    if (args.length === 0) {
        originalConsoleError();
        logStream.write('\n');
        return;
    }

    const date = new Date();
    const datePart = date.toLocaleDateString('en-GB');
    const timePart = date.toLocaleTimeString('en-GB');
    const logMessage = `[ERROR] [${datePart} - ${timePart}] : ${args.join(' ')}`;

    logStream.write(logMessage + '\n');
    originalConsoleError(logMessage);
};


module.exports = {
    uploadedImageCount
};

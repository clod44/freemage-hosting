let {uploadedImageCount} = require('../utils/utils')
let onlineCount = 0;

function handleConnection(socket) {
    onlineCount++;
    socket.emit('uploadedImageCount', uploadedImageCount);
}

function handleDisconnect(socket) {
    onlineCount--;
}

module.exports = {
    handleConnection,
    handleDisconnect,
};
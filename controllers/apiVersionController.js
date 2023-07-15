

const { version } = require('../package.json')

function getVersion(req, res) {
    res.json({ version });
}

module.exports = {
    getVersion
};

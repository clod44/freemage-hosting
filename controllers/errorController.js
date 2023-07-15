

function renderErrorPage(req, res) {
    res.status(404).render('pageNotFound');
}

module.exports = {
    renderErrorPage
};

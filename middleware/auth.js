const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // gestion d'erreur avec try/catch
    try {
        // récupération du token (mot clé + token)
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'RANDOM_SECRET_TOKEN');
        const utilisateurId = decodedToken.utilisateurId;
        req.auth = {
            utilisateurId: utilisateurId
        };
    } catch (error) {
        res.status(401).json({ error });
    }
};
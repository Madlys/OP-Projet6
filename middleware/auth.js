const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // error handling with try/catch
    try {
        // token retrieval (keyword + token)
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'RANDOM_SECRET_TOKEN');
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };
        next();
    } catch (error) {
        res.status(401).json({ error });
    }
};
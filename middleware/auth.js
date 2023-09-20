const jwt = require('jsonwebtoken');
require('dotenv-flow').config();

module.exports = (request, response, next) => {
    // error handling with try/catch
    try {
        // token retrieval (keyword + token)
        const token = request.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.jwt_TOKEN);
        const userId = decodedToken.userId;
        request.auth = {
            userId: userId
        };
        next();
    } catch (error) {
        response.status(401).json({ error });
    }
};
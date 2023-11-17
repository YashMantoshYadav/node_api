const jwt = require('jsonwebtoken');
const secretKey = 'your-secret-key';

function verifyToken(req, res, next) {
   console.log("headerhhk",req.headers)

    const token = req.headers.authorization;

    if (!token) {
        return res.status(403).json({ message: 'No token provided.' });
    }
    else {
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Failed to authenticate token.' });
            }
            req.user = decoded.user;
            next();
        });
    }

}

module.exports = { verifyToken }
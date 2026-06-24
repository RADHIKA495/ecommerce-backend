const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {

    try {

        // get token from headers
        let token;

        // First check cookie
        if (req.cookies.token) {
            token = req.cookies.token;
        }

        // Otherwise check Authorization header
        else if (req.headers.authorization) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({
                message: "No token provided"
            });
        }

        // verify token
        const decoded = jwt.verify(token, "secretkey");

        // save user data in request
        req.user = decoded;

        next();

    } catch (error) {

        res.status(401).json({
            message: "Invalid token"
        });

    }

};

module.exports = authMiddleware;
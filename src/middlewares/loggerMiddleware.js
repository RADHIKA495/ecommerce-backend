const loggerMiddleware = (req, res, next) => {
    console.log("Request recieved");
    console.log("Method", req.method);
    console.log("URL:", req.url);

    next();
};

module.exports = loggerMiddleware;
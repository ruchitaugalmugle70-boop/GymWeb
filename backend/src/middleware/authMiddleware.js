const jwt = require("jsonwebtoken");
const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token =
            req.headers.authorization.split(" ")[1];

        try {
            const secret = process.env.JWT_SECRET || "default_jwt_secret_key_gymweb_2026";
            const decoded = jwt.verify(token, secret);
            req.user = decoded;
            next();
        } catch (error) {
            return res.status(401).json({
                message: "Token Invalid"
            });
        }
    }
    if (!token) {
        return res.status(401).json({
            message: "No Token"
        });
    }
};
module.exports = protect;
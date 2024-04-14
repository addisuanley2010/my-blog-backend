const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

const authMiddleware = async (req, res, next) => {
  const Authorization = req.headers.Authorization || req.headers.authorization;

  if (Authorization && Authorization.startsWith("Bearer")) {
    const token = Authorization.split(" ")[1];

    jwt.verify(token, SECRET_KEY, (err, info) => {
      if (err) {
        res.json({
          message: err.message,
        });
      } else {
        req.user = info;
        next();
      }
    });
  } else {
    res.json({
      message: "Unauthorized , no token",
    });
  }
};

module.exports = authMiddleware;

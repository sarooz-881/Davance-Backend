const jwt = require("jsonwebtoken");

function verifyUser(req, res, next) {
  let authHeader = req.headers.authorization;
  if (!authHeader) {
    let err = new Error("Authentication information not found!");
    err.status = 401;
    return next(err);
  }
  console.log(authHeader);
  let token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.SECRET, (err, payload) => {
        if (err) return next(err);
        req.user = payload;
        next();
    })
}
function verifyGuest(req, res, next) {
  if (!req.user) {
    // let err = new Error("Authentication information not found!");
    // err.status = 401;
    // return next(err);

  } else if (req.user.role !== "guest") {
    let err = new Error("Forbidden!");
    err.status = 403;
    return next(err);
  }
  next();
}

function verifyhotelOwner(req, res, next) {
  if (!req.user) {
    let err = new Error("Authentication information not found!");
    err.status = 401;
    return next(err);
  } else if (req.user.role !== "hotelOwner") {
    let err = new Error("Forbidden!");
    err.status = 403;
    return next(err);
  }
  next();
}

function verifyAdmin(req, res, next) {
    if (!req.user) {
      let err = new Error("Authentication information not found!");
    err.status = 401;
    return next(err);
    } else if (req.user.role !== "admin") {
      let err = new Error("Forbidden!");
      err.status = 403;
      return next(err);
    }
    next();
  }

module.exports = {
  verifyUser,
  verifyGuest,
  verifyhotelOwner,
  verifyAdmin

};

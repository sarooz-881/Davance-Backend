const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const validation = require("../Validator/validator");

router.post("/register", (req, res, next) => {
  const { errors, isValid } = validation.registerValidator(req.body);
  if (!isValid) {
    res.status(400).json({
      status: "error",
      message: errors,
    });
  }
let {username, password, firstName, lastName, email, role } = req.body;
  User.findOne({ username})
    .then((user) => {
      if (user) {
        let err = new Error("User already exists");
        err.status = 400;
        return next(err);
      }
      bcrypt
        .hash(password, 10)
        .then((hashed) => {
          User.create({
            username,
            password: hashed,
            firstName,
            lastName,
            email,
            role,
          })
           
        .then((user)=>{
            let payload = {

                id : user.id,
                username : user.username,
                firstName : user.firstName,
                lastName : user.lastName,
                role: user.role
            }
            jwt.sign(payload,process.env.SECRET,  (err, token)=>{
                if (err){
                   return next(err);
                }
                res.json({
                    status:'Registration Successful',
                    token : `Bearer ${token}`,
                    role:payload.role
    
                });
            });

        }).catch(next);
    } ).catch(next);

}).catch(next);
})
router.post("/login", (req, res, next) => {
  let { username, password } = req.body;
  User.findOne({ username })
    .then((user) => {
      if (!user) {
        let err = new Error("User not found!");
        err.status = 401;
        return next(err);
      }
      bcrypt
        .compare(password, user.password)
        .then((isMatched) => {
          if (!isMatched) {
            let err = new Error("Password doesnot match!");
            err.status = 401;
            return next(err);
          }
          let payload = {
            id: user.id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
          };
          jwt.sign(payload, process.env.SECRET, (err, token) => {
            if (err) {
              return next(err);
            }
            res.json({
                status:'Login Successful',
                token : `Bearer ${token}`,
                role:payload.role

            });
          });
        })
        .catch(next);
    })
    .catch(next);
});
module.exports = router;

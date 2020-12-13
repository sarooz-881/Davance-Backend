const validator = require("validator");

const registerValidator = (data) => {
  let errors = {};
  if (data.username) {
    if (!validator.isLength(data.username.trim(), { min: 5, max: 25 })) {
      errors.username = "Username size must be between 5 to 25";
    }
  } else {
    errors.username = "Username is required!";
  }
  if (data.password) {
    if (!validator.isLength(data.password.trim(), { min: 7, max: 25 })) {
      errors.password = "Password size must be between 7 to 25";
    } else if (validator.isAlpha(data.password)) {
      errors.password = "Password must contain alphabets and numbers";
    }
  } else {
    errors.password = "Password is required!";
  }

  if (data.email) {
    if (!validator.isEmail(data.email)) {
      errors.email = "Not email type!";
    }
  } else {
    errors.email = "Email is required";
  }

  return {
    errors,
    isValid: Object.keys(errors).length == 0,
  };
};
module.exports = { registerValidator };

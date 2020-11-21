const isEmpty = (string) => {
  return string.trim() === "" ? true : false;
};

const isEmail = (email) => {
  const emailRegex = "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$";
  return email.match(emailRegex) ? true : false;
};

exports.validateLoginData = (data) => {
  let errors = {};
  if (isEmpty(data.email)) errors.email = "Email must not be empty";
  if (isEmpty(data.password)) errors.password = "Passowrd must not be empty";

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};
exports.validateSignUpData = (data) => {
  let errors = {};

  if (isEmpty(data.email)) errors.email = "Email must not be empty";
  else if (!isEmail(data.email)) errors.email = "Must be a valid email address";

  if (isEmpty(data.firstName)) errors.firstName = "Must not be empty";
  if (isEmpty(data.lastName)) errors.lastName = "Must not be empty";
  if (isEmpty(data.country)) errors.country = "Must not be empty";
  if (isEmpty(data.phoneNumber)) errors.phoneNumber = "Must not be empty";
  if (isEmpty(data.password)) errors.password = "Must not be empty";
  if (data.password !== data.confirmPassword)
    errors.confirmPassword = "Passwords must be the same";
  if (isEmpty(data.username)) errors.username = "Must not be empty";

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};

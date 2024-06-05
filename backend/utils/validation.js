import Joi from "joi";

const userSchema = Joi.object({
  user_name: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
});
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
});

export const validateUser = (userData) => {
  const { error, value } = userSchema.validate(userData);
  if (error) {
    throw new Error(error.details[0].message);
  }
  return value;
};
export const validateUserLogin = (userData) => {
  const { error, value } = loginSchema.validate(userData);
  if (error) {
    throw new Error(error.details[0].message);
  }
  return value;
};

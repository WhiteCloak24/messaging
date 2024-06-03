import Joi from "joi";

const userSchema = Joi.object({
  user_name: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
});

export const validateUser = (userData,next) => {
  const { error, value } = userSchema.validate(userData);
  if (error) {
    throw new Error(error.details[0].message);
  }
  return value;
};

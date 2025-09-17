import { NextFunction, Request, Response } from "express";
import Joi from "joi";

const createUserSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid("HRD", "Society").required(),
});

const createUserValidation = (req: Request, res: Response, next: NextFunction) => {
  const validate = createUserSchema.validate(req.body);
  if (validate.error) {
    return res.status(400).json({
      message: validate.error.details.map((it) => it.message).join(),
    });
  }
  next();
};

const updateUserSchema = Joi.object({
  name: Joi.string().optional(),
  email: Joi.string().optional(),
  password: Joi.string().optional(),
  role: Joi.string().valid("HRD", "Society").optional(),
});

const updateUserValidation = (req: Request, res: Response, next: NextFunction) => {
  const validate = updateUserSchema.validate(req.body);
  if (validate.error) {
    return res.status(400).json({
      message: validate.error.details.map((it) => it.message).join(),
    });
  }
  next();
};

const authScheme = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

const authValidation = (req: Request, res: Response, next: NextFunction) => {
  const validate = authScheme.validate(req.body);
  if (validate.error) {
    return res.status(400).json({
      message: validate.error.details.map((it) => it.message).join(),
    });
  }
  next();
};

export { createUserValidation, updateUserValidation, authValidation };
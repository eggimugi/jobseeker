import { NextFunction, Request, Response } from "express";
import Joi, { string } from "joi";

const createSchema = Joi.object({
  name: Joi.string().required(),
  address: Joi.string().required(),
  phone: Joi.string().min(12).required(),
  description: Joi.string().required(),
});

const createValidation = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  const validate = createSchema.validate(req.body);
  if (validate.error) {
    return res.status(400).json({
      message: validate.error.details.map((it) => it.message).join(),
    });
  }
  next();
};

const updateSchema = Joi.object({
  name: Joi.string().optional(),
  address: Joi.string().optional(),
  phone: Joi.string().min(12).optional(),
  description: Joi.string().optional(),
});

const updateValidation = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  const validate = updateSchema.validate(req.body);
  if (validate.error) {
    return res.status(400).json({
      message: validate.error.details.map((it) => it.message).join(),
    });
  }
  next();
};

export { createValidation, updateValidation };

// jika yang diimpor menggunakan {} maka export juga menggunakan {}, jika tidak juga tidak

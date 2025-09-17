import { NextFunction, Request, Response } from "express";
import Joi, { string } from "joi";

const createSchema = Joi.object({
  position_name: Joi.string().required(),
  capacity: Joi.number().min(1).required(),
  description: Joi.string().required(),
  submission_start_date: Joi.date().required(),
  submission_end_date: Joi.date().required(),
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
  position_name: Joi.string().optional(),
  capacity: Joi.number().min(1).optional(),
  description: Joi.string().optional(),
  submission_start_date: Joi.date().optional(),
  submission_end_date: Joi.date().optional(),
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

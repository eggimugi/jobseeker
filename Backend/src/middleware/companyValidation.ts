import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import path from "path";
import fs from "fs";
import { ROOT_DIRECTORY } from "../config";

const createSchema = Joi.object({
  name: Joi.string().required(),
  address: Joi.string().required(),
  phone: Joi.string().min(12).required(),
  description: Joi.string().required(),
  website: Joi.string().optional(),
  industry: Joi.string().valid("tech", "edu", "health").required(),
  companySize: Joi.string()
    .valid(
      "SIZE_1_10",
      "SIZE_11_50",
      "SIZE_51_200",
      "SIZE_201_500",
      "SIZE_501_1000",
      "SIZE_1001_PLUS"
    )
    .required(),
  foundedYear: Joi.number()
    .integer()
    .min(1800)
    .max(new Date().getFullYear())
    .required(),
});

const createValidation = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  console.log("🧾 Incoming body:", req.body);
  const validate = createSchema.validate(req.body);
  if (validate.error) {
    console.log("❌ Joi error:", validate.error.details);
    let fileName: string = req.file?.filename || ``;
    let pathFile = path.join(
      ROOT_DIRECTORY,
      "public",
      "company-logo",
      fileName
    );

    let fileExists = fs.existsSync(pathFile);

    if (fileExists && fileName !== ``) {
      fs.unlinkSync(pathFile);
    }

    return res.status(400).json({
      message: "Validation failed",
      details: validate.error.details.map((it) => it.message),
    });
  }
  next();
};

const updateSchema = Joi.object({
  name: Joi.string().optional(),
  address: Joi.string().optional(),
  phone: Joi.string().min(12).optional(),
  description: Joi.string().optional(),
  website: Joi.string().optional(),
  industry: Joi.string().valid("tech", "edu", "health").optional(),
  companySize: Joi.string()
    .valid(
      "SIZE_1_10",
      "SIZE_11_50",
      "SIZE_51_200",
      "SIZE_201_500",
      "SIZE_501_1000",
      "SIZE_1001_PLUS"
    )
    .optional(),
  foundedYear: Joi.number()
    .integer()
    .min(1800)
    .max(new Date().getFullYear())
    .optional(),
});

const updateValidation = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  const validate = updateSchema.validate(req.body);
  if (validate.error) {
    let fileName: string = req.file?.filename || ``;
    let pathFile = path.join(
      ROOT_DIRECTORY,
      "public",
      "company-logo",
      fileName
    );

    let fileExists = fs.existsSync(pathFile);

    if (fileExists && fileName !== ``) {
      fs.unlinkSync(pathFile);
    }
    return res.status(400).json({
      message: validate.error.details.map((it) => it.message).join(),
    });
  }
  next();
};

export { createValidation, updateValidation };

// jika yang diimpor menggunakan {} maka export juga menggunakan {}, jika tidak juga tidak

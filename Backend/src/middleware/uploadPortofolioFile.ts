import multer from "multer";
import { Request } from "express";
import { ROOT_DIRECTORY } from "../config";
import path from "path";

// define storage to save uploaded file
const storagePortofolio = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, destination: string) => void
  ) => {
    const storagePath = `${ROOT_DIRECTORY}/public/portofolio-file`;

    callback(null, storagePath);
  },
  filename: (
    req: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, destination: string) => void
  ) => {
    const uniqueSuffix = Date.now() + Math.round(Math.random() * 1e9);
    const fileName = `${uniqueSuffix}_${file.originalname}`;

    callback(null, fileName);
  },
});

// define function to filtering file
const filterFile = (
  req: Request,
  file: Express.Multer.File,
  callback: multer.FileFilterCallback
) => {
  // define allowed extensions
  const allowedFile = /png|jpg|jpeg|pdf|doc/;
  // check extension of uploade file
  const extName = allowedFile.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimeType = allowedFile.test(file.mimetype);

  if (extName && mimeType) {
    callback(null, true);
  } else {
    callback(new Error(`Your file is not allowed to uploaded`));
  }
};

const uploadPortofolioFile = multer({
  storage: storagePortofolio,
  fileFilter: filterFile,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2Mb
});

export { uploadPortofolioFile };

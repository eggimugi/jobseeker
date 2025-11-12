import { PrismaClient } from "@prisma/client";
import fs from "fs";
import { ROOT_DIRECTORY } from "../config";
import { Request, Response } from "express";
import path from "path";

const prisma = new PrismaClient({ errorFormat: "minimal" });

interface portofolioRequestBody {
  skill: string;
  description: string;
  file: string;
}

const createPortofolio = async (req: Request, res: Response): Promise<any> => {
  try {
    const { skill, description }: portofolioRequestBody = req.body;
    const file = req.file?.filename || "";
    console.log("Uploaded file:", req.file);

    // cek dulu apakah userId valid
    const userId = req.user?.id;

    if (!userId) {
      if (file) {
        fs.unlinkSync(
          path.join(`${ROOT_DIRECTORY}/public/portofolio-file`, file)
        );
      }
      return res.status(404).json({ message: "Unauthorized: no userId" });
    }

    // cek dulu apakah userId valid di database
    const society = await prisma.society.findFirst({
      where: { userId },
    });

    if (!society) {
      if (file) {
        fs.unlinkSync(
          path.join(`${ROOT_DIRECTORY}/public/portofolio-file`, file)
        );
      }
      return res.status(404).json({ message: "Society not found" });
    }

    const newPortofolio = await prisma.portofolio.create({
      data: {
        skill,
        description,
        file,
        societyId: society.id,
      },
    });

    return res.status(200).json({
      success: true,
      message: `New portofolio has been created`,
      data: newPortofolio,
    });
  } catch (error) {
    if (req.file?.filename) {
      fs.unlinkSync(
        path.join(`${ROOT_DIRECTORY}/public/portofolio-file`, req.file.filename)
      );
    }
    return res.status(500).json(error);
  }
};

const readPortofolio = async (req: Request, res: Response): Promise<any> => {
  try {
    const societyId = req.user?.id;
    if (!societyId) {
      return res.status(404).json({ message: "User not found" });
    }

    const society = await prisma.society.findFirst({
      where: { userId: Number(societyId) },
    });
    if (!society) {
      console.log(society);
      console.log(societyId);

      return res.status(404).json({ message: "Society not found" });
    }

    const allPortofolios = await prisma.portofolio.findMany({
      where: { societyId: society.id },
    });

    return res.status(200).json({
      success: true,
      message: `Portofolio has been retrieved`,
      data: allPortofolios,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json(error);
  }
};

const readPortofolioById = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const id = req.params.id;
    const portofolio = await prisma.portofolio.findFirst({
      where: { id: Number(id) },
    });
    if (!portofolio) {
      return res.status(404).json({ message: "Portofolio not found" });
    }
    return res.status(200).json({
      success: true,
      message: `Portofolio has been retrieved`,
      data: portofolio,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const updatePortofolio = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = Number(req.params.id);

    const findPortofolio = await prisma.portofolio.findFirst({
      where: { id },
    });

    if (!findPortofolio) {
      return res.status(404).json({
        success: false,
        message: "Portofolio not found!",
      });
    }

    if (req.file && findPortofolio.file) {
      const oldFilePath = path.join(ROOT_DIRECTORY, "public", "portofolio-file", findPortofolio.file);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    const { skill, description } = req.body;

    const updatedPortofolio = await prisma.portofolio.update({
      where: { id },
      data: {
        skill: skill ?? findPortofolio.skill,
        description: description ?? findPortofolio.description,
        file: req.file?.filename ?? findPortofolio.file,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Portofolio has been updated",
      data: updatedPortofolio,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

const deletePortofolio = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = req.params.id;

    const findPortofolio = await prisma.portofolio.findFirst({
      where: {
        id: Number(id),
      },
    });

    if (!findPortofolio) {
      return res.status(200).json({
        message: `Portofolio is not found`,
      });
    }

    // delete the file
    let oldFileName = findPortofolio.file;
    let pathFile = `${ROOT_DIRECTORY}/public/portofolio-file/${oldFileName}`;
    let existsFile = fs.existsSync(pathFile);

    if (existsFile && oldFileName !== ``) {
      fs.unlinkSync(pathFile);
    }

    const savePortofolio = await prisma.portofolio.delete({
      where: {
        id: Number(id),
      },
    });

    return res.status(200).json({
      message: `Portofolio has been removed`,
      data: savePortofolio,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

export { createPortofolio, readPortofolio, readPortofolioById, updatePortofolio, deletePortofolio };

import { PrismaClient } from "@prisma/client";
import fs from "fs";
import { ROOT_DIRECTORY } from "../config";
import { Request, Response } from "express";
import path from "path";

const prisma = new PrismaClient({ errorFormat: "minimal" });

type industryType = "tech" | "edu" | "health";
type companySizeType =
  | "SIZE_1_10"
  | "SIZE_11_50"
  | "SIZE_51_200"
  | "SIZE_201_500"
  | "SIZE_501_1000"
  | "SIZE_1001_PLUS";

interface companyRequestBody {
  name: string;
  address: string;
  phone: string;
  description: string;
  website?: string;
  industry: industryType;
  logo: string;
  companySize: companySizeType;
  foundedYear: number;
}

const createCompany = async (req: Request, res: Response): Promise<any> => {
  try {
    const {
      name,
      address,
      phone,
      description,
      website,
      industry,
      companySize,
      foundedYear,
    }: companyRequestBody = req.body;
    const logo = req.file?.filename || "";

    console.log("🧠 user from token:", req.user);

    // cek dulu apakah userId valid
    const userId = req.user?.id;

    if (!userId) {
      if (logo) {
        fs.unlinkSync(path.join(`${ROOT_DIRECTORY}/public/company-logo`, logo));
      }
      return res.status(404).json({ message: "Unauthorized: no userId" });
    }

    // cek dulu apakah userId valid di database
    const user = await prisma.user.findFirst({
      where: { id: userId },
    });

    console.log(user);

    if (!user) {
      if (logo) {
        fs.unlinkSync(path.join(`${ROOT_DIRECTORY}/public/company-logo`, logo));
      }
      return res.status(404).json({ message: "User not found" });
    }

    const newCompany = await prisma.company.create({
      data: {
        name,
        address,
        phone,
        description,
        website: website ?? "",
        industry,
        logo,
        companySize,
        foundedYear: Number(foundedYear),
        userId,
      },
    });

    return res.status(200).json({
      success: true,
      message: `New company has been created`,
      data: newCompany,
    });
  } catch (error) {
    if (req.file?.filename) {
      fs.unlinkSync(
        path.join(`${ROOT_DIRECTORY}/public/company-logo`, req.file.filename)
      );
    }
    console.log(error);

    return res.status(500).json(error);
  }
};

const readCompany = async (req: Request, res: Response): Promise<any> => {
  try {
    // const search = req.query.search;

    // const allCompany = await prisma.company.findMany({
    //   where: {
    //     OR: [
    //       {
    //         name: {
    //           contains: search?.toString() || "",
    //         },
    //       },
    //     ],
    //   },
    // });

    const { id } = req.params;
    const company = await prisma.company.findFirst({
      where: {
        userId: Number(id),
      },
    });

    if (!company) {
      return res.status(200).json({
        message: `Company is not found!`,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Company has been retrieved`,
      data: company,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const updateCompany = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = req.params.id;

    const findCompany = await prisma.company.findFirst({
      where: {
        id: Number(id),
      },
    });

    if (!findCompany) {
      return res.status(200).json({
        message: `Company is not found!`,
      });
    }

    if (req.file) {
          let oldFileName = findCompany.logo;
          let pathFile = `${ROOT_DIRECTORY}/public/company-logo/${oldFileName}`;
          let existsFile = fs.existsSync(pathFile);
    
          if (existsFile && oldFileName !== ``) {
            fs.unlinkSync(pathFile);
          }
        }

    const { name, address, phone, description, website, industry, companySize, foundedYear }: companyRequestBody = req.body;

    const saveCompany = await prisma.company.update({
      where: {
        id: Number(id),
      },
      data: {
        name: name ? name : findCompany.name,
        address: address ? address : findCompany.address,
        phone: phone ? phone : findCompany.phone,
        description: description ? description : findCompany.description,
        website: website ? website : findCompany.website,
        industry: industry ? industry : findCompany.industry,
        logo: req.file ? req.file.filename : findCompany.logo,
        companySize: companySize ? companySize : findCompany.companySize,
        foundedYear: foundedYear ? Number(foundedYear) : findCompany.foundedYear,
      },
    });

    return res.status(200).json({
      success: true,
      message: `Company has been updated`,
      data: saveCompany,
    });
  } catch (error) {
    console.log(error);
    
    return res.status(500).json(error);
  }
};

const deleteCompany = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = req.params.id;

    const findCompany = await prisma.company.findFirst({
      where: {
        id: Number(id),
      },
    });

    if (!findCompany) {
      return res.status(200).json({
        message: `Company is not found`,
      });
    }

    const saveCompany = await prisma.company.delete({
      where: {
        id: Number(id),
      },
    });

    return res.status(200).json({
      message: `Company have been removed`,
      data: saveCompany,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

export { createCompany, readCompany, updateCompany, deleteCompany };

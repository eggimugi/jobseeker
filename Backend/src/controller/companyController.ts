import { PrismaClient } from "@prisma/client";
import { log } from "console";
import { Request, Response } from "express";

const prisma = new PrismaClient({ errorFormat: "minimal" });

interface companyRequestBody {
  name: string;
  address: string;
  phone: string;
  description: string;
}

const createCompany = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, address, phone, description }: companyRequestBody = req.body;

    // cek dulu apakah userId valid
    const userId = req.user?.id;

    if (!userId) {
      return res.status(404).json({ message: "Unauthorized: no userId" });
    }

    // cek dulu apakah userId valid di database
    const user = await prisma.user.findFirst({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newCompany = await prisma.company.create({
      data: {
        name,
        address,
        phone,
        description,
        userId,
      },
    });

    return res.status(200).json({
      success: true,
      message: `New company has been created`,
      data: newCompany,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const readCompany = async (req: Request, res: Response): Promise<any> => {
  try {
    const search = req.query.search;

    const allCompany = await prisma.society.findMany({
      where: {
        OR: [
          {
            name: {
              contains: search?.toString() || "",
            },
          },
        ],
      },
    });

    // const id = req.params.id;
    // const company = await prisma.company.findFirst({
    //   where: {
    //     id: Number(id),
    //   },
    // });
    // if (company) {
    //   return res.status(200).json({
    //     message: `Company is not found!`,
    //   });
    // }


    return res.status(200).json({
      success: true,
      message: `Company has been retrieved`,
      data: allCompany,
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

    const { name, address, phone, description }: companyRequestBody = req.body;

    const saveCompany = await prisma.company.update({
      where: {
        id: Number(id),
      },
      data: {
        name: name ? name : findCompany.name,
        address: address ? address : findCompany.address,
        phone: phone ? phone : findCompany.phone,
        description: description ? description : findCompany.description,
      },
    });

    return res.status(200).json({
      success: true,
      message: `Company has been updated`,
      data: saveCompany,
    });
  } catch (error) {
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

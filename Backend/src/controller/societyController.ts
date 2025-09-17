import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient({ errorFormat: "minimal" });

type genderType = "Male" | "Female";

interface societyRequestBody {
  name: string;
  address: string;
  phone: string;
  date_of_birth: Date;
  gender: genderType;
  userId: number; // Optional for update operations
}

const createSociety = async (req: Request, res: Response): Promise<any> => {
  try {
    const {
      name,
      address,
      phone,
      date_of_birth,
      gender,
    }: societyRequestBody = req.body;

    // cek dulu apakah userId valid
    const userId = req.user?.id;

    if (!userId) {
      return res.status(404).json({ message: "User not found" });
    }

    // cek dulu apakah userId valid di database
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newSociety = await prisma.society.create({
      data: {
        name,
        address,
        phone,
        date_of_birth: new Date(date_of_birth),
        gender,
        userId,
      },
    });

    return res.status(200).json({
      success: true,
      message: `New society has been created`,
      data: newSociety,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const readSociety = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = req.params.id;
    const allSociety = await prisma.society.findFirst({
      where: {
        userId: Number(userId),
      },
    });

    return res.status(200).json({
      success: true,
      message: `Society profile retrieved`,
      data: allSociety,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const updateSociety = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = req.params.id;

    const findSociety = await prisma.society.findFirst({
      where: {
        id: Number(id),
      },
    });

    if (!findSociety) {
      return res.status(200).json({
        message: `Society is not found!`,
      });
    }

    const { name, address, phone, date_of_birth, gender }: societyRequestBody =
      req.body;

    const saveSociety = await prisma.society.update({
      where: {
        id: Number(id),
      },
      data: {
        name: name ? name : findSociety.name,
        address: address ? address : findSociety.address,
        phone: phone ? phone : findSociety.phone,
        date_of_birth: date_of_birth
          ? new Date(date_of_birth)
          : findSociety.date_of_birth,
        gender: gender ? gender : findSociety.gender,
      },
    });

    return res.status(200).json({
      success: true,
      message: `Society has been updated`,
      data: saveSociety,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const deleteSociety = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = req.params.id;

    const findSociety = await prisma.society.findFirst({
      where: {
        id: Number(id),
      },
    });

    if (!findSociety) {
      return res.status(200).json({
        message: `Society is not found`,
      });
    }

    const saveSociety = await prisma.society.delete({
      where: {
        id: Number(id),
      },
    });

    return res.status(200).json({
      message: `Society have been removed`,
      data: saveSociety,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

export { createSociety, readSociety, updateSociety, deleteSociety };

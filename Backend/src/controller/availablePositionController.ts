import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient({ errorFormat: "minimal" });

interface availablePositionRequestBody {
  position_name: string;
  capacity: number;
  description: string;
  submission_start_date: Date;
  submission_end_date: Date;
}

const createAvailablePosition = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const {
      position_name,
      capacity,
      description,
      submission_start_date,
      submission_end_date,
    }: availablePositionRequestBody = req.body;

    // cek dulu apakah userId valid
    const userId = req.user?.id;

    if (!userId) {
      return res.status(404).json({ message: "Unauthorized: no userId" });
    }

    // cek dulu apakah userId valid di database
    const company = await prisma.company.findFirst({
      where: { userId },
    });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    const newAvailablePosition = await prisma.available_position.create({
      data: {
        position_name,
        capacity,
        description,
        submission_start_date: new Date(submission_start_date),
        submission_end_date: new Date(submission_end_date),
        companyId: company.id,
      },
    });

    return res.status(200).json({
      success: true,
      message: `New position has been added`,
      data: newAvailablePosition,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json(error);
  }
};

const readAvailablePosition = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: no userId",
      });
    }

    const search = req.query.search?.toString() || "";

    const company = await prisma.company.findFirst({
      where: { userId },
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found for this user",
      });
    }

    const allAvailablePositions = await prisma.available_position.findMany({
      where: {
        companyId: company.id,
        position_name: {
          contains: search,
        },
      },
      include: {
        company: {
          select: {
            name: true,
            address: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: `Available positions retrieved successfully`,
      data: allAvailablePositions,
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

const updateAvailablePosition = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const id = req.params.id;

    const findAvailablePosition = await prisma.available_position.findFirst({
      where: { id: Number(id) },
    });

    if (!findAvailablePosition) {
      return res.status(200).json({
        message: `Available Position is not found!`,
      });
    }

    const {
      position_name,
      capacity,
      description,
      submission_start_date,
      submission_end_date,
    }: availablePositionRequestBody = req.body;

    const saveAvailablePosition = await prisma.available_position.update({
      where: {
        id: Number(id),
      },
      data: {
        position_name: position_name ?? findAvailablePosition?.position_name,
        capacity: capacity ?? findAvailablePosition?.capacity,
        description: description ?? findAvailablePosition?.description,
        submission_start_date: submission_start_date
          ? new Date(submission_start_date)
          : findAvailablePosition?.submission_start_date,
        submission_end_date: submission_end_date
          ? new Date(submission_end_date)
          : findAvailablePosition?.submission_end_date,
      },
    });

    return res.status(200).json({
      message: `Available Position has been updated`,
      data: saveAvailablePosition,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const readAllAvailablePositions = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const allAvailablePositions = await prisma.available_position.findMany({
      include: {
        company: {
          select: {
            name: true,
            address: true,
          },
        },
      },
    });
    return res.status(200).json({
      success: true,
      message: `All available positions retrieved successfully`,
      data: allAvailablePositions,
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

const deleteAvailablePosition = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const id = req.params.id;

    const findAvailablePosition = await prisma.available_position.findFirst({
      where: {
        id: Number(id),
      },
    });

    if (!findAvailablePosition) {
      return res.status(200).json({
        message: `AvailablePosition is not found`,
      });
    }

    const saveAvailablePosition = await prisma.available_position.delete({
      where: {
        id: Number(id),
      },
    });

    return res.status(200).json({
      message: `AvailablePosition has been removed`,
      data: saveAvailablePosition,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const getAvailablePositionByStatus = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { status } = req.query;
    const now = new Date();

    let whereCondition: any = {};

    if (status === "active") {
      whereCondition = {
        submission_start_date: { lte: now },
        submission_end_date: { gte: now },
      };
    } else if (status === "expired") {
      whereCondition = {
        submission_end_date: { lt: now },
      };
    } else if (status === "upcoming") {
      whereCondition = {
        submission_start_date: { gt: now },
      };
    }

    const positions = await prisma.available_position.findMany({
      where: whereCondition,
      include: { company: true },
    });

    res.json(positions);
  } catch (err) {
    res.status(500).json(err);
  }
};

export {
  createAvailablePosition,
  readAvailablePosition,
  readAllAvailablePositions,
  updateAvailablePosition,
  deleteAvailablePosition,
  getAvailablePositionByStatus,
};

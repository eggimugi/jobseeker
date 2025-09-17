import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient({ errorFormat: "minimal" });

type statusType = "PENDING" | "ACCEPTED" | "REJECTED";

interface positionAppliedRequestBody {
  status: statusType;
  applied_date: Date;
}

const applyToPosition = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Missing position id" });
    }

    const availablePositionId = parseInt(id, 10);

    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: no userId" });
    }

    // cek society dari user
    const society = await prisma.society.findFirst({ where: { userId } });
    if (!society) return res.status(404).json({ message: "Society not found" });

    // cek posisi valid
    const position = await prisma.available_position.findUnique({
      where: { id: availablePositionId },
    });
    if (!position)
      return res.status(404).json({ message: "Position not found" });

    const applied = await prisma.position_applied.create({
      data: {
        societyId: society.id,
        availablePositionId,
        status: "Pending",
        apply_date: new Date(),
      },
    });

    return res.status(200).json({
      message: `You have successfully applied to position ${position.position_name}`,
      data: applied,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

const getSocietyAppliedPositions = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: no userId" });
    }
    const society = await prisma.society.findFirst({ where: { userId } });
    if (!society) return res.status(404).json({ message: "Society not found" });

    const applications = await prisma.position_applied.findMany({
      where: { societyId: society?.id },
      include: {
        available_position: {
          include: {
            company: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: `List of applied positions for society ${society.name}`,
      data: applications,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

const getCompanyAppliedPositions = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: no userId" });
    }
    const company = await prisma.company.findFirst({ where: { userId } });
    if (!company) return res.status(404).json({ message: "Company not found" });

    const applications = await prisma.position_applied.findMany({
      where: { available_position: { companyId: company?.id } },
      include: { society: true, available_position: true },
    });

    return res.status(200).json({
      message: `List of applied positions for company ${company.name}`,
      data: applications,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

const updatePositionAppliedStatus = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Missing position applied id" });
    }

    const positionAppliedId = parseInt(id, 10);

    const { status } = req.body;

    const updated = await prisma.position_applied.update({
      where: { id: positionAppliedId },
      data: { status },
    });

    return res.status(200).json({
      message: `Position applied status has been updated to ${status}`,
      data: updated,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export {
  applyToPosition,
  getSocietyAppliedPositions,
  getCompanyAppliedPositions,
  updatePositionAppliedStatus,
};

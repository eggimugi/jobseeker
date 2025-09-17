import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient({ errorFormat: "minimal" });

type roleType = "HRD" | "Society";

interface userRequestBody {
  name: string;
  email: string;
  password: string;
  role: roleType;
}

const createUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, email, password, role }: userRequestBody = req.body;

    const findEmail = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (findEmail) {
      return res.status(400).json({
        message: `Email has exists, please try another email!`,
      });
    }

    const hashPassword = await bcrypt.hash(password, 12);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashPassword,
        role,
      },
    });

    return res.status(200).json({
      success: true,
      message: `Registration successful`,
      data: newUser,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const readUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const search = req.query.search;

    const allUsers = await prisma.user.findMany({
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

    return res.status(200).json({
      message: `Materials has been retrieved`,
      data: allUsers,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const updateUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = req.params.id;

    const findUser = await prisma.user.findFirst({
      where: {
        id: Number(id),
      },
    });

    if (!findUser) {
      return res.status(200).json({
        message: `User is not found!`,
      });
    }

    const { name, email, password, role }: userRequestBody = req.body;

    const saveUser = await prisma.user.update({
      where: {
        id: Number(id),
      },
      data: {
        name: name ? name : findUser.name,
        email: email ? email : findUser.email,
        password: password
          ? await bcrypt.hash(password, 12)
          : findUser.password,
        role: role ? role : findUser.role,
      },
    });

    return res.status(200).json({
      message: `User has been updated`,
      data: saveUser,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const deleteUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = req.params.id;

    const findUsers = await prisma.user.findFirst({
      where: {
        id: Number(id),
      },
    });

    if (!findUsers) {
      return res.status(200).json({
        message: `Users are not found`,
      });
    }

    const saveUser = await prisma.user.delete({
      where: {
        id: Number(id),
      },
    });

    return res.status(200).json({
      message: `Users have been removed`,
      data: saveUser,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const authentication = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;
    const findUser = await prisma.user.findFirst({ where: { email } });
    if (!findUser) {
      return res.status(200).json({ message: "Email not registered" });
    }
    const isMatchPassword = await bcrypt.compare(password, findUser.password);
    if (!isMatchPassword) {
      return res.status(200).json({ message: "Invalid Password" });
    }

    // prepare to generate token using JWT \\
    const payload = {
      id: findUser.id,
      name: findUser.name,
      email: findUser.email,
      role: findUser.role,
    };
    const signature = process.env.SECRET || ``;

    const token = jwt.sign(payload, signature, { expiresIn: "1d" });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: findUser.id,
        name: findUser.name,
        email: findUser.email,
        role: findUser.role,
      },
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json(error);
  }
};

export { createUser, readUser, updateUser, deleteUser, authentication };

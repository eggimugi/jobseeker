import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

interface JwtPayload {
  id: number;
  email: string;
  role: "HRD" | "Society";
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    /** read token from header */
    const header = req.headers.authorization;
    if (!header) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    const [type, token] = header ? header.split(" ") : [];
    if (type !== "Bearer" || !token) {
      return res.status(401).json({ message: "Invalid authorization format" });
    }

    /** verify token */
    const signature = process.env.SECRET || "";
    if (!signature) {
      throw new Error("JWT secret is not defined in environment variables");
    }

    const isVerified = jwt.verify(token, signature);
    if (!isVerified) {
      return res.status(401).json({
        messgae: `Unauthorized`,
      });
    } 
    req.user = isVerified as JwtPayload;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized", error });
  }
};

const authorizeRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: insufficient role" });
    }

    next();
  };
};

export { verifyToken, authorizeRole };

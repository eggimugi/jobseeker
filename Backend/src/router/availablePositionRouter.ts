import { Router } from "express";
import {
  createAvailablePosition,
  readAvailablePosition,
  readAllAvailablePositions,
  updateAvailablePosition,
  deleteAvailablePosition,
} from "../controller/availablePositionController";
import {
  createValidation,
  updateValidation,
} from "../middleware/availablePositionValidation";
import { verifyToken } from "../middleware/authorization";

const router = Router();

router.post("/", [verifyToken, createValidation], createAvailablePosition);
router.get("/", verifyToken, readAvailablePosition);
router.get("/all", verifyToken, readAllAvailablePositions);
router.put("/:id", updateValidation, updateAvailablePosition);
router.delete("/:id", deleteAvailablePosition);

export default router;

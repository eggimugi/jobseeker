import { Router } from "express";
import { createAvailablePosition, readAvailablePosition, updateAvailablePosition, deleteAvailablePosition } from "../controller/availablePositionController";
import { createValidation, updateValidation } from "../middleware/availablePositionValidation";
import { verifyToken } from "../middleware/authorization";

const router = Router();

router.post("/", [verifyToken, createValidation], createAvailablePosition);
router.get("/", readAvailablePosition);
router.put("/:id", updateValidation, updateAvailablePosition);
router.delete("/:id", deleteAvailablePosition);

export default router;
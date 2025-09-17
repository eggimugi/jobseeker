import { Router } from "express";
import { applyToPosition, getSocietyAppliedPositions, getCompanyAppliedPositions, updatePositionAppliedStatus } from "../controller/positionAppliedController";
import { verifyToken, authorizeRole } from "../middleware/authorization";

const router = Router();

router.post("/apply/:id", [verifyToken, authorizeRole(["Society"])], applyToPosition);
router.get("/appliedPosition", [verifyToken, authorizeRole(["Society"])], getSocietyAppliedPositions);
router.get("/company", [verifyToken, authorizeRole(["Company"])], getCompanyAppliedPositions);
router.put("/:id", [verifyToken, authorizeRole(["Company"])], updatePositionAppliedStatus);

export default router;
import { Router } from "express";
import {
  createSociety,
  readSociety,
  updateSociety,
  deleteSociety,
} from "../controller/societyController";
import {
  createValidation,
  updateValidation,
} from "../middleware/societyValidation";
import { verifyToken, authorizeRole } from "../middleware/authorization";

const router = Router();

router.post(
  "/",
  [verifyToken, authorizeRole(["Society"]), createValidation],
  createSociety
);
router.get("/user/:id", [verifyToken], readSociety);
router.put("/:id", updateValidation, updateSociety);
router.delete("/:id", deleteSociety);

export default router;

import { Router } from "express";
import { createCompany, readCompany, updateCompany, deleteCompany } from "../controller/companyController";
import { createValidation, updateValidation } from "../middleware/companyValidation";
import { verifyToken } from "../middleware/authorization";

const router = Router();

router.post("/", [verifyToken, createValidation], createCompany);
router.get("/read", [verifyToken], readCompany);
router.put("/:id", updateValidation, updateCompany);
router.delete("/:id", deleteCompany);

export default router;
import { Router } from "express";
import { createCompany, readCompany, updateCompany, deleteCompany } from "../controller/companyController";
import { createValidation, updateValidation } from "../middleware/companyValidation";
import { verifyToken } from "../middleware/authorization";
import { uploadCompanyLogo } from "../middleware/uploadCompanyLogo";
import { authorizeRole } from "../middleware/authorization";

const router = Router();

router.post("/", [verifyToken, authorizeRole(["HRD"]), uploadCompanyLogo.single('logo'), createValidation], createCompany);
router.get("/user/:id", [verifyToken], readCompany);
router.put("/:id", [verifyToken, authorizeRole(["HRD"]), uploadCompanyLogo.single('logo'), updateValidation], updateCompany);
router.delete("/:id", deleteCompany);

export default router;
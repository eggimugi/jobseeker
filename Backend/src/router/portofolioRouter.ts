import { Router } from "express";
import { createPortofolio, readPortofolio, readPortofolioById, updatePortofolio, deletePortofolio } from "../controller/portofolioController";
import { createValidation, updateValidation } from "../middleware/portofolioValidation";
import {uploadPortofolioFile} from "../middleware/uploadPortofolioFile";
import { verifyToken, authorizeRole } from "../middleware/authorization";

const router = Router();

router.post("/", [verifyToken,  authorizeRole(["Society"]),uploadPortofolioFile.single('file'), createValidation], createPortofolio);
router.get("/", [verifyToken, authorizeRole(["Society"])], readPortofolio);    
router.get("/:id", [verifyToken, authorizeRole(["Society"])], readPortofolioById);
router.put("/:id", [uploadPortofolioFile.single('file') ,updateValidation], updatePortofolio);
router.delete("/:id", deletePortofolio);

export default router;
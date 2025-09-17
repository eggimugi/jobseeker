import { Router } from "express";
import { authValidation, createUserValidation, updateUserValidation } from "../middleware/userValidation";
import { authentication, createUser, deleteUser, readUser, updateUser } from "../controller/userController";
import { verifyToken, authorizeRole } from "../middleware/authorization";

const router = Router();

router.post(`/register`, [createUserValidation], createUser);
router.get(`/`, readUser);
router.put(`:id`, [updateUserValidation], updateUser);
router.delete(`:id`, deleteUser);
router.post(`/login`, [authValidation], authentication);
router.get("/hrd/dashboard", verifyToken, authorizeRole(["HRD"]), (req, res) => {
  res.json({ message: `Welcome HRD ${req.user?.email}` });
});

router.get("/society/dashboard", verifyToken, authorizeRole(["Society"]), (req, res) => {
  res.json({ message: `Welcome Society ${req.user?.email}` });
});

export default router;
import express from "express";
import authController from "../controllers/auth.controller";

const router = express.Router();

router.get("/user", authController.getUsers);
router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login)

export default router;

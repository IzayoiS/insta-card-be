import express from "express";
import authController from "../controllers/auth.controller";
import userController from "../controllers/user.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

// Auth
router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);
router.get("/auth/me", authMiddleware, authController.me);

// User
router.get("/user", userController.getUsers);
router.get("/user/:username", userController.getUserByUsername);
router.patch("/user/:username", userController.updateUser);
router.delete("/user/:username", userController.deleteUserByUsername);

export default router;

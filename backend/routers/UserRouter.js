import express from "express";
import { refreshToken } from "../controllers/RefreshToken.js"; // Import controller refresh token
import {
    createUser,
    loginHandler,
    logout
} from "../controllers/UserController.js"; // Import controller user

const router = express.Router();

router.post("/refresh-token", refreshToken);
router.post("/register", createUser);
router.post("/login", loginHandler);
router.delete("/logout", logout);

export default router;

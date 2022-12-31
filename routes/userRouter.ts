import { Router } from "express";
import {
  getUsers,
  loginUser,
  logoutUser,
  signupUser,
} from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";

export const userRouter = Router();

userRouter
  .get("/", authMiddleware, getUsers)
  .post("/signup", signupUser)
  .post("/login", loginUser)
  .post("/logout", authMiddleware, logoutUser);

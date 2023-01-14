import { Router } from "express";
import {
  findByName,
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
  .delete("/logout", authMiddleware, logoutUser)
  .post("/find", authMiddleware, findByName);

import { Router } from "express";
import {
  findByName,
  getNewMessages,
  getOneUser,
  getUsers,
  loginUser,
  logoutUser,
  signupUser,
  updateNewMessages,
} from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";

export const userRouter = Router();

userRouter
  .get("/", authMiddleware, getUsers)
  .get("/messages", authMiddleware, getNewMessages)
  .get("/:id", authMiddleware, getOneUser)
  .post("/signup", signupUser)
  .post("/login", loginUser)
  .post("/messages", authMiddleware, updateNewMessages)
  .delete("/logout", authMiddleware, logoutUser)
  .post("/find", authMiddleware, findByName);

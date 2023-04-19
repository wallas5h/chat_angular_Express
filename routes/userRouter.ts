import { Router } from "express";
import {
  changeUserStatus,
  confirmRegistration,
  findByName,
  getNewMessages,
  getOneUser,
  getUsers,
  loginUser,
  logoutUser,
  resendRegisterVerification,
  signupUser,
  updateNewMessages,
} from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";

export const userRouter = Router();

userRouter
  .get("/", authMiddleware, getUsers)
  .get("/messages", authMiddleware, getNewMessages)
  .get("/:id", authMiddleware, getOneUser)
  .get("/confirm/:id", confirmRegistration)
  .patch("/status", authMiddleware, changeUserStatus)
  .post("/signup", signupUser)
  .post("/login", loginUser)
  .post("/messages", authMiddleware, updateNewMessages)
  .post("/resendRegisterVerification", resendRegisterVerification)
  .delete("/logout", authMiddleware, logoutUser)
  .post("/find", authMiddleware, findByName);

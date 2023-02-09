import { Router } from "express";
import { deleteDisActiveMsg } from "../controllers/messagesController";
import { authMiddleware } from "../middleware/authMiddleware";

export const messagesRouter = Router();

messagesRouter
  .get("/", () => {})
  .post("/", () => {})
  .delete("/clear", authMiddleware, deleteDisActiveMsg);
// .delete("/:id", authMiddleware, disActiveMessage);

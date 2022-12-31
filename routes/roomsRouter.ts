import { Router } from "express";
import { createRoom, getRooms } from "../controllers/roomsController";
import { authMiddleware } from "../middleware/authMiddleware";

export const roomsRouter = Router();

roomsRouter
  .get("/", authMiddleware, getRooms)
  .post("/", authMiddleware, createRoom);

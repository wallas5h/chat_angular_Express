import { Router } from "express";
import {
  addUserToDislikeList,
  addUserToRoomMembers,
  createRoom,
  disActiveRoom,
  getOneRoom,
  getRooms,
  updateRoomData,
} from "../controllers/roomsController";
import { authMiddleware } from "../middleware/authMiddleware";

export const roomsRouter = Router();

roomsRouter
  .get("/", authMiddleware, getRooms)
  .get("/:id", authMiddleware, getOneRoom)
  .post("/", authMiddleware, createRoom)
  .patch("/", authMiddleware, addUserToDislikeList)
  .delete("/:id", authMiddleware, disActiveRoom)
  .patch("/:id", authMiddleware, addUserToRoomMembers)
  .put("/:id", authMiddleware, updateRoomData);

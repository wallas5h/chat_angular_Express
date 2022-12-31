import { Response } from "express";
import { Room } from "../models/Room";

export const getRooms = async (req: any, res: Response) => {
  const userId = req.user._id.toString();
  const rooms = await Room.find().or([
    { type: "public" },
    {
      members: { $in: [userId] },
    },
  ]);

  res.json({ rooms: rooms });
};

export const createRoom = async (req: any, res: Response) => {
  const userId = req.user._id.toString();
  const { name, type } = req.body;

  const room = await new Room({
    name,
    type: type ? type : "public",
    members: [userId],
  });

  await room.save();

  await getRooms(req, res);

  // res.json(room);
};

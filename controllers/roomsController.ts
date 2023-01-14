import { Request, Response } from "express";
import { Room } from "../models/Room";
import { RoomEntity } from "../types/room.dto";

export const getRooms = async (req: any, res: Response) => {
  const userId = req.user._id.toString();
  const userName = req.user.name;
  const rooms = await Room.find()
    .or([
      { type: "public" },
      {
        members: { $elemMatch: { id: userId } },
      },
    ])
    .and([{ isActive: true }, { dislikeMembers: { $nin: [userId] } }]);

  res.json({ rooms: rooms });
};

export const createRoom = async (req: any, res: Response) => {
  const userId = req.user._id.toString();
  const userName = req.user.name;
  const { name, type } = req.body;

  const room = await new Room({
    name,
    type: type ? type : "public",
    isActive: true,
    members: [{ name: userName, id: userId }],
    createdBy: { name: userName, id: userId },
    dislikeMembers: [],
  });

  await room.save();

  await getRooms(req, res);
};

export const addUserToDislikeList = async (req: any, res: Response) => {
  const roomId = req.body.id;

  if (!roomId) {
    return res.status(400).json({
      message: "Invalid room id",
    });
  }

  let room;

  try {
    room = await Room.findOne({
      _id: roomId,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Room not found",
    });
  }

  if (!room) {
    return res.status(400).json({
      message: "Room not found",
    });
  }

  room.dislikeMembers.push(req.user.id);
  room.save();

  await getRooms(req, res);
};

export const disActiveRoom = async (req: Request, res: Response) => {
  const roomId = req.params.id;

  if (!roomId) {
    return res.status(400).json({
      message: "Invalid room id",
    });
  }

  let room;

  try {
    room = await Room.findOne({
      _id: roomId,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Room not found",
    });
  }

  if (!room) {
    return res.status(404).json({
      message: "Room not found",
    });
  }

  room.isActive = false;
  room.save();

  await getRooms(req, res);
};

export const addUserToRoomMembers = async (req: Request, res: Response) => {
  const roomId = req.params.id;
  const { name, id: userId } = req.body;

  if (!roomId) {
    return res.status(400).json({
      message: "Invalid room id",
    });
  }

  let room;

  try {
    room = await Room.findOne({
      _id: roomId,
    });
  } catch (error) {
    return res.status(404).json({
      message: "Room not found",
    });
  }

  if (!room) {
    return res.status(404).json({
      message: "Room not found",
    });
  }

  // console.log(userId);
  const userInList = room.members.find((member) => {
    if (member.id === userId) {
      return true;
    }
    return;
  });

  if (userInList) {
    return res.status(302).json({
      message: "User just exist in Room",
    });
  }

  room.members.push({ name, id: userId });

  await room.save();

  await getRooms(req, res);
};

export const updateRoomData = async (req: any, res: Response) => {
  const roomId = req.params.id;
  const data: RoomEntity = req.body;
  let room;

  if (!roomId) {
    return res.status(404).json({
      error: "Invalid room id",
    });
  }

  try {
    room = await Room.findOne().and([
      { _id: roomId },
      // {
      //   createdBy: { $elemMatch: { id: req.user._id } },
      // },
    ]);
  } catch (error) {
    return res.status(500).json({
      error: "Room not found",
    });
  }

  if (!room) {
    return res.status(404).json({
      error: "Room not found",
    });
  }

  room.name = data.name;
  room.type = data.type;
  room.members = data.members;

  await room.save();

  res.send("ok");
};

import { Request, Response } from "express";

import { Message } from "../models/Message";

export const disActiveMessage = async (req: Request, res: Response) => {
  const messageId = req.params.id;

  if (!messageId) {
    return res.status(400).json({
      message: "Invalid message id",
    });
  }

  let message;

  try {
    message = await Message.findOne({
      _id: messageId,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Message not found",
    });
  }

  if (!message) {
    return res.status(404).json({
      message: "Room not found",
    });
  }

  message.isActive = false;
  await message.save();

  res.status(200).json({
    message: "Message removed",
  });
};

export const deleteDisActiveMsg = async (req: Request, res: Response) => {
  try {
    await Message.deleteMany({ isActive: false });
  } catch (error) {
    console.log(error);
  }
  res.send("ok");
};

import { Server } from "socket.io";
import { cloudinary } from "../index";

import { Message } from "../models/Message";
import { Room } from "../models/Room";
import { User } from "../models/User";
import { Dictionary, MessageTypes } from "../types/message";
import { UserResponseDto, UserStatus } from "../types/user.dto";
require("dotenv").config();
const socketioJwt = require("socketio-jwt");

export interface MessageDto {
  _id: string;
  content: String;
  from: Object;
  sockedId: String;
  time: String;
  date: String;
  to: String;
}

export let exportSocket: any;

export const socketService = async (io: Server) => {
  // io.use(
  //   socketioJwt.authorize({
  //     secret: config.ACCESS_TOKEN_KEY,
  //     handshake: true,
  //     auth_header_required: true,
  //   })
  // );

  await io.sockets.on("connection", (socket) => {
    exportSocket = socket;

    socket.on("new-user", async () => {
      socket.emit("new-user", "działa");
    });

    socket.on("join-room", async (room: string) => {
      socket.join(room);
      let roomMessages = await getLastMessagesFromRoom(room);
      roomMessages = sortMessagesByDate(roomMessages);
      socket.emit("room-messages", roomMessages);
    });

    socket.on(
      "delete-room-messages",
      async (messageId: string, room: string) => {
        // socket.join(room);

        let message;

        try {
          message = await Message.findOne({
            _id: messageId,
          });
        } catch (error) {
          return;
        }

        if (!message) return;

        message.isActive = false;
        await message.save();

        deleteFileFromCloud(message);

        let roomMessages = await getLastMessagesFromRoom(room);
        roomMessages = sortMessagesByDate(roomMessages);
        socket.emit("room-messages", roomMessages);
      }
    );

    socket.on(
      "message-room",
      async (
        FECurrentRoomId: string,
        content,
        contentType = MessageTypes.text,
        sender: UserResponseDto,
        time,
        date
      ) => {
        const newMessage = await new Message({
          content,
          contentType,
          date,
          isActive: true,
          from: sender,
          sockedId: "",
          time,
          to: FECurrentRoomId,
        });

        await newMessage.save();

        let roomMessages = await getLastMessagesFromRoom(FECurrentRoomId);
        const sortedRoomMessages = sortMessagesByDate(roomMessages);

        io.to(FECurrentRoomId).emit("room-messages", sortedRoomMessages);

        // send notification to frontend
        socket.broadcast.emit("notifications", FECurrentRoomId);

        // console.log(socket.handshake.query.token);

        // send notification to database
        if (String(FECurrentRoomId).includes("-")) {
          const roomMembers = FECurrentRoomId.split("-");
          roomMembers.forEach((member: any) => {
            if (member === sender.id) {
              return;
            } else {
              updateUserNewMessages(member, FECurrentRoomId);
            }
          });
        } else {
          const messageRoom: any = await Room.findOne({ _id: FECurrentRoomId });
          if (!messageRoom) {
            return;
          }
          messageRoom.members.forEach((member: any) => {
            if (member.id === sender.id) {
              return;
            } else {
              updateUserNewMessages(member.id, FECurrentRoomId);
            }
          });
        }
      }
    );

    socket.on("user-status", async ({ userId, status }) => {
      const user = await User.findOne({
        _id: userId,
      });

      if (!user) {
        console.log("user-status not found");
        return;
      }

      user.status =
        status === UserStatus.online ? UserStatus.online : UserStatus.offline;

      // await user.save();
      try {
        await user.save();
      } catch (error) {
      } finally {
      }
    });
  });
};

export const updateUserNewMessages = async (
  memberID: string,
  FECurrentRoomId: string
) => {
  const updateUser: any = await User.findOne({ _id: memberID });

  if (!updateUser) return;

  let newMessages: Dictionary<number> | { [index: string]: any } =
    updateUser.newMessages ?? {};

  if (newMessages[FECurrentRoomId]) {
    newMessages[FECurrentRoomId] += 1;
  } else {
    newMessages[FECurrentRoomId] = 1;
  }

  updateUser.newMessages = newMessages;

  try {
    updateUser.markModified("newMessages");
    await updateUser.save();
  } catch (error) {}
};

export const getLastMessagesFromRoom = async (
  room: string
): Promise<MessageDto[]> => {
  let roomMessages = await Message.aggregate([
    { $match: { to: room } },
    { $match: { isActive: true } },
    { $group: { _id: "$date", messagesByDate: { $push: "$$ROOT" } } },
  ]);
  return roomMessages;
};

export const sortMessagesByDate = (messages: any) => {
  return messages.sort((a: MessageDto, b: MessageDto) => {
    let date1 = a._id.split("/");
    let date2 = b._id.split("/");

    let date11: number =
      Number(date1[2]) * 1 + Number(date1[1]) * 100 + Number(date1[0]) * 10000;
    let date22: number =
      Number(date2[2]) * 1 + Number(date2[1]) * 100 + Number(date2[0]) * 10000;

    return date11 < date22 ? -1 : 1;
  });
};

export function deleteFileFromCloud(
  message: import("mongoose").Document<
    unknown,
    any,
    {
      content?: string | undefined;
      contentType?: string | undefined;
      from?: any;
      isActive?: boolean | undefined;
      time?: string | undefined;
      date?: string | undefined;
      to?: string | undefined;
    }
  > & {
    content?: string | undefined;
    contentType?: string | undefined;
    from?: any;
    isActive?: boolean | undefined;
    time?: string | undefined;
    date?: string | undefined;
    to?: string | undefined;
  } & { _id: import("mongoose").Types.ObjectId }
) {
  try {
    if (["image", "video", "raw"].includes(String(message.contentType))) {
      const cloudUrlLink = message.content?.split(" | ")[0];

      // http://res.cloudinary.com/dkdynfku8/video/upload/v1674412502/messages/63c2ccc179f9d8ef641a5596-63c2ccb279f9d8ef641a5592/abc.mp4.mp4
      const slashIndex = cloudUrlLink?.lastIndexOf("/messages") as number;
      const dotIndex = cloudUrlLink?.lastIndexOf(".") as number;

      const publicID = cloudUrlLink?.substring(
        slashIndex + 1,
        dotIndex
      ) as string;

      cloudinary.uploader
        .destroy(publicID, {
          invalidate: true,
          resource_type: `${message.contentType}`,
        })
        .then((result: any) => {
          console.log(result);
        })
        .catch((error: any) => {
          console.log(error);
        });
    }
  } catch (error) {
    console.log(error);
    return;
  }
}

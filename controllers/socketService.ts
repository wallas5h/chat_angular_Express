import { Server } from "socket.io";
import { Message } from "../models/Message";
import { User } from "../models/User";

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
  await io.on("connection", (socket) => {
    exportSocket = socket;
    socket.on("new-user", async () => {
      console.log("działa socket new-user");
      const members = await User.find();
      console.log(members);
      io.emit("new-user", members);
    });

    socket.on("join-room", async (room: string) => {
      socket.join(room);
      let roomMessages = await getLastMessagesFromRoom(room);
      roomMessages = sortMessagesByDate(roomMessages);
      socket.emit("room-messages", roomMessages);
    });

    socket.on("message-room", async (room, content, sender, time, date) => {
      const newMessage = await new Message({
        content,
        date,
        from: sender,
        sockedId: "",
        time,
        to: room,
      });

      await newMessage.save();

      let roomMessages = await getLastMessagesFromRoom(room);
      const sortedRoomMessages = sortMessagesByDate(roomMessages);

      io.to(room).emit("room-messages", sortedRoomMessages);

      socket.broadcast.emit("notifications", room);
    });
  });
};

export const getLastMessagesFromRoom = async (
  room: string
): Promise<MessageDto[]> => {
  let roomMessages = await Message.aggregate([
    { $match: { to: room } },
    { $group: { _id: "$date", messagesByDate: { $push: "$$ROOT" } } },
  ]);
  return roomMessages;
};

export const sortMessagesByDate = (messages: any) => {
  return messages.sort((a: MessageDto, b: MessageDto) => {
    let date1 = a._id.split("/");
    let date2 = b._id.split("/");

    let date11 = date1[2] + date1[1] + date1[0];
    let date22 = date2[2] + date2[1] + date2[0];
    return date11 < date22 ? -1 : 1;
  });
};

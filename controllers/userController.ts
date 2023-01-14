import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { User } from "../models/User";
import { UserStatus } from "../types/user.dto";
import { generateHashedData, generateToken } from "../utils/logs";
import { exportSocket } from "./socketService";

export const signupUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, image } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        invalid: "Please add all fields",
      });
    }

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({
        invalid: "User already exists",
      });
    }

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create user

    const user = await new User({
      name,
      email,
      password: hashedPassword,
      image: image ? image : "",
      status: UserStatus.online,
    });

    await user.save();

    const token = generateToken(user._id);
    const hashedData = generateHashedData(
      user._id,
      user.name,
      user.email,
      user.image,
      user.newMessages
    );
    user.token = token;
    user.status = UserStatus.online;
    await user.save();

    res.status(200).json({
      data: hashedData,
      token: user.token,
    });
  } catch (e) {
    res.status(400).json({
      invalid: e,
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        invalid: "Invalid credentials",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        invalid: "Invalid email or password",
      });
    }

    const passMatch = await bcrypt.compare(password, user.password);

    if (!passMatch) {
      return res.status(400).json({
        invalid: "Invalid email or password",
      });
    }

    const token = generateToken(user._id);
    const hashedData = generateHashedData(
      user._id,
      user.name,
      user.email,
      user.image,
      user.newMessages
    );
    user.token = token;
    user.status = UserStatus.online;
    await user.save();

    res.status(200).json({
      data: hashedData,
      token: user.token,
    });
  } catch (e) {
    res.status(400).json({
      invalid: e,
    });
  }
};

export const logoutUser = async (req: any, res: Response) => {
  const user = req.user;

  if (!user) {
    return res.status(400).json({
      invalid: "Invalid user id",
    });
  }

  user.status = UserStatus.offline;
  // user.newMessages = newMessages;

  await user.save();

  const members = await User.find();

  const socket: Socket<
    DefaultEventsMap,
    DefaultEventsMap,
    DefaultEventsMap,
    any
  > = exportSocket;

  socket.broadcast.emit("new-user", exportedMembersData(members));

  res.status(200).json({
    message: "Logout successfully",
  });
};

export const getUsers = async (req: Request, res: Response) => {
  const members = await User.find();

  res.status(200).json({
    users: exportedMembersData(members),
  });
};

export const findByName = async (req: any, res: Response) => {
  const name = String(req.body.name).toLocaleLowerCase();
  const userId = req.user._id.toString();

  const results = await User.find()
    .and([{ name: { $regex: name } }, { _id: { $ne: userId } }])
    .limit(5);

  if (results.length === 0) {
    return res.status(404).json({
      error: "no results",
    });
  }

  res.status(200).json({
    users: exportedMembersData(results),
  });
};

const exportedMembersData = (members: any[]) => {
  return members.map(({ _id, email, name, image, status }) => ({
    _id,
    name,
    image,
    status,
  }));
};

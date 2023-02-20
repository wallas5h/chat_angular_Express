import "express-async-errors";
import jwt from "jsonwebtoken";
import { config } from "../config/config";

type decodedEntity = {
  id: string;
  iat: number;
  exp: number;
};

export const decodeSocketToken = async (token: string) => {
  try {
    // Verify token
    const decoded = jwt.verify(token, config.ACCESS_TOKEN_KEY) as decodedEntity;
    return decoded.id;
    // const user = await User.findById(decoded.id);
    // return user;
  } catch (error) {
    return null;
  }
};

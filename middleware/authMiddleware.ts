import { NextFunction, Response } from "express";
import "express-async-errors";
import jwt from "jsonwebtoken";
import { config } from "../config/config";
import { User } from "../models/User";
// import { User } from "../models";

type decodedEntity = {
  id: string;
  iat: number;
  exp: number;
};

export const authMiddleware = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(
        token,
        config.ACCESS_TOKEN_KEY
      ) as decodedEntity;
      req.user = await User.findById(decoded.id);
      next();
    } catch (error) {
      console.log(error);
      res.status(401).json({
        error: "Not authorized",
      });
      // throw new Error("Not authorized");
    }
  }
  if (!token) {
    res.status(401).json({
      error: "Not authorized, no token",
    });
    // throw new Error("Not authorized, no token");
  }
};

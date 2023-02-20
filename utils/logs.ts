import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../config/config";

export interface tokenEntity extends JwtPayload {
  id: string;
}

// Generate JWT
export const generateToken = (id: any) => {
  return jwt.sign({ id }, config.ACCESS_TOKEN_KEY, {
    expiresIn: "30d",
  });
};

export const generateRefreshToken = (id: string) => {
  return jwt.sign({ id }, config.REF_TOKEN_KEY);
};

export const generateHashedData = (
  id: any,
  name: string,
  email: string,
  image: string | undefined,
  newMessages: any
) => {
  return jwt.sign(
    { id, name, email, image, newMessages },
    config.ACCESS_TOKEN_KEY,
    {
      expiresIn: "30d",
    }
  );
};

// verify JWT
export const verifyToken = (jwtCookie: any) => {
  let encryptToken = jwt.verify(
    jwtCookie,
    config.ACCESS_TOKEN_KEY
  ) as tokenEntity;
  const id = encryptToken.id;
  if (!id) {
    return null;
  }
  return id;
};

export enum UserStatus {
  online = "online",
  offline = "offline",
}

export interface UserEntity {
  _id?: string;
  name: string;
  email: string;
  password: string;
  newMessages: any;
  status: string;
  image?: string | undefined;
  token?: string | undefined;
  refreshToken?: string | undefined;
}

export interface UserEntitySocket {
  id?: string;
  name: string;
  email: string;
  password: string;
  newMessages: any;
  status: string;
  image?: string | undefined;
  token?: string | undefined;
  refreshToken?: string | undefined;
}

export interface UserResponseDto {
  id: string;
  name: string;
  email?: string;
  image: string;
  status: string;
  newMessages?: string;
}

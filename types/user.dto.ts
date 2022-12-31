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

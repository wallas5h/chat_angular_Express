export enum MessageTypes {
  text = "text",
  image = "image",
  video = "video",
  raw = "raw",
  emoji = "emoji",
}

export interface Dictionary<Value> {
  [param: string]: Value;
}

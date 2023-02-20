export enum MessageTypes {
  text = "text",
  image = "image",
  video = "video",
  raw = "raw",
}

export interface Dictionary<Value> {
  [param: string]: Value;
}

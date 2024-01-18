import type BaseObject from "./baseOject.type";

interface Author extends BaseObject {
  name: string;
  nickname: string;
  color: string;
  discriminator: string;
  avatar_url: string;
  is_bot: boolean;
  timestamp_insert: string;
}

export default Author;

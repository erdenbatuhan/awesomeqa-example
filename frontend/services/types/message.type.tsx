import type BaseObject from "./baseOject.type";
import type Author from "./author.type";

interface Message extends BaseObject {
  channel_id: string;
  parent_channel_id?: string | null;
  community_server_id: string;
  timestamp: string;
  has_attachment: boolean;
  reference_msg_id?: string | null;
  timestamp_insert: string;
  discussion_id?: string | null;
  content: string;
  msg_url: string;
  author: Author;
}

export default Message;

import type BaseObject from "./baseOject.type";
import type Message from "./message.type";

interface Ticket extends BaseObject {
  msg_id: string;
  msg?: Message | null;
  status: string;
  resolved_by?: string | null;
  ts_last_status_change?: string | null;
  timestamp: string;
  context_messages: string[];
}

export default Ticket;

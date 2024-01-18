import axios, {AxiosResponse} from 'axios';

import Constants from "./constants";
import type Ticket from "./types/ticket.type";
import type Message from "./types/message.type";

interface TicketsResponse {
  ticket_count: number;
  tickets: Ticket[];
}

class TicketService {

  private static readonly API_URL: string = `${Constants.BASE_URL}/tickets`;

  static getTickets(
    page: number,
    pageSize: number,
    filter: {
      author?: string;
      msgContent?: string;
      statusList?: string[];
      timestampStart?: string;
      timestampEnd?: string;
    } = {}
  ): Promise<AxiosResponse<TicketsResponse>> {
    return axios.get<TicketsResponse>(`${TicketService.API_URL}`, {
      params: {
        page,
        page_size: pageSize,
        author: filter.author,
        msg_content: filter.msgContent,
        status: filter.statusList,
        timestamp_start: filter.timestampStart,
        timestamp_end: filter.timestampEnd
      },
      paramsSerializer: {
        indexes: null
      }
    });
  }

  static getTicketCounts(): Promise<AxiosResponse<{ [key: string]: number }>> {
    return axios.get<{ [key: string]: number }>(`${TicketService.API_URL}/counts`);
  }

  static getTicket(ticketId: string): Promise<AxiosResponse<Ticket>> {
    return axios.get<Ticket>(`${TicketService.API_URL}/${ticketId}`);
  }

  static getTicketContextMessages(ticketId: string): Promise<AxiosResponse<Message[]>> {
    return axios.get<Message[]>(`${TicketService.API_URL}/${ticketId}/messages`);
  }

  static closeTicket(ticketId: string): Promise<AxiosResponse<Ticket>> {
    return axios.put<Ticket>(`${TicketService.API_URL}/${ticketId}`);
  }

  static removeTicket(ticketId: string): Promise<AxiosResponse<Ticket>> {
    return axios.delete<Ticket>(`${TicketService.API_URL}/${ticketId}`);
  }
}

export default TicketService;

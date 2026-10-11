import { createClient } from "@/lib/supabase/client";

export interface SupportTicket {
  id: string;
  user_id: string;
  category: string;
  order_ref?: string;
  status: "OPEN" | "IN_PROGRESS" | "WAITING" | "RESOLVED";
  assigned_admin?: string;
  last_message_at: string;
  created_at: string;
}

export interface SupportChatMessage {
  id: string;
  ticket_id: string;
  sender_id: string;
  sender_role: "user" | "support" | "admin" | "system";
  message: string;
  photo_url?: string;
  read: boolean;
  created_at: string;
}

export class SupportService {
  /**
   * Creates a new support ticket and initial welcome message in Supabase
   */
  static async createTicket(userId: string, category: string, initialMsg: string, orderRef?: string): Promise<SupportTicket> {
    const supabase = createClient();
    const newTicketId = `TCK-${Date.now().toString().substring(5)}`;

    const { data: ticket } = await supabase
      .from("support_tickets")
      .insert([
        {
          id: newTicketId,
          user_id: userId,
          category,
          order_ref: orderRef,
          status: "OPEN",
          last_message_at: new Date().toISOString(),
        },
      ])
      .select()
      .maybeSingle();

    const createdTicket: SupportTicket = ticket || {
      id: newTicketId,
      user_id: userId,
      category,
      order_ref: orderRef,
      status: "OPEN",
      last_message_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    // Insert welcome and initial message
    await supabase.from("support_chat_messages").insert([
      {
        ticket_id: createdTicket.id,
        sender_id: "system-bot",
        sender_role: "system",
        message: `Hi! Thanks for contacting PartMatch Support regarding ${category}. An agent will respond shortly.`,
        read: true,
      },
      {
        ticket_id: createdTicket.id,
        sender_id: userId,
        sender_role: "user",
        message: initialMsg,
        read: false,
      },
    ]);

    return createdTicket;
  }

  /**
   * Sends a new message in a support chat thread
   */
  static async sendMessage(ticketId: string, senderId: string, senderRole: "user" | "support" | "admin" | "system", message: string): Promise<SupportChatMessage> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("support_chat_messages")
      .insert([
        {
          ticket_id: ticketId,
          sender_id: senderId,
          sender_role: senderRole,
          message,
          read: false,
        },
      ])
      .select()
      .maybeSingle();

    await supabase
      .from("support_tickets")
      .update({ last_message_at: new Date().toISOString() })
      .eq("id", ticketId);

    if (error || !data) {
      return {
        id: `msg-${Date.now()}`,
        ticket_id: ticketId,
        sender_id: senderId,
        sender_role: senderRole,
        message,
        read: false,
        created_at: new Date().toISOString(),
      };
    }

    return {
      id: String(data.id),
      ticket_id: String(data.ticket_id),
      sender_id: String(data.sender_id),
      sender_role: data.sender_role as SupportChatMessage["sender_role"],
      message: String(data.message),
      read: Boolean(data.read),
      created_at: String(data.created_at),
    };
  }

  /**
   * Fetches support tickets for user or admin auditing
   */
  static async getTickets(userId?: string): Promise<SupportTicket[]> {
    const supabase = createClient();
    let query = supabase.from("support_tickets").select("*").order("last_message_at", { ascending: false });

    if (userId) {
      query = query.eq("user_id", userId);
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      return [];
    }

    return data.map((t: Record<string, unknown>) => ({
      id: String(t.id),
      user_id: String(t.user_id),
      category: String(t.category),
      order_ref: t.order_ref ? String(t.order_ref) : undefined,
      status: (t.status as SupportTicket["status"]) || "OPEN",
      last_message_at: String(t.last_message_at),
      created_at: String(t.created_at),
    }));
  }

  /**
   * Fetches chat thread messages for a support ticket
   */
  static async getChatMessages(ticketId: string): Promise<SupportChatMessage[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("support_chat_messages")
      .select("*")
      .eq("ticket_id", ticketId)
      .order("created_at", { ascending: true });

    if (error || !data || data.length === 0) {
      return [
        {
          id: "msg-1",
          ticket_id: ticketId,
          sender_id: "system-bot",
          sender_role: "system",
          message: "Welcome to PartMatch Live Chat Support.",
          read: true,
          created_at: new Date().toISOString(),
        },
      ];
    }

    return data.map((m: Record<string, unknown>) => ({
      id: String(m.id),
      ticket_id: String(m.ticket_id),
      sender_id: String(m.sender_id),
      sender_role: (m.sender_role as SupportChatMessage["sender_role"]) || "user",
      message: String(m.message),
      read: Boolean(m.read),
      created_at: String(m.created_at),
    }));
  }
}

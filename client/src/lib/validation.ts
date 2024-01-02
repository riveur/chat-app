import z from "zod";

export const UserValidation = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string().email(),
  avatar_url: z.string().url(),
  created_at: z.string().datetime({ offset: true }),
  updated_at: z.string().datetime({ offset: true })
});

export const UsersValidation = z.array(UserValidation);

export const MessageValidation = z.object({
  content: z.string(),
  sender_id: z.number(),
  receiver_id: z.number()
});

export const MessagesValidation = z.array(MessageValidation);

export const ConversationsValidation = z.record(z.string(), MessagesValidation);

export type UserSchema = z.infer<typeof UserValidation>;
export type MessageSchema = z.infer<typeof MessageValidation>;
export interface User {
  id: string;
  username: string;
  joinedAt: Date;
}

export interface Room {
  id: string;
  name: string;
  creator: string;
  members: string[];
  createdAt: Date;
}

export interface Message {
  id: number;
  userId: string;
  username: string;
  content: string;
  timestamp: string;
  roomId?: string;
}

export interface ServerToClientEvents {
  message: (data: { type: string; content: string; timestamp: string }) => void;
  'user:connected': (data: { userId: string; timestamp: string }) => void;
  'user:disconnected': (data: { userId: string; timestamp: string }) => void;
  'users:list': (users: User[]) => void;
  'message:new': (message: Message) => void;
  'room:created': (data: { roomId: string; roomName: string }) => void;
  'room:joined': (data: { roomId: string; roomName: string }) => void;
  'room:user_joined': (data: { userId: string; username: string }) => void;
  'room:user_left': (data: { userId: string; username: string }) => void;
  'room:message_new': (message: Message) => void;
  'rooms:list': (rooms: Room[]) => void;
  'typing:user': (data: { userId: string; username?: string; isTyping: boolean }) => void;
  pong: (data: { timestamp: string }) => void;
  error: (data: { message: string }) => void;
}

export interface ClientToServerEvents {
  'user:register': (data: { username: string }) => void;
  'message:send': (data: { content: string }) => void;
  'room:create': (data: { roomName: string }) => void;
  'room:join': (data: { roomId: string }) => void;
  'room:leave': (data: { roomId: string }) => void;
  'room:message': (data: { roomId: string; content: string }) => void;
  'typing:start': (data?: any) => void;
  'typing:stop': () => void;
  ping: () => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  user?: User;
}
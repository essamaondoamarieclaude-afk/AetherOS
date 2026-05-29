import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function connectSocket(token?: string) {
  if (socket?.connected) return socket;

  socket = io('/', {
    transports: ['websocket', 'polling'],
    auth: token ? { token } : undefined,
  });

  socket.on('connect', () => {
    console.log('[AetherOS] Socket connected to backend');
  });

  socket.on('disconnect', (reason) => {
    console.log('[AetherOS] Socket disconnected:', reason);
  });

  socket.on('connect_error', (err) => {
    console.warn('[AetherOS] Socket connection error:', err.message);
  });

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function getSocket() {
  return socket;
}

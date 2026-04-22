import {io, Socket} from 'socket.io-client';

const Backend_URL = import.meta.env.VITE_BACKEND_URL;

const socket: Socket = io(Backend_URL, {
  withCredentials: true,
  autoConnect: false,
  transports: ["websocket"]
});

export default socket;
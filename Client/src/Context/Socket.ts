import {io, Socket} from 'socket.io-client';

const Backend_URL = "http://localhost:5000";

const socket: Socket = io(Backend_URL, {
  withCredentials: true,
  autoConnect: false,
  transports: ["websocket"] // 👈 IMPORTANT
});

export default socket;
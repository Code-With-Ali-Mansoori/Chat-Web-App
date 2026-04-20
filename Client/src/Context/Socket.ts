import {io, Socket} from 'socket.io-client';

const Backend_URL = "https://chatsy-y2s8.onrender.com";

const socket: Socket = io(Backend_URL, {
  withCredentials: true,
  autoConnect: false,
  transports: ["websocket"]
});

export default socket;
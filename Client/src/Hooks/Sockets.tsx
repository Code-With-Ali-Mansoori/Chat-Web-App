import { useContext } from "react";
import socketContext from "../Context/Socket_Context";

export const useSocket = () => {
  const socket = useContext(socketContext);
  if (!socket) throw new Error("useSocket must be used inside SocketProvider");
  return socket;
};

import { useEffect } from "react";
import { useSocket } from "./Sockets";
import { useSearchParams } from "react-router-dom";

export function useUnloadWarning() {

  const socket = useSocket();
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get("roomId") as string;

useEffect(() => {
  const handleLeave = () => {
    socket.emit('disconnect-the-call', roomId);
  };

  const handleBeforeUnload = (event: BeforeUnloadEvent) => {
    event.preventDefault();
    event.returnValue = ""; // required for Chrome
  };

  window.addEventListener("beforeunload", handleBeforeUnload);
  window.addEventListener("pagehide", handleLeave);

  return () => {
    window.removeEventListener("pagehide", handleLeave);
    window.removeEventListener("beforeunload", handleBeforeUnload);
  };
}, [socket, roomId]);
};

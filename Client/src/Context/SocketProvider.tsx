import { useEffect, type ReactNode } from "react"
import socketContext from "./Socket_Context"
import socket  from "./Socket";

interface appType {
    children : ReactNode;
}

const SocketProvider = ({children} : appType) => {

  useEffect(() => { socket.connect();
        return () => { socket.disconnect() };
  }, []);

  return (
    <socketContext.Provider value={socket}>
        {children}
    </socketContext.Provider>
  )
}

export default SocketProvider

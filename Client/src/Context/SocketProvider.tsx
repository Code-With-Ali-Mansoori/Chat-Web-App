import { useEffect, type ReactNode } from "react"
import socketContext from "./Socket_Context"
import socket  from "./Socket";
import { useNavigate } from "react-router-dom";

interface appType {
    children : ReactNode;
}

const SocketProvider = ({children} : appType) => {

  const navigator = useNavigate();

  useEffect(() => { 
        socket.connect();

        socket.on('incomming-audio-call', (room_id, callerId) => {
          // socket.emit('join-room', room_id);
          navigator(`/incoming-audio-call/?roomId=${room_id}&Caller-User-Id=${callerId}`)
        });

        socket.on('incomming-video-call', (room_id, callerId) => {
          // socket.emit('join-room', room_id);
          navigator(`/incoming-video-call/?roomId=${room_id}&Caller-User-Id=${callerId}`);
        });

        return () => { 
          socket.disconnect();
          socket.off('incomming-audio-call');
          socket.off('incomming-video-call');
        };
        
  }, [navigator]);

  return (
    <socketContext.Provider value={socket}>
        {children}
    </socketContext.Provider>
  )
}

export default SocketProvider

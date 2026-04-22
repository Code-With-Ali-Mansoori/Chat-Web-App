import { Phone, PhoneOff, Video } from "lucide-react";
import { useSocket } from "../Hooks/Sockets";
import { useNavigate, useSearchParams } from "react-router-dom";
import useOtherUser from "../Hooks/useOtherUser";
import useProfile_Hooks from "../Hooks/Profile.Hook";
import { useCallback, useEffect } from "react";
import { useUnloadWarning } from "../Hooks/useUnloadWarning";

export default function IncomingVideoCall() {

  useUnloadWarning();
  const socket = useSocket();
  const navigators =  useNavigate();
  
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get("roomId");
  const user_Id = searchParams.get("Caller-User-Id");
    
  const { data : Other_UserData } = useOtherUser(user_Id as string);
  const { data : myProfile } = useProfile_Hooks();

  const hanlde_Disconnect_Call = useCallback(() => {
      
      alert('⚠️ Network has Interupted');
    
      setTimeout(() => {
          navigators(`/chat-room?roomId=${roomId}&otherUser-public_Id=${Other_UserData?.user_publicId}`);
          socket.emit('disconnect-the-call', roomId);
      }, 2000);
      
    }, [Other_UserData?.user_publicId, navigators, roomId, socket]);

  useEffect(() => {
        socket.emit('join-room', roomId);
    
        socket.on('end-video-called', () => {      
          navigators(-1); //chat-room?roomId=${roomId}&otherUser-public_Id=${Other_UserData.user_publicId}`
        });

        socket.on('disconnect-the-call', hanlde_Disconnect_Call);

        socket.on('VideoCall-not-reached', () => {
           console.log('You have missed the call!');
           navigators(-1); ///chat-room?roomId=${roomId}&otherUser-public_Id=${Other_UserData.user_publicId}
        });
    
        return () => {
          socket.off('end-video-called');
          socket.off('disconnect-the-call', hanlde_Disconnect_Call);
          socket.off('VideoCall-not-reached');
        };
    
  }, [navigators, socket, roomId, Other_UserData?.user_publicId, hanlde_Disconnect_Call]);

  const handle_Reject_Call = (roomId : string ) => {
      socket.emit('reject-video-call', roomId , myProfile?.message.data.user_id );
      // navigators(`/chat-room?roomId=${roomId}&otherUsPer-public_Id=${user_Id}`); //Other_Id 
      navigators(-1);
  };

  const handle_Accept_Call = ( roomId : string , user_Id : string ) => {
      setTimeout(() => {
          socket.emit('accept-video-call', roomId , myProfile?.message.data.user_id ); //MineId 
      }, 200);
      navigators(`/active-video-call?roomId=${roomId}&Called-User-Id=${user_Id}`); //OtherUser
  };

  return (
    <div className="h-screen w-full bg-black text-white flex flex-col justify-between overflow-hidden relative">

      {/* 🎥 BACKGROUND (Remote Preview / Placeholder) */}
      <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
        {/* <span className="text-gray-500 text-sm">Incoming Video...</span> */}
      </div>

      {/* 🔵 MAIN CONTENT */}
      <div className="flex flex-col items-center justify-center flex-1 relative z-10 gap-3">

        {/* Avatar */}
        <div className="
  w-24 h-24 
  sm:w-32 sm:h-32 
  md:w-40 md:h-40 
  rounded-full 
  border-2
  overflow-hidden
">
  <img
    src={Other_UserData?.userAvatar}
    alt="avatar"
    className="w-full h-full object-cover"
  />
</div>

        <h2 className="text-base sm:text-lg md:text-xl font-semibold">
          {Other_UserData?.username}
        </h2>

        <div className="text-xs flex justify-center gap-1 items-center sm:text-sm text-gray-400">
          <Video className="mt-1" size={16}/>
          <p>Incoming Video Call...</p>
        </div>

        {/* Optional camera icon */}
        {/* <Video className="mt-2 text-gray-300" size={28} /> */}
      </div>

      {/* 🧍 SELF PREVIEW (optional) */}
      {/* <div className="
        absolute 
        top-4 right-4 
        w-20 h-28 
        sm:w-24 sm:h-32 
        bg-gray-800 
        rounded-lg 
        flex items-center justify-center 
        border border-gray-600
      ">
        <span className="text-[10px] text-gray-400">You</span>
      </div> */}

      {/* ⚫ FOOTER */}
      <div className="relative z-10 bg-gray-400 backdrop-blur py-5 flex justify-center items-center gap-10 ">

        {/* ❌ Decline */}
        <button onClick={() => handle_Reject_Call(roomId as string)} className="p-5 rounded-full bg-red-600 hover:bg-red-700">
          <PhoneOff size={22} />
        </button>

        {/* ✅ Accept */}
        <button onClick={() => handle_Accept_Call(roomId as string, Other_UserData.user_publicId as string)}  className="p-5 rounded-full bg-green-600 hover:bg-green-700">
          <Phone size={22} />
        </button>
      </div>
    </div>
  );
}
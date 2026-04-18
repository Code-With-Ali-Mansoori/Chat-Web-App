import { Phone, PhoneOff } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useOtherUser from "../Hooks/useOtherUser";
import { useSocket } from "../Hooks/Sockets";
import useProfile_Hooks from "../Hooks/Profile.Hook";
import { useCallback, useEffect } from "react";
import { useUnloadWarning } from "../Hooks/useUnloadWarning";

export default function IncomingAudioCall() {

  const socket = useSocket();
  const navigators =  useNavigate();

  const [searchParams] = useSearchParams();
  const roomId = searchParams.get("roomId");
  const user_Id = searchParams.get("Caller-User-Id");
  
  const { data : Other_UserData } = useOtherUser(user_Id as string);
  const { data : myProfile } = useProfile_Hooks();
  
  useUnloadWarning();

  const handle_Reject_Call = (roomId : string) => {
      socket.emit('reject-audio-call', roomId , myProfile?.message.data.user_id );
      navigators(-1);
      // /chat-room?roomId=${roomId}&otherUser-public_Id=${user_Id}
  };

  const handle_Accept_Call = ( roomId : string , user_Id : string ) => {
      // // 🔧 Join room immediately to ensure we're in the room when accepting
      socket.emit('join-room', roomId);
      
      // Wait a bit to ensure join-room is processed, then send accept
      setTimeout(() => {
          socket.emit('accept-audio-call', roomId , myProfile?.message.data.public_Id ); //MineId 
      }, 200);
      
      navigators(`/active-audio-call?roomId=${roomId}&Called-User-Id=${user_Id}`); //OtherUser
  };

  const hanlde_Disconnect_Call = useCallback(() => {   
    alert('⚠️ Network has Interupted');
      
    setTimeout(() => {
      navigators(`/chat-room?roomId=${roomId}&otherUser-public_Id=${Other_UserData?.user_publicId}`);
      socket.emit('disconnect-the-call', roomId);
    }, 2000);
        
  }, [Other_UserData?.user_publicId, navigators, roomId, socket]);

  useEffect(() => {
      socket.emit('join-room', roomId);
  
      socket.on('end-audio-called', () => {      
        navigators(-1);
        //`/chat-room?roomId=${roomId}&otherUser-public_Id=${Other_UserData?.user_publicId}`
      });

      socket.on('disconnect-the-call', hanlde_Disconnect_Call);

      socket.on('AudioCall-not-reached', () => {
           console.log('You have missed the call!');
           navigators(-1); //chat-room?roomId=${roomId}&otherUser-public_Id=${Other_UserData.user_publicId}`
      });
  
      return () => {
        socket.off('end-audio-called');
        socket.off('disconnect-the-call', hanlde_Disconnect_Call);
        socket.off('AudioCall-not-reached');
      };
  
    }, [navigators, socket, roomId, Other_UserData?.user_publicId, hanlde_Disconnect_Call]);

  return (
    <div className="h-screen w-full bg-[#242323] flex flex-col justify-between text-white overflow-hidden">

      {/* 🔵 MAIN */}
      <div className="flex flex-col items-center justify-center flex-1 gap-4">

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

        {/* Name */}
        <h2 className="text-sm sm:text-base md:text-lg font-semibold">
          {Other_UserData?.username}
        </h2>

        {/* Status */}
        <p className="text-xs sm:text-sm text-gray-300">
          Incoming Audio Call...
        </p>
      </div>

      {/* ⚫ FOOTER */}
      <div className="bg-gray-300 py-5 flex justify-center items-center gap-10 ">

        {/* ❌ Decline Other_UserData?.user_publicId as string */}
        <button onClick={() => handle_Reject_Call(roomId as string)} className="p-5 rounded-full bg-red-600 hover:bg-red-700">
          <PhoneOff size={22} />
        </button>

        {/* ✅ Accept */}
        <button onClick={() => handle_Accept_Call(roomId as string, Other_UserData?.user_publicId as string)} className="p-5 rounded-full bg-green-600 hover:bg-green-700">
          <Phone size={22} />
        </button>
      </div>
    </div>
  );
}
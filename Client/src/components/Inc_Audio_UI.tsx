import { Phone, PhoneOff } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useOtherUser from "../Hooks/useOtherUser";
import { useSocket } from "../Hooks/Sockets";
import useProfile_Hooks from "../Hooks/Profile.Hook";
import { useEffect } from "react";

export default function IncomingAudioCall() {

  const socket = useSocket();
  const navigator =  useNavigate();

  const [searchParams] = useSearchParams();
  const roomId = searchParams.get("roomId");
  const user_Id = searchParams.get("Caller-User-Id");
  
  const { data : Other_UserData } = useOtherUser(user_Id as string);
  const { data : myProfile } = useProfile_Hooks();
  
  const handle_Reject_Call = (roomId : string , user_Id : string) => {
      socket.emit('reject-audio-call', roomId , myProfile?.message.data.public_Id );
      navigator(`/chat-room?roomId=${roomId}&otherUser-public_Id=${user_Id}`); //Other_Id 
  };

  const handle_Accept_Call = ( roomId : string , user_Id : string ) => {
      setTimeout(() => {
          socket.emit('accept-audio-call', roomId , myProfile?.message.data.public_Id ); //MineId 
      }, 100);
      navigator(`/active-audio-call?roomId=${roomId}&Called-User-Id=${user_Id}`); //OtherUser
  };

  useEffect(() => {
      socket.emit('join-room', roomId);
  
      socket.on('end-audio-called', ( roomId : string ) => {      
        navigator(`/chat-room?roomId=${roomId}&otherUser-public_Id=${Other_UserData.user_publicId}`);
      });
  
      return () => {
        socket.off('end-audio-called');
      };
  
    }, [navigator, socket, roomId, Other_UserData.user_publicId]);

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

        {/* ❌ Decline */}
        <button onClick={() => handle_Reject_Call(roomId as string, Other_UserData.user_publicId as string)} className="p-5 rounded-full bg-red-600 hover:bg-red-700">
          <PhoneOff size={22} />
        </button>

        {/* ✅ Accept */}
        <button onClick={() => handle_Accept_Call(roomId as string, Other_UserData.user_publicId as string)} className="p-5 rounded-full bg-green-600 hover:bg-green-700">
          <Phone size={22} />
        </button>
      </div>
    </div>
  );
}
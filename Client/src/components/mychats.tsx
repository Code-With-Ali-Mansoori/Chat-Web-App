import useMyChat_Rooms from "../Hooks/useMy.Chats";
import SMchatRoomsUI from "./SMchatRooms";
import notFoundIllustrate from '../assets/chat_not.png';

export type RoomMember = {
  admin_Userid: string;
  Other_Userid: string;
};

export type ChatRoom = {
  roomId: string;
  members: RoomMember[];
  last_Msg: null | string; 
};

const Mychats = () => { 
  const {data} = useMyChat_Rooms();
  const myRooms = data?.data?.message;

  return (
    <div className="w-full h-full">
      <h2 className="ml-1 text-gray-600 font-mono pt-3">My Chats</h2>

      { myRooms && typeof(myRooms) !== 'string' && (myRooms.map((room : ChatRoom) => (
           <SMchatRoomsUI key={room.roomId} roomId={room.roomId}/>
        )))
      }
         
      { typeof(myRooms) === 'string' && 
        <div className="w-full flex flex-col items-center justify-center py-8 gap-3">
          <img className="w-48 h-52 md:w-84 md:h-90 mx-auto object-contain" src={notFoundIllustrate} alt="Record_not_found" />
          <h1 className="md:text-2xl md:font-medium text-gray-500 text-center">No Chat-room is Created Yet!</h1>
        </div> 
      }

    </div>   
  )
};

export default Mychats;

import { useNavigate } from "react-router-dom";
import { capitalizeFirstLetter } from "../helper/LetterFirst";
import UseRoomUserData from "../Hooks/UseRoomUserData";

type propesType = {
    roomId : string,
};

const SMchatRoomsUI = ({roomId } : propesType) => {

  const navigator =  useNavigate();
  const {data} = UseRoomUserData(roomId);  

  const formatted = new Date(data?.data?.message?.last_active).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
   });  

  return ( data && 
    <div onClick={() => { 
        navigator(`/chat-room?roomId=${roomId}&otherUser-public_Id=${data?.data?.message?.public_user_id}`)}} id={roomId} className="w-full my-3 h-13 flex justify-between items-center border rounded border-gray-500 p-2 hover:cursor-pointer hover:bg-gray-100"> 
    
            <div className=" md:pl-">
                <img className="h-9 w-9 cursor-pointer rounded-full"
                src={data?.data?.message?.user_avatar} alt="user_avatar" />
            </div>

            <div className="flex w-4/6 p-1 px-3 flex-col justify-center items-start">
                <p>{capitalizeFirstLetter(data?.data?.message?.username)}</p>
                <small className="font-light">{formatted}</small>
            </div>

            <div className="md: flex justify-end w-2/6">
                <small className="items-end px-1 font-medium text-gray-400 ">
                    {data?.data?.message?.active_Status ? 'Online' : 'offline'}
                </small>
            </div>
    </div>
)};

export default SMchatRoomsUI;
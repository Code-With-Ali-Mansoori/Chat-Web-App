// import { useState } from "react";
import { BiCheckDouble } from "react-icons/bi";
import useProfile_Hooks from "../Hooks/Profile.Hook";
import useOtherUser from "../Hooks/useOtherUser";
import { useSearchParams } from "react-router-dom";
import type { NewMessage } from "./Chat_UI";

interface msgSeen {
  recived_msg : NewMessage
  msg_seen : boolean
};

const Text_Ui = ({recived_msg, msg_seen} : msgSeen) => {

  const [searchParams] = useSearchParams();
  const publicId = searchParams.get("otherUser-public_Id") as string; 

  const { data : myProfile } = useProfile_Hooks();
  const { data : Other_UserData } = useOtherUser(publicId);

  // isMine = true for messages I sent; used to show sender read status only on my own messages
  const isMine = recived_msg.sender_id === myProfile?.message.data.user_id;
  
  // useEffect(() => {
  //   setMyId(mine_id);

  //   if ( myId == recived_msg.sender_id ) {
  //     setIsMine(true);

  //   } else {
  //     setIsMine(false);
  //   };   
    
  //   console.log(msg_seen);
    

  // }, [setMyId, mine_id, myId, recived_msg.sender_id, msg_seen]);
  
  return ( <>  
    <div className="w-full h-fit py-2 "> 
  
    {/* Actual-Message */}
    <div className={`flex ${ isMine ? "justify-end" : "justify-start" } w-full  gap-3`}>
            <div className={`${isMine ? "hidden" : "block"} hover:cursor-pointer mt-1  h-9 w-9`}>
              <img className="w-full  border border-gray-100 rounded-full h-full" src={isMine ? myProfile?.message.data.avatar : Other_UserData?.userAvatar} />
            </div>

            <div className={`border  
              ${isMine ? 'ml-12 lg:ml-30 bg-white border-gray-300': "mr-12 lg:mr-30 md:mr-14  bg-gray-100 border-gray-300 "}  
              inline  w-fit md:px-4 py-1 px-3 md:py-2 rounded-2xl`}>
                <small>{recived_msg.Text_data?.msg}</small>

                {/* <small className={`pt-1 flex w-full hidden items-center
                  ${isMine ? "justify-start" : "justify-end"} `}>
                    <span>08:33 pm</span>
                </small> */}
            </div>

            <div className={`md:h-8 ${isMine ? "block" : "hidden"} hover:cursor-pointer mt-1 md:w-9 h-8 w-9`}>
              <img className="w-full border border-gray-100 rounded-full h-full" src={isMine ? myProfile?.message.data.avatar : Other_UserData?.userAvatar}/>
            </div>
    </div>

{/* Facing Bug in seen feature */}
{/* When user eneters the room, my msgs is seen but */}
{/* When he stays in same room while Chating, Seen feature does not work! */}

    {/* Seen */}
    {isMine && <small className={`w-full flex gap-1 ${isMine ? "justify-end md:pr-12 pr-11" : "justify-start md:pl-12 pl-11"} ${msg_seen ? '': 'text-gray-500'}`}>
      {msg_seen ? 'seen': 'sent'} 
      {msg_seen ? <BiCheckDouble className="mt-1 text-blue-500"/>: <BiCheckDouble className="mt-1 text-gray-500"/>} 
    </small> }

    </div>
</>
)}

export default Text_Ui;
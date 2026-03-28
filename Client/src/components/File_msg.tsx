import { FolderOpen } from "lucide-react";
import { BiCheckDouble } from "react-icons/bi";
import useProfile_Hooks from "../Hooks/Profile.Hook";
import useOtherUser from "../Hooks/useOtherUser";
import { useSearchParams } from "react-router-dom";
import type { NewMessage } from "./Chat_UI";

interface msgSeen {
  recived_msg : NewMessage
  msg_seen : boolean
};

const File_msg = ({recived_msg, msg_seen} : msgSeen) => {

  const [searchParams] = useSearchParams();
  const publicId = searchParams.get("otherUser-public_Id") as string; 

  const { data : myProfile } = useProfile_Hooks();
  const { data : Other_UserData } = useOtherUser(publicId);

  const isMine = recived_msg.sender_id === myProfile?.message.data.user_id;

  // Extract file name from URL
  const fileName = recived_msg.Media_data?.File_url ? recived_msg.Media_data.File_url.split('/').pop() || 'Unknown File' : 'Unknown File';  

  return (<div>
    <div className="w-full flex justify-start h-fit py-2 ">
        <div className={`flex w-full ${isMine ? 'justify-end' : 'justify-start'} gap-3`}>
            
            <div className={`${isMine ? 'hidden' : 'block'} hover:cursor-pointer md:h-8 mt-1 md:w-8 h-8 w-8`}>
                    <img className="w-full border border-gray-100 rounded-full  h-full" src={Other_UserData?.userAvatar} alt="user_profile_img" />
            </div>

            <div className={`bg-gray-100 border-gray-300 w-46  rounded-2xl h-18 px-4  border py-2`}>
                <a href={recived_msg.Media_data?.File_url} target="_blank" className="flex pb-2 py-1 w-full justify-center items-center gap-3 border-b border-gray-200">
                  <FolderOpen strokeWidth={1.25} size={24}/>
                  <h3>{fileName.length > 9 ? fileName.substring(0, 9) + '...' : fileName}</h3>
                </a>
                <div className={`${isMine ? "justify-start" : "justify-end"} gap-1 py-1  flex w-full items-center ml-1  `}>
                    <small>File sent at</small>
                    <small>08:33 pm</small>
                </div>
            </div>

            <div className={`${isMine ? 'block' : 'hidden'} hover:cursor-pointer md:h-8 mt-1 md:w-8 h-8 w-8`}>
                    <img className="w-full border border-gray-100 rounded-full  h-full" src={myProfile?.message.data.avatar} alt="user_profile_img" />
            </div>

        </div>     
    </div>
    {isMine && <small className={`w-full flex gap-1 ${isMine ? "justify-end md:pr-12 pr-11" : "justify-start md:pl-12 pl-11"} `}>
               {msg_seen ? 'seen': 'sent'} 
               {msg_seen ? <BiCheckDouble className="mt-1 text-blue-500"/>: <BiCheckDouble className="mt-1 text-gray-500"/>} 
        </small> }
  </div>)
}

export default File_msg;
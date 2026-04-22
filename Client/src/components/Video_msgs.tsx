import { BiCheckDouble } from "react-icons/bi";
import type { NewMessage } from "./Chat_UI";
import useProfile_Hooks from "../Hooks/Profile.Hook";
import useOtherUser from "../Hooks/useOtherUser";
import { useSearchParams } from "react-router-dom";
import { handle_Time_in_HR } from "../helper/date";

interface msgSeen {
  recived_msg : NewMessage
  msg_seen : boolean
};

const Video_msgs = ({recived_msg, msg_seen} : msgSeen) => {

  const [searchParams] = useSearchParams();
  const publicId = searchParams.get("otherUser-public_Id") as string; 

  const { data : myProfile } = useProfile_Hooks();
  const { data : Other_UserData } = useOtherUser(publicId);

  const isMine = recived_msg.sender_id === myProfile?.message.data.user_id;  
  const Sent_Time = handle_Time_in_HR(recived_msg.SentAt!);
  
  return (
    <div className="w-full h-fit py-2 ">
        <div className={`flex ${isMine ? 'justify-end' : 'justify-start'}  w-full justify-center gap-3`}>
            <div className={`md:h-8 ${isMine ? 'hidden' : 'block'} hover:cursor-pointer mt-1 md:w-8 h-8 w-8`}>
                    <img className="w-full border border-gray-100 rounded-full  h-full" src={Other_UserData?.userAvatar} alt="user_profile_img" />
            </div>
            
            <div className={`border ${isMine ? 'md:ml-14 ml-8 lg:ml-30' : 'md:mr-14 mr-8 lg:mr-30'} border-gray-300 bg-gray-100 rounded-2xl`}>
              <a href={recived_msg.Media_data?.File_url} target="_blank" rel="noopener noreferrer"
              className="block md:w-80 md:h-40 w-48 h-28 cursor-pointer">
                <video src={recived_msg.Media_data?.File_url}  loop  controls className="h-full w-full rounded-t-2xl object-cover"/>
              </a>
              
              <div className={`${isMine ? "justify-start" : "justify-end"} gap-1  p-2 flex justify-end w-full items-center text-right`} >
                 <small>Video sent at</small>
                  <small>{Sent_Time.length > 0 && Sent_Time}</small>
              </div>
            </div>

            <div className={`md:h-8 ${isMine ? 'block' : 'hidden'} hover:cursor-pointer mt-1 md:w-8 h-8 w-8`}>
                    <img className="w-full border border-gray-100 rounded-full  h-full" src={myProfile?.message.data.avatar} alt="user_profile_img" />
            </div>
        </div>

      { isMine && <small className={`w-full flex gap-1 ${isMine ? "justify-end md:pr-12 pr-11" : "justify-start md:pl-12 pl-11"} ${msg_seen ? '': 'text-gray-500'}`}>
        {msg_seen ? 'seen': 'sent'} 
        {msg_seen ? <BiCheckDouble className="mt-1 text-blue-500"/>: <BiCheckDouble className="mt-1 text-gray-500"/>} 
      </small>  }
    </div>
  )
}

export default Video_msgs;

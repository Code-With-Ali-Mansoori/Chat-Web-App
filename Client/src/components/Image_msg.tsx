import { BiCheckDouble } from "react-icons/bi";
import type { NewMessage } from "./Chat_UI";
import useProfile_Hooks from "../Hooks/Profile.Hook";
import useOtherUser from "../Hooks/useOtherUser";
import { useSearchParams } from "react-router-dom";

interface msgSeen {
  recived_msg : NewMessage
  msg_seen : boolean
};

const Image_msgs = ({recived_msg, msg_seen} : msgSeen) => {

  const [searchParams] = useSearchParams();
  const publicId = searchParams.get("otherUser-public_Id") as string; 

  const { data : myProfile } = useProfile_Hooks();
  const { data : Other_UserData } = useOtherUser(publicId);

  const isMine = recived_msg.sender_id === myProfile?.message.data.user_id;  

  return (
    <div className="w-full h-fit py-2 ">

        <div className={`flex ${isMine ? 'justify-end' : 'justify-start'}  w-full gap-3`}>
            <div className={`${isMine ? 'hidden' : 'block'} hover:cursor-pointer md:h-8 mt-1 md:w-8 h-8 w-8`}>
                    <img className="w-full border border-gray-100 rounded-full  h-full" src={Other_UserData?.userAvatar} alt="user_profile_img" />
            </div>
            
            <div className={`border bg-gray-100 border-gray-300 rounded-2xl ${isMine ? 'md:ml-14 ml-8 lg:ml-30' : 'md:mr-14 mr-8 lg:mr-30'}`}>
              <a href={recived_msg.Media_data?.File_url} target="_blank" rel="noopener noreferrer"
              className="block md:w-80 md:h-40 w-48 h-28 cursor-pointer">
                <img src={recived_msg.Media_data?.File_url} alt="Shared media" className="h-full w-full rounded-t-2xl object-cover"/>
              </a>
              <div className={`p-2 flex w-full items-center gap-1
                  ${isMine ? "justify-start" : "justify-end"} `}>
                    <small>Image sent at</small>
                    <small>08:33 pm</small>
                  </div>
            </div>

            <div className={`md:h-8 ${isMine ? 'block' : 'hidden'} hover:cursor-pointer mt-1 md:w-8 h-8 w-8`}>
                    <img className="w-full border border-gray-100 rounded-full  h-full" src={myProfile?.message.data.avatar} alt="user_profile_img" />
            </div>

        </div>

        { isMine && <small className={`w-full flex gap-1 ${isMine ? "justify-end md:pr-12 pr-11" : "justify-start md:pl-12 pl-11"} ${msg_seen ? '': 'text-gray-500'}`}>
          {msg_seen ? 'seen': 'sent'} 
          {msg_seen ? <BiCheckDouble className="mt-1 text-blue-500"/>: <BiCheckDouble className="mt-1 text-gray-500"/>} 
        </small> }
    </div>
  )
}

export default Image_msgs

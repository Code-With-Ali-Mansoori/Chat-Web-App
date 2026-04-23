import { useCallback, useEffect, useState } from "react";
import { handle_Called_UserData } from "../helper/Update_call";
import type { CallHistory } from "./Call_history_pg";
import { IoVideocam } from "react-icons/io5";
import useProfile_Hooks from "../Hooks/Profile.Hook";
import { MdPhone } from "react-icons/md";

type Props = {
  logs: CallHistory;
};

type userDatas = {
  user_avatar : string,
  username : string
}

const Call_logs = ({logs} : Props) => {

    const [userData, setuserData] = useState<userDatas | null>(null);
    const { data: myData } = useProfile_Hooks();

    const fetchUserData = useCallback(
      async () => {
        if ( myData?.message?.data.user_id === logs.caller_id) { 
            const data = await handle_Called_UserData(logs.callee_id);
            setuserData(data);

        } else {
            const data = await handle_Called_UserData(logs.caller_id);
            setuserData(data);

        };
      },[logs.callee_id, myData?.message?.data.user_id, logs.caller_id])
    
    useEffect(() => {   
        fetchUserData();
    }, [fetchUserData]);
  

    // Determine if this is an incoming or outgoing call
    const isIncoming = logs.caller_id !== myData?.message.data.user_id;
    const callDirection = isIncoming ? "Incoming" : "Outgoing";
    const CallIcon = logs.call_type === "video-call" ? "Video Call" : "Audio Call";  

    // Format the call time
    const callTime = new Date(logs.updatedAt).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    // Format call duration
    const formatDuration = (duration: string) => {
      const seconds = parseInt(duration);
      if (seconds < 60) return `${seconds}s`;
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
    };

    // Determine call status
    const callStatus = logs.call_connect ? formatDuration(logs.call_duration) : "Missed";

  return ( <div className="w-full my-3 h-13 flex justify-between items-center border rounded border-gray-500 p-2 hover:bg-gray-100">

            <div>
                <img className="md:h-10 md:w-12 h-9 w-10 cursor-pointer rounded-full"
                src={userData?.user_avatar} alt="user_avatar" />
            </div>

            <div className="flex md:w-4/6 w-5/6 p-1 px-3 flex-col justify-center items-start">
                <p className="md:font-mono text-sm">{userData?.username}</p>
                <small className="font-mono block md:hidden">{callDirection === 'Incoming' ? ' ↙ ': ' ↗ '}{CallIcon}</small>
                <small className="font-light hidden md:block">{callTime}</small>
            </div>

            <div className="md:flex hidden justify-end w-1/6 items-center gap-1">
                {/* <small className="font-mono hidden md:block">↙ Incoming </small> */}
                <small className="font-mono hidden md:block">{callDirection === 'Incoming' ? '↙': '↗'} {callDirection} </small>
            </div>

            {/* <div className="hidden md:flex justify-end items-center gap-1 w-1/6 ">   
                <small className="font-mono hidden md:block">Audio Call</small>
                <MdPhone  size={12} />
            </div> */}

            <div className="hidden md:flex justify-end items-center gap-2 w-1/6 ">  
                { CallIcon === "Video Call" ? <IoVideocam  size={12} /> : <MdPhone  size={12} /> }   
                <small className="font-mono hidden md:block">Call</small>
            </div>

            <div className=" flex justify-end w-1/6">
                <small className={`items-end px-1 font-medium ${logs.call_connect ? 'text-green-600' : 'text-red-600'}`}>
                    {callStatus}
                </small>
            </div>
    </div>
)
}

export default Call_logs

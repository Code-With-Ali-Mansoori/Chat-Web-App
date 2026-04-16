import { useEffect, useState } from "react";
import { handle_CallLogs_display } from "../helper/Update_call";
import Call_logs from "./Call_logs";

export type CallHistory = {
  _id: string;
  caller_id: string;
  callee_id: string;
  room_id: string;
  call_type: "audio-call" | "video-call";
  call_connect: boolean;
  call_duration: string;
  updatedAt: string;
};

const Call_history_pg = () => {

const [callHistory, setCallHistory] = useState<null | CallHistory[]>(null);

useEffect(() => { 
  const fetchData = async () => {
    const data = await handle_CallLogs_display();
    setCallHistory(data);
  };

  fetchData();
}, []);
 
  return (
    <div className="w-full h-full py">
      <h2 className="ml-1 text-gray-600 font-mono pt-3">Call History</h2>

    { callHistory !== null && callHistory.length > 0 ?
        (
            callHistory.map((data : CallHistory ) => (
                <Call_logs key={data._id} logs={data} />
            ))
        ) 
      :   
        <div className="w-full h-full flex flex-col items-center justify-center gap-3">
          <img className="md:h-90 md:w-90 w-50 h-50 mx-auto rounded-2xl" src='../public/call_Not_found.png' alt="Record_not_found" />
          <h1 className="md:text-2xl md:font-medium text-gray-500 text-center">No Recent Calls</h1>
        </div> 
    }      

    </div>
)}

export default Call_history_pg

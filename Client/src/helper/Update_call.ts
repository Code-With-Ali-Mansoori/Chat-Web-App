import axios from "axios";

type CallHistory = {
  _id: string;
  caller_id: string;
  callee_id: string;
  room_id: string;
  call_type: "audio-call" | "video-call";
  call_connect: boolean;
  call_duration: string;
  updatedAt: string;
};

export const handle_Call_Update = async (call_duration : string, call_connect : boolean, call_Id : string ) => {
    const res = await axios.patch('https://chatsy-y2s8.onrender.com/update/call-history/data', 
        {call_duration, call_connect, call_Id}, 
        {withCredentials : true });

    return res ;
};

export const handle_CallLogs_display = async () => {
    try {
    
    const res = await axios.get('https://chatsy-y2s8.onrender.com/get/call-history/data', {withCredentials : true });

    if (res.status === 200 && res.statusText === 'OK') {

        return res.data.message.map((d : CallHistory) => ({
            _id : d._id!,
            caller_id : d.caller_id!,
            callee_id : d.callee_id!,
            room_id : d.room_id!,
            call_type : d.call_type!,
            call_connect : d.call_connect!,
            call_duration : d.call_duration!,
            updatedAt : d.updatedAt!
        }));

    };
        
    } catch (error) {
        console.log(error);
    }
};

export const handle_Called_UserData = async (user_Id : string ) => {
    const res = await axios.get(`https://chatsy-y2s8.onrender.com/call-history/indiv/${user_Id}`, 
    {withCredentials : true });

    return res.data.message ;
};
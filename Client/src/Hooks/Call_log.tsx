import axios from "axios";
import { useMutation } from "@tanstack/react-query"; 

interface calls_type {
    caller_id : string; 
    callee_id : string;
    room_id : string;
    call_type : string;
};

const useCall_log = () => {

    const handle_callLogs = async ({caller_id, callee_id, room_id, call_type} : calls_type) => {
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/create/call-history/data`, 
        { caller_id, callee_id, room_id, call_type },
        { withCredentials : true });

        // console.log(res);
        return res  
    };

    const CreateCall_Mutate = useMutation({
        mutationFn : handle_callLogs,
        onError : (error) => {console.log(error)},
        onSuccess : (res) => (res)
    });

    return CreateCall_Mutate;
};

export default useCall_log;

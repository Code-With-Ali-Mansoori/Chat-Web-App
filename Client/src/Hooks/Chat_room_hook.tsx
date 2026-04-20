 import axios from "axios";
import { useMutation } from "@tanstack/react-query"; 
import useSearch from "./SearchContext.hook";
import { useNavigate } from "react-router-dom";

const UseRoom_hook = () => {

    const {setLoad, load} = useSearch();
    const navigator = useNavigate();

    const handle_RoomCreate = async (user_Id : string) => {
        const res = await axios.post('https://chatsy-y2s8.onrender.com/create/chat-room', 
        { userId : user_Id},{withCredentials : true});
        
        navigator(`/chat-room?roomId=${res.data.data._id}&otherUser-public_Id=${user_Id}`);
    };

    const CreateRoom_Mutate = useMutation({
        mutationFn : async (id : string) => await handle_RoomCreate(id),
        onError : (error) => {setLoad(!load); console.log(error)},
    });

    return CreateRoom_Mutate;
};

export default UseRoom_hook;
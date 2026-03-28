import { useQuery } from "@tanstack/react-query";
import axios from "axios"

const useMyChat_Rooms = () => {
    return useQuery({
        queryKey : ['All_Chat_Rooms'],
        queryFn : async () => {
            const res = await axios.get('http://localhost:5000/my/chat-rooms', {withCredentials : true});

            return res;
        }
    })
}

export default useMyChat_Rooms;
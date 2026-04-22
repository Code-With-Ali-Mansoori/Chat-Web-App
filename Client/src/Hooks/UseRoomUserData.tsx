import { useQuery } from "@tanstack/react-query";
import RoomUserData from "../helper/RoomUserData";

const UseRoomUserData = (roomId : string) => {
    return useQuery({
        queryKey : ['other_user_data', roomId],
        queryFn : () => RoomUserData(roomId)
    });
};

export default UseRoomUserData;

import axios from 'axios';

const RoomUserData = async (roomId : string) => {
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/chat-room/roomId=${roomId}`, {withCredentials : true});
    
    return res; 
};

export default RoomUserData;
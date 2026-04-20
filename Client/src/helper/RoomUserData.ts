import axios from 'axios';

const RoomUserData = async (roomId : string) => {
    const res = await axios.get(`https://chatsy-y2s8.onrender.com/chat-room/roomId=${roomId}`, {withCredentials : true});
    
    return res; 
};

export default RoomUserData;
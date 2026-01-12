import {io} from '../index';
import { disconnect_socket, handle_Send_Msg, handleSeen, sockets_connect } from '../services/socket.handlers';
import { socket_middleware } from '../utils/sockets.middleware';

io.use(socket_middleware);  //Socket Middlware

io.on("connection", (socket) => {

    //1. Connect Socket
    sockets_connect(socket);

    //2.Join Room
    socket.on('join-room', async (room_id) => {
        await handleSeen(socket, room_id);

        const User_email = socket.data.user.user_email
        io.to(room_id).emit('msg_seen', User_email); //io => socket
    });
    
    //3.Leave Room 
    socket.on('leave-room' , (room_id) => {
        socket.leave(room_id);        
    });

    //4. Start Typing
    socket.on('typing', (room_id) => {        
        io.to(room_id).emit('users-typing'); //io => socket
    });

    //5. Stop Typing
    socket.on('stop-typing', (room_id) => {
        io.in(room_id).emit('stop-typinggggg');
    });

    //6. Messages
    socket.on('send-message', async ({msg, msg_type, sender_id, room_id}) => {
        await handle_Send_Msg(msg, msg_type,  sender_id, room_id);

        //7. Recive Msg
        // const msgs = await handle_reciver_msg( room_id );
        io.to(room_id).emit('receive-msg', msg, msg_type, sender_id );  //io => socket
        
    });

    //7. 
    socket.on('media-send', (roomId, sender_id, file) => {

        io.to(roomId).emit('receive-media', sender_id, file);
        // console.log(roomId, sender_id, file);
        
    });
         
    //8. Disconnect Socket
    socket.on("disconnect", () => disconnect_socket(socket));

});

export default io;
import {io} from '../index';
import { disconnect_socket, handle_reciver_msg, handle_Send_Msg, handleSeen, sockets_connect } from '../services/socket.handlers';
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

    //5. Start Typing
    socket.on('typing', (room_id) => {        
        io.to(room_id).emit('users-typing'); //io => socket
    });

    //6. Stop Typing
    socket.on('stop-typing', (room_id) => {
        io.in(room_id).emit('stop-typinggggg');
    });

    //7. Messages
    socket.on('send-message', async ({msg, msg_type, sender_id, room_id}) => {
        await handle_Send_Msg(msg, msg_type,  sender_id, room_id);

        //8. Recive Msg
        const msgs = await handle_reciver_msg( room_id );
        io.to(room_id).emit('receive-msg', msgs);  //io => socket
        
    })
         
    //9. Disconnect Socket
    socket.on("disconnect", () => disconnect_socket(socket));

});

export default io;
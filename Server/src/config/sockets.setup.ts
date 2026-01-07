import {io} from '../index';
import { disconnect_socket, sockets_connect } from '../services/socket.handlers';

io.on("connection", async (socket) => {

    //1. Connection Establish
    await sockets_connect(socket);

    //2. Connection Disables - Disconnect
    socket.on("disconnect", () => disconnect_socket(socket));

});

export default io;
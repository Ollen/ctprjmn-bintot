const socketio = require('socket.io');

module.exports.listen = server => {
    var io = socketio.listen(server, {
        path: '/SmartTrash'
    });

    io.on('connection', socket => {
        console.log('socketio: ', 'a user connected');
        socket.on('disconnect', () => {
            console.log('socketio: ', 'a user disconnected');
        })
    });

    return io;
};
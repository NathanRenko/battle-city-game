import { Server } from 'socket.io';

const io = new Server(3001, {
    cors: {
        origin: 'http://localhost:3000',
    },
});

io.use((socket, next) => {
    // console.log(socket.handshake.auth);
    const username = socket.handshake.auth.username;
    // if (!username) {
    //     return next(new Error("invalid username"));
    // }
    // @ts-ignore
    socket.username = username;
    next();
});

io.on('connection', (socket) => {
    const users = [];
    let numberId = [];
    // @ts-ignore
    for (let [id, socket] of io.of('/').sockets) {
        numberId.push(id);
        users.push({
            userID: id,
            // @ts-ignore
            username: socket.username,
        });
    }

    // console.log(Array.from(io.sockets.sockets).map((item) => item[0]));
    socket.emit(
        'connection',
        Array.from(io.sockets.sockets)
            .map((item) => item[0])
            .indexOf(socket.id) % 2
    );
    console.log(
        'Номер: ' +
            (Array.from(io.sockets.sockets)
                .map((item) => item[0])
                .indexOf(socket.id) %
                2)
    );

    // if (Array.from(io.sockets.sockets).length === 2) {
    //     io.sockets.emit('start');
    // }

    const socketsAmount = Array.from(io.sockets.sockets).length;
    // socket.join('room');
    // io.sockets.in('room').emit('start');
    // console.log(socketsAmount);
    if (socketsAmount % 2 === 0) {
        const roomName = 'room_' + socketsAmount / 2;
        Array.from(io.sockets.sockets)[socketsAmount - 1][1].join(roomName);
        Array.from(io.sockets.sockets)[socketsAmount - 2][1].join(roomName);
        io.to(roomName).emit('start');
        console.log(socket.rooms);
        // io.sockets.in(roomName).emit('start');
        // io.sockets.to(roomName).broadcast.emit('start');
        // io.sockets.emit('start');
        // console.log(123);

        // console.log(Array.from(io.sockets.sockets).map((item) => item[0]));

        // console.log(io.sockets.adapter.rooms);
    }
});

io.on('connection', (socket) => {
    // notify existing users
    socket.broadcast.emit('user connected', {
        userID: socket.id,
        // @ts-ignore
        username: socket.username,
    });
    // console.log(io.allSockets());
    socket.emit('connected');

    socket.on('move', (...args) => {
        // console.log(args);
        socket.broadcast.to(Array.from(socket.rooms)[1]).emit('move', args);
        // io.sockets.connected[io.allSockets()[1]]
    });
    socket.on('shoot', (...args) => {
        // console.log(args);

        socket.broadcast.to(Array.from(socket.rooms)[1]).emit('shoot', args);
        // io.sockets.connected[io.allSockets()[1]]
    });
});

// socket.on("private message", ({ content, to }) => {
//     socket.to(to).emit("private message", {
//         content,
//         from: socket.id,
//     });
// });

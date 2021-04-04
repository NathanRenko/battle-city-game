import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

const io = new Server(3001, {
    cors: {
        origin: 'http://localhost:3000',
    },
});

const mapPool = ['first', 'second'];

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
        const roomName = uuidv4();
        Array.from(io.sockets.sockets)[socketsAmount - 1][1].join(roomName);
        Array.from(io.sockets.sockets)[socketsAmount - 2][1].join(roomName);

        // console.log(Array.from(io.sockets.sockets).map((item) => item[0]));
        io.to(roomName).emit('start');
        console.log('rooms');
        console.log(io.sockets.adapter.rooms);
    }
});
let userVotes = new Map();
let readySockets = new Map();
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
    socket.on('vote', (...args) => {
        // console.log(args);
        console.log('vote', args);
        userVotes.set(socket.id, args[0]);
        socket.broadcast.to(Array.from(socket.rooms)[1]).emit('vote', args);
        // io.sockets.connected[io.allSockets()[1]]
    });

    socket.on('voteEnd', (...args) => {
        if (!readySockets.has(socket.rooms[0])) {
            readySockets.set(socket.rooms[0], { readyCount: 1 });
        } else {
            readySockets.set(socket.rooms[0], { readyCount: readySockets.get(socket.rooms[0]).readyCount + 1 });
        }
        // console.log('voteEnd');
        // console.log(readySockets.values());
        if (readySockets.get(socket.rooms[0]).readyCount === 2) {
            // console.log('inside');
            // console.log(userVotes.values());
            let results = Array.from(userVotes.values());
            switch (userVotes.size) {
                case 2:
                    console.log('voteEnd');
                    console.log(results);
                    if (results[0] !== results[1]) {
                        io.to(Array.from(socket.rooms)[1]).emit('voteEnd', [
                            geetRandomArrayElement(results),
                            'two not same',
                        ]);
                    } else {
                        io.to(Array.from(socket.rooms)[1]).emit('voteEnd', [results[0], 'two same']);
                    }
                    break;
                case 1:
                    io.to(Array.from(socket.rooms)[1]).emit('voteEnd', [results[0], 'one']);
                    break;
                case 0:
                    io.to(Array.from(socket.rooms)[1]).emit('voteEnd', [geetRandomArrayElement(mapPool), 'zero']);
                    break;
                default:
                    break;
            }

            // socket.broadcast.to(Array.from(socket.rooms)[1]).emit('voteEnd', args);
            // io.sockets.connected[io.allSockets()[1]]
            readySockets = new Map();
            userVotes = new Map();
        }
    });
    socket.on('disconnecting', () => {
        for (let room of socket.rooms) {
            console.log('left from ' + room);
            socket.to(room).emit('opponent disconnected');
        }
    });

    socket.on('disconnect', () => {
        console.log(io.sockets.adapter.rooms);
        //socket.rooms.size === 0;

        //socket.to('some room').emit('some event');
    });
});

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function geetRandomArrayElement(arr) {
    let key = getRandomInt(0, arr.length - 1);
    return arr[key];
}

// socket.on("private message", ({ content, to }) => {
//     socket.to(to).emit("private message", {
//         content,
//         from: socket.id,
//     });
// });

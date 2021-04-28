import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

const io = new Server(3001, {
    cors: {
        origin: '*',
    },
});

const mapPool = ['first', 'second'];

const roomData: Map<string, { userVotes: Map<string, string>; readySockets: number }> = new Map();

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

    socket.emit(
        'connection',
        Array.from(io.sockets.sockets)
            .map((item) => item[0])
            .indexOf(socket.id) % 2
    );

    const socketsAmount = Array.from(io.sockets.sockets).length;
    if (socketsAmount % 2 === 0) {
        const roomName = uuidv4();

        const player1 = Array.from(io.sockets.sockets)[socketsAmount - 1][1];
        const player2 = Array.from(io.sockets.sockets)[socketsAmount - 2][1];
        player1.join(roomName);
        player2.join(roomName);

        const username1 = users.find((user) => user.userID === player1.id).username;
        const username2 = users.find((user) => user.userID === player2.id).username;
        console.log([username1, username2]);
        roomData.set(roomName, { userVotes: new Map(), readySockets: 0 });
        io.to(roomName).emit('start', { usernames: [username1, username2] });
    }
});

io.on('connection', (socket) => {
    // notify existing users
    socket.broadcast.emit('user connected', {
        userID: socket.id,
        // @ts-ignore
        username: socket.username,
    });

    socket.emit('connected');

    socket.on('move', (...args) => {
        socket.broadcast.to(Array.from(socket.rooms)[1]).emit('move', args);
    });

    socket.on('shoot', (...args) => {
        socket.broadcast.to(Array.from(socket.rooms)[1]).emit('shoot', args);
    });

    socket.on('vote', (...args) => {
        roomData.get(Array.from(socket.rooms)[1]).userVotes.set(socket.id, args[0]);
        socket.broadcast.to(Array.from(socket.rooms)[1]).emit('vote', args);
    });

    socket.on('voteEnd', (...args) => {
        roomData.get(Array.from(socket.rooms)[1]).readySockets++;
        if (roomData.get(Array.from(socket.rooms)[1]).readySockets === 2) {
            let results = Array.from(roomData.get(Array.from(socket.rooms)[1]).userVotes.values());
            switch (results.length) {
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
            roomData.get(Array.from(socket.rooms)[1]).readySockets = 0;
            roomData.get(Array.from(socket.rooms)[1]).userVotes.clear();
        }
    });

    socket.on('disconnecting', () => {
        for (let room of socket.rooms) {
            socket.to(room).emit('opponent disconnected');
        }
    });
});

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function geetRandomArrayElement(arr) {
    let key = getRandomInt(0, arr.length - 1);
    return arr[key];
}

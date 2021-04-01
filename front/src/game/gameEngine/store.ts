import io from 'socket.io-client';

// @ts-ignore
const Store: { socket: SocketIOClient.Socket, socketID:number, isSinglePlayer:boolean } = { socket: undefined, socketID: undefined, isSinglePlayer: undefined };
export default Store;

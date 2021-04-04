import io from 'socket.io-client';

// @ts-ignore
const Store: { socket: SocketIOClient.Socket, socketID:number, isSinglePlayer:boolean,  choosenMap: string } = { socket: undefined, socketID: undefined, isSinglePlayer: undefined, choosenMap: undefined };
export default Store;

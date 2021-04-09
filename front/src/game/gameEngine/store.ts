import io from 'socket.io-client';

// @ts-ignore
const Store: { socket: SocketIOClient.Socket, playerNumber:number, isSinglePlayer:boolean,  choosenMap: string } = { socket: undefined, playerNumber: undefined, isSinglePlayer: undefined, choosenMap: undefined };
export default Store;

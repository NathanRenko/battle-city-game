import io from 'socket.io-client';

// @ts-ignore
const Store: { socket: SocketIOClient.Socket, playerNumber:number, isSinglePlayer:boolean,  choosenMap: string, playerName:string, opponentName:string } = { socket: undefined, playerNumber: undefined, isSinglePlayer: undefined, choosenMap: undefined, playerName:undefined, opponentName:undefined };
export default Store;

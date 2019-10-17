/* eslint-disable import/prefer-default-export */
import Io from 'socket.io';

/** @type Array<Io.Socket> */
const websocketClients = [];

export const socketio = {
  instance: undefined,
};

export function installWebsocketsOnServer(server) {
  const io = Io(server);
  socketio.instance = io;

  io.on('connection', (socket) => {
    const ip = socket.handshake.address;
    console.log('Got websocket connection', ip);
    websocketClients.push(socket);
    console.log('Client count:', websocketClients.length);

    socket.on('disconnect', () => {
      console.log('Socket disconnected', ip);
      websocketClients.splice(websocketClients.indexOf(socket), 1);
      console.log('Client count:', websocketClients.length);
    });
  });
}

export function sendNewCoffeeBrewingEvent() {
  websocketClients.forEach((client) => {
    client.emit('event_coffeeBrewed');
  });
}

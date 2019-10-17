import SerialPort from 'serialport';
import sendRfid from './rfidServer';

const port = new SerialPort('/dev/bus/usb/001/008', { baudRate: 256000 });

const ReadLine = SerialPort.parsers.Readline;
const parser = new ReadLine();

port.pipe(parser);
parser.on('data', async (rfid) => {
//   console.log(rfid);
  await sendRfid(rfid);
});
port.write('Help pls');

import SerialPort from 'serialport';

const Readline = require('@serialport/parser-readline');

const port = new SerialPort('/dev/ttyUSB0', { baudRate: 256000 });

const parser = new Readline();
port.pipe(parser);

parser.on('data', line => console.log(`> ${line}`));
port.write('ROBOT POWER ON\n');

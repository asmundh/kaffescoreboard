import winston, { format } from 'winston';

const {
  combine, timestamp, label,
} = format;

const logger = winston.createLogger({
  format: combine(
    timestamp(),
    label({ label: 'Direct message' }),
    format.json(),
  ),
  transports: [
    new winston.transports.File({ filename: 'messages.log' }),
  ],
});

export default logger;

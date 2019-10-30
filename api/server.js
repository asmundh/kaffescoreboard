import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import logger from 'koa-logger';
import { installWebsocketsOnServer } from './websocket';
import Mongo from './mongo';
import userRouter from './routes/userRouter';
import rfidPathRouter from './routes/rfidPathRouter';

const app = new Koa();
Mongo(app);

app.use(logger());
app.use(bodyParser());
app.use(cors());
app.use(userRouter.routes());
app.use(rfidPathRouter.routes());


const server = app.listen(3000);
installWebsocketsOnServer(server);

console.log('Listening on port 3000');

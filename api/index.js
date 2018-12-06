import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from 'kcors';
import mongoose from 'mongoose';
// import router from './routes';
import Router from 'koa-router';
import logger from 'koa-logger';
import Joi from 'joi';

const app = new Koa();
const router = new Router();



const coffee = Joi.object().keys({
   rfid: Joi.number().required(),
   coffee: Joi.number().required(),
});

const user = Joi.object().keys({
   userFirstName: Joi.string().min(2).max(20).required(),
   userLastName: Joi.string().min(2).max(30).required(),
   study: Joi.string().valid('komtek', 'data').required(),
   rfid: Joi.strict().required(),
})

router
   .put('/users:rfid', (ctx, next) => {
      
   })




app.use(logger());
app.use(bodyParser, json());
app.use(cors());

app.use(router.routes(), router.allowedMethods());

app.listen(3000);
console.log('Listening on port 3000');

import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import Router from 'koa-router';
import logger from 'koa-logger';
import Joi from 'joi';
import Mongo from './mongo';


const app = new Koa();
const router = new Router();
Mongo(app);

const check = (query, checker) => !Joi.validate(query, checker).error;

const user = Joi.object().keys({
  userFirstName: Joi.string().min(2).max(20).required(),
  userLastName: Joi.string().min(2).max(30).required(),
  study: Joi.string().valid('komtek', 'data').required(),
  rfid: Joi.number().required(),
  coffeesTracted: Joi.number().required(),
});
// GET user by RFID and all users
router
  .get('/users/:rfid', async (ctx) => {
    ctx.params.rfid = parseInt(ctx.params.rfid, 10);
    ctx.body = await ctx.app.users.findOne({ rfid: ctx.params.rfid });
    if (ctx.body == null) {
      ctx.status = 404;
      ctx.body = { error: 'No such user' };
    }
  })
  .get('/users', async (ctx) => {
    console.log('By all');
    ctx.body = await ctx.app.users.find().toArray();
  });

router
  .post('/users/:rfid', async (ctx) => {
    // const { body } = ctx.request;
    const rfidToFind = await parseInt(ctx.params.rfid, 10);
    console.log(rfidToFind);
    await ctx.app.users.findOneAndUpdate({
      rfid: rfidToFind,
    },
    { $inc: { kaffeScore: 1 } });
    ctx.body = await ctx.app.users.findOne({ rfid: rfidToFind });
  });

router
  .post('/users', async (ctx) => {
    const { body } = await ctx.request;
    const valid = check(body, user)
         && !(await ctx.app.users.findOne({
           rfid: body.rfid,
         }));
    if (valid) {
      await ctx.app.users.insertOne({
        userFirstName: body.userFirstName,
        userLastName: body.userLastName,
        study: body.study,
        rfid: body.rfid,
        kaffeScore: 0,
      });
      ctx.body = { created: true, body };
      ctx.status = 201;
    } else {
      ctx.status = 400;
      ctx.body = { created: false };
    }
  });

app.use(logger());
app.use(bodyParser());
app.use(cors());

app.use(router.routes(), router.allowedMethods());

app.listen(3000);
console.log('Listening on port 3000');

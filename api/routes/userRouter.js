/* eslint-disable no-underscore-dangle */

import Router from 'koa-router';
import { userCheck, user } from '../models/user';
import { getUserByRfid, getAllUsers, incrementCoffeeScoreByRfid } from '../controllers/userController';

const router = new Router();


// GET user by RFID and all users
router
  .get('/users/:rfid', async (ctx) => {
    await getUserByRfid(ctx);
  })
  .get('/users', async (ctx) => {
    await getAllUsers(ctx);
  });

// Increment a users score. Increments "kaffeScore" by 1.
router
  .post('/users/:rfid', async (ctx) => {
    await incrementCoffeeScoreByRfid(ctx);
  });

// Create new user
router
  .post('/users', async (ctx) => {
    const { body } = await ctx.request;
    console.log(body);
    // Validate user data
    const isValid = userCheck(body, user) && !(await ctx.app.users.findOne({
      rfid: body.rfid,
    }));
    console.log(isValid);
    // Insert into database
    if (isValid) {
      await ctx.app.users.insertOne({
        name: body.name,
        study: body.study,
        rfid: body.rfid,
        kaffeScore: 0,
        year: body.year,
      });
      ctx.body = { created: true, body };
      ctx.status = 201;
    } else {
      ctx.status = 400;
      ctx.body = { created: false };
    }
  });

const userRouter = router;
export default userRouter;

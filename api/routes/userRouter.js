/* eslint-disable no-underscore-dangle */

import Router from 'koa-router';
import { userCheck, user } from '../models/user';
import { getUserByRfid, createUser, getAllUsers, incrementCoffeeScoreByRfid } from '../controllers/userController';

const router = new Router();


router
  .get('/users/:rfid', async (ctx) => {
    await getUserByRfid(ctx);
  })
  .get('/users', async (ctx) => {
    await getAllUsers(ctx);
  });

router
  .post('/users/:rfid', async (ctx) => {
    await incrementCoffeeScoreByRfid(ctx);
  });

router
  .post('/users', async (ctx) => {
    await createUser(ctx)
  });

const userRouter = router;
export default userRouter;

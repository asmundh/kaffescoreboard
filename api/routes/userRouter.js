/* eslint-disable no-underscore-dangle */

import Router from 'koa-router';
import { userCheck, user } from '../models/user';
import { rfidPathCheck, rfidPath } from '../models/rfidPath';
import { sendNewCoffeeBrewingEvent, sendCardNotFound } from '../websocket';
import { timeSinceLastScanInSeconds } from '../utils';

const router = new Router();


// GET user by RFID and all users
router
  .get('/users/:rfid', async (ctx) => {
    ctx.body = await ctx.app.users.findOne({ rfid: ctx.params.rfid });
    if (!ctx.body) {
      ctx.status = 404;
      ctx.body = { error: 'No such user' };
    }
  })
  .get('/users', async (ctx) => {
    console.log('Getting and sending all brewers to frontend');
    ctx.body = await ctx.app.users.find().toArray();
  });

// Increment a users score. Increments "kaffeScore" by 1.
router
  .post('/users/:rfid', async (ctx) => {
    const rfidToFind = ctx.params.rfid;
    const resp = await ctx.app.users.findOne({ rfid: rfidToFind });
    if (resp) { // If user exists, go on to increment score by 1
      const lastScanTime = new Date(resp.lastScan);
      if (lastScanTime === null || (timeSinceLastScanInSeconds(lastScanTime) > 7 * 60)) {
        await ctx.app.users.findOneAndUpdate(
          { rfid: rfidToFind }, // Find by rfid
          { $inc: { kaffeScore: 1 }, $set: { lastScan: Date() } }, // Increment by field
        );
        console.log(`Increasing score of ${rfidToFind} `);
      } else {
        console.log(`Not enough time since last scan on card: ${rfidToFind}`);
      }
      sendNewCoffeeBrewingEvent();
      ctx.body = resp.value;
    } else { // If user does not exist, create an rfidPath to allow for registry
      console.log(`No user found for ${rfidToFind}`);
      const lastRegistrationAttempt = await ctx.app.rfidPaths.find({ rfid: rfidToFind }).toArray();
      if (lastRegistrationAttempt.length > 0) { // If scanned but not registered earlier
        console.log('Updating existing path');
        await ctx.app.rfidPaths.findOneAndUpdate({ rfid: rfidToFind }, {
          $set: {
            timeStamp: Date(),
          },
        });
      } else { // If never scanned that card
        const newRfidPath = {
          rfid: rfidToFind,
          timeStamp: Date(),
        };
        const valid = rfidPathCheck(newRfidPath, rfidPath);
        if (valid) {
          console.log('Creating path');
          await ctx.app.rfidPaths.insertOne(newRfidPath);
        }
      }
      console.log(rfidToFind);
      sendCardNotFound(rfidToFind);
    }
  });

// Create new user
router
  .post('/users', async (ctx) => {
    const { body } = await ctx.request;
    console.log(body);
    // Validate user data
    const valid = userCheck(body, user)
    && !(await ctx.app.users.findOne({
      rfid: body.rfid,
    }));
    console.log(valid);
    // Insert into database
    if (valid) {
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

import { rfidPathCheck, rfidPath } from '../models/rfidPath';
import { sendNewCoffeeBrewingEvent, sendCardNotFound } from '../websocket';
import { isScanAttemptValid } from '../utils';


const getUserByRfid = async (ctx) => {
  const { rfid } = ctx.params;
  ctx.body = await ctx.app.users.findOne({ rfid });
  if (!ctx.body) {
    ctx.response.status = 404;
    ctx.response.body = { error: 'No such user' };
  }

  return ctx;
};

const getAllUsers = async (ctx) => {
  console.log('Getting and sending all brewers to frontend');
  ctx.response.body = await ctx.app.users.find().toArray();
};

const createUser = async (ctx) => {
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
}


const incrementCoffeeScoreByRfid = async (ctx) => {
  const { rfid } = ctx.params;
  const user = await ctx.app.users.findOne({ rfid });
  console.log(user);
  if (user) { // If user exists, go on to increment score by 1
    const lastScanTime = new Date(user.lastScan);
    if (isScanAttemptValid(lastScanTime)) {
      await ctx.app.users.findOneAndUpdate(
        { rfid }, // Find by rfid
        { $inc: { kaffeScore: 1 }, $set: { lastScan: Date() } }, // Increment by field
      );
      console.log(`Increasing score of ${rfid} `);
    } else {
      console.log(`Not enough time since last scan on card: ${rfid}`);
    }
    sendNewCoffeeBrewingEvent();
    ctx.response.status = 200;
    ctx.response.body = user;
  } else { // If user does not exist, create an rfidPath to allow for registry
    console.log(`No user found for ${rfid}`);
    const lastRegistrationAttempt = await ctx.app.rfidPaths.find({ rfid }).toArray();
    if (lastRegistrationAttempt.length > 0) { // If scanned but not registered earlier
      console.log('Updating existing path');
      await ctx.app.rfidPaths.findOneAndUpdate({ rfid }, {
        $set: {
          timeStamp: Date(),
        },
      });
    } else { // If never scanned that card
      const newRfidPath = {
        rfid,
        timeStamp: Date(),
      };
      const valid = rfidPathCheck(newRfidPath, rfidPath);
      if (valid) {
        console.log('Creating path');
        await ctx.app.rfidPaths.insertOne(newRfidPath);
      }
    }
    console.log(rfid);
    sendCardNotFound(rfid);
  }
};

export { getUserByRfid, getAllUsers, incrementCoffeeScoreByRfid };

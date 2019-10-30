/* eslint-disable no-underscore-dangle */
import Router from 'koa-router';


const router = Router();

router.get('/rfidPath/:rfid', async (ctx) => {
  const resp = await ctx.app.rfidPaths.findOne({ rfid: ctx.params.rfid });
  if (!resp) {
    ctx.status = 404;
    ctx.body = { error: 'No card scanned for that rfid' };
  } else {
    const currentDate = new Date();
    const dbDate = new Date(resp.timeStamp);
    const secondsSinceLastScan = (currentDate.getTime() - dbDate.getTime()) / 1000;
    ctx.status = 200;
    ctx.body = { timeSinceScan: secondsSinceLastScan };
  }
});

router.get('/rfidPath', async (ctx) => {
  ctx.body = await ctx.app.rfidPaths.find().toArray();
  ctx.status = 200;
});


const rfidPathRouter = router;

export default rfidPathRouter;

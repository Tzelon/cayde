// Require the framework and instantiate it
import 'isomorphic-fetch';
import CaydeServer, { handle, hot } from '../../cayde-server';
import koaStatic from 'koa-static';
import path from 'path';
import { config as envConfig } from 'dotenv';

envConfig();
const cayde = new CaydeServer();


cayde.use(koaStatic(path.join(process.cwd(), 'dist')));
cayde.use(async ctx => {
  console.log('hello!!');
  await handle(ctx);

  return;
});

export default hot(module, cayde);


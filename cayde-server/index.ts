import Koa from 'koa';
import { createServer } from './global';
export { handle } from './server';
export { hot } from './hot';

export default class Cayde extends Koa {
  private _apolloServer = null;

  constructor(apolloServer: any) {
    super();
    //this._apolloServer = apolloServer;
  }

  start(port: number) {
    const app = createServer(this.callback(), port);
    // this._apolloServer.applyMiddleware({ app });
    return app;
  }
}

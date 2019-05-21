import Koa from 'koa';
import { createServer } from './global';
export { handle } from './server';
export { hot } from './hot';

export default class Cayde extends Koa {
  constructor() {
    super();
  }
  
  start(port: number) {
    return createServer(this.callback(), port);
  }
}
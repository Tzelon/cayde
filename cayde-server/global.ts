import http from 'http';
import https from 'https';

//We need to hold a global reference to our server.
//In HMR we are not destroying it we only replace the 'request' event handler

let server: http.Server | https.Server | undefined;

//TODO: support HTTPS server.
export function createServer(koaCallback: any, port: number) {
  return new Promise((resolve) => {
    server = http.createServer(koaCallback).listen(port, () => {
      return resolve();
    });
  });
}

export function getServer() {
  return server;
}

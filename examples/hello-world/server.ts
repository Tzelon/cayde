// Require the framework and instantiate it
import cayde, { handle } from '../../cayde-server';
import koaStatic from 'koa-static';
import 'isomorphic-fetch';
import path from 'path';
import { config as envConfig } from 'dotenv';

envConfig();

cayde(module, (server) => {
    server.use(koaStatic(path.join(process.cwd(), 'dist')));
    console.log('CAYDE FUNCTOIN');
    server.use(async (ctx) => {
        console.log('hello!!');
        await handle(ctx);

        return;
    });

    return server;
});

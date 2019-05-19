import bootstrap from './server';
import http from 'http';

declare const module: any;

const app = bootstrap();
let currentHandler = app.callback();

const port = parseInt(process.env.PORT || '3004', 10);

const server = http.createServer(currentHandler).listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
});

if (module.hot) {
    console.info('✅  Server-side HMR Enabled!');
    module.hot.accept('./server', (data: any) => {
        console.log('form accept: ', data);
        // replace request handler of server
        server.removeListener('request', currentHandler);
        const handler = bootstrap().callback();
        server.on('request', handler);
        currentHandler = handler;
    });
    //dispose will executed when the current module code is replaced.
    //remove any persistent resource you have claimed or created
    module.hot.dispose((data: any) => {
        console.log(`module.hot.dispose data: ${JSON.stringify(
            data
        )} can ransfer state to the updated module, 
      add it to given data parameter. This object will be available 
      at module.hot.data after the update.`);
    });
}

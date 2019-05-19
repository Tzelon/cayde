import http from 'http';
import Koa from 'koa';
export { handle } from './server';

type Bootstrap = (server: Koa) => Koa;
interface NodeModule {
    hot: any;
}

// references
let currentHandler: any;
let koaInstance: Koa;
let server: http.Server;
let _bootsrapWrapper_: any;
let firstTime = true;


export default function cayde(sourceModule: NodeModule, bootstrap: Bootstrap) {
    koaInstance = new Koa();
    // When HMR triggers `sourceModule` will be re-evaluated.
    //
    // That will trigger a call to this function, updating our
    // internal server handler with the new handler.
    _bootsrapWrapper_ = bootstrap;

    //Call this function only on first reload
    if (firstTime) {
        currentHandler = _bootsrapWrapper_(koaInstance).callback();
        const port = 3004; //koaInstance.port;
        server = http.createServer(currentHandler).listen(port, () => {
            console.log(`> Ready on http://localhost:${port}`);
        });
        firstTime = false;
    }

    // Use `sourceModule`'s HMR API to accept changes for it
    // and the modules it depends on.
    //
    // https://webpack.js.org/concepts/hot-module-replacement
    if (sourceModule.hot) {
        console.info('✅ Server-side HMR Enabled!');
        sourceModule.hot.accept();

       
        if (sourceModule.hot.addStatusHandler) {
            if (sourceModule.hot.status() === 'idle') {
                sourceModule.hot.addStatusHandler((status: string) => {
                    if (status === 'apply') {
                        // Updates the application state by invoking the new
                        // `_bootsrapWrapper_` and creating a new `handler`.
                        // setTimeout is use to wait for the files to update
                        setTimeout(() => {
                            // replace request handler of server
                            server.removeListener('request', currentHandler);
                            const newHandler = _bootsrapWrapper_(
                                koaInstance
                            ).callback();
                            server.on('request', newHandler);
                            currentHandler = newHandler;
                        });
                    }
                });
            }
        }

        // //dispose will executed when the current module code is replaced.
        // //remove any persistent resource you have claimed or created
        // sourceModule.hot.dispose((data: any) => {
        //     //     console.log(`module.hot.dispose data: ${JSON.stringify(
        //     //         data
        //     //     )} can ransfer state to the updated module,
        //     //   add it to given data parameter. This object will be available
        //     //   at module.hot.data after the update.`);

        //     data.dontReload = true;
        // });
    }
}

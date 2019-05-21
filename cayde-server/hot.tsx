import { getServer } from './global';
import Cayde from './index';
let caydeRef: Cayde;

//similar to https://github.com/gaearon/react-hot-loader/blob/master/src/hot.dev.js#L54
export function hot(sourceModule: NodeModule, cayde: Cayde): Cayde {
  // When HMR triggers `sourceModule` will be re-evaluated.
  //
  // That will trigger a call to this function, updating our
  // internal `caydeRef` with the new cayde instance.
  caydeRef = cayde;

  // Use `sourceModule`'s HMR API to accept changes for it
  // and the modules it depends on.
  //
  // https://webpack.js.org/concepts/hot-module-replacement
  if (sourceModule.hot) {
    console.info('✅ Server-side HMR Enabled!');
    sourceModule.hot.accept(error => {
      console.error('HMR Error: ', error);
    });

    if (sourceModule.hot.addStatusHandler) {
      if (sourceModule.hot.status() === 'idle') {
        sourceModule.hot.addStatusHandler(status => {
          if (status === 'apply') {
            // Updates the application state by creating a new `handler`.
            // setTimeout is use to wait for the files to update
            setTimeout(() => {
              const server = getServer();
              if (!server) {
                throw new Error(`You didn't call start on the server`);
              }

              // replace request handler of server
              server.removeAllListeners('request');
              const newHandler = caydeRef.callback();
              server.on('request', newHandler);
            });
          }
        });
      }
    }
  }

  return cayde;
}

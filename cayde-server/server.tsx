import { ParameterizedContext } from 'koa';
// import { GraphQLClient, ClientContext } from 'graphql-hooks';
// import { getInitialState } from 'graphql-hooks-ssr';
// import memCache from 'graphql-hooks-memcache';
// import { renderToString } from 'react-dom/server';
// import serialize from 'serialize-javascript';
// import React from 'react';
// import * as hookRouter from 'hookrouter';

// import App from '../shared/App';

export async function handle(ctx: ParameterizedContext) {
    //   const name = 'tzelons';

    //   const client = new GraphQLClient({
    //       headers: {
    //           'Content-Type': 'application/json'
    //       },
    //       url: 'fake',
    //       cache: memCache(), // NOTE: a cache is required for SSR
    //       fetch
    //   });

    //   const Content = () => (
    //       <ClientContext.Provider value={client}>
    //           Hello
    //       </ClientContext.Provider>
    //   );

    //   const initialState = await getInitialState({ App: Content, client });

    //   hookRouter.setPath('/');
    //   const markup = `
    //   <!DOCTYPE html>
    //   <html>
    //     <head>
    //       <title>SSR with RR</title>
    //       <script src="/main.bundle.js" defer></script>
    //       <script>window.__INITIAL_DATA__ = ${serialize(initialState)}</script>
    //     </head>
    //     <body>
    //       <div id="app">${renderToString(<Content />)}</div>
    //     </body>
    //   </html>
    // `;
    ctx.status = 200;
    ctx.set({
        'Content-Length': String(Buffer.byteLength('markup')),
        'Content-Type': 'text/html'
    });

    ctx.body = 'markup!!! ';
}

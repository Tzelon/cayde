import proxy from 'koa-better-http-proxy';
import { Context } from 'koa';
import url from 'url';
import { ApiVersion, GRAPHQL_PATH_PREFIX as REST_PATH_PREFIX } from '@shopify/koa-shopify-graphql-proxy';

interface DefaultProxyOptions {
    version: ApiVersion;
}

export default function shopifyRESTProxy(proxyOptions: DefaultProxyOptions) {
    return async function shopifyRESTProxyMiddleware(ctx: Context, next: () => Promise<any>) {
        const { session = {} } = ctx;

        const shop = session.shop;
        const accessToken = session.accessToken;
        const version = proxyOptions.version;

        if (accessToken == null || shop == null) {
            ctx.throw(403, 'Unauthorized');
            return;
        }

        if (!ctx.path.includes("products")) {
            await next();
            return;
          }

        await proxy(shop, {
            https: true,
            parseReqBody: false,
            // Setting request header here, not response. That's why we don't use ctx.set()
            // proxy middleware will grab this request header
            headers: {
              'Content-Type': 'application/json',
              'X-Shopify-Access-Token': accessToken,
            },
            proxyReqPathResolver(ctx) {
              return `${REST_PATH_PREFIX}/${version}/${ctx.url}`;
            },
          })(
            ctx,
      
            /*
              We want this middleware to terminate, not fall through to the next in the chain,
              but sadly it doesn't support not passing a `next` function. To get around this we
              just pass our own dummy `next` that resolves immediately.
            */
            noop,
          );

    }
}
async function noop() {}

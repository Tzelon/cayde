import caydeServer from './server';

caydeServer.start(3004).then(() => {
  console.log(`> Ready on http://localhost:${3004}`);
});

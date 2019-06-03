import { config as envConfig } from 'dotenv';
import caydeServer from './server';

envConfig();

caydeServer.start(3004).then(() => {
  console.log(`> Ready on http://localhost:${3004}`);
});

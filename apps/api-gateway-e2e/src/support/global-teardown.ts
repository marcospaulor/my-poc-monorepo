import { killPort } from '@nx/node/utils';
import { resolve } from 'path';
import { existsSync, unlinkSync } from 'fs';

module.exports = async function () {
  // Kill the server process
  const serverPid = (globalThis as { __SERVER_PID__?: number }).__SERVER_PID__;
  if (serverPid) {
    try {
      process.kill(serverPid, 'SIGTERM');
      console.log(`✓ Server process ${serverPid} terminated`);
    } catch {
      console.log('Server process already terminated');
    }
  }

  // Ensure port is closed
  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  await killPort(port);

  // Clean up test database
  const testDbPath = resolve(
    process.cwd(),
    'libs/infra/database/prisma/test.db'
  );
  if (existsSync(testDbPath)) {
    console.log('Cleaning up test database...');
    unlinkSync(testDbPath);
  }

  console.log(globalThis.__TEARDOWN_MESSAGE__);
};

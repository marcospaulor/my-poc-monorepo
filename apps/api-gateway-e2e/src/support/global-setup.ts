import { waitForPortOpen } from '@nx/node/utils';
import { spawn } from 'child_process';
import { execSync } from 'child_process';
import { resolve } from 'path';
import { existsSync, unlinkSync } from 'fs';

/* eslint-disable */
var __TEARDOWN_MESSAGE__: string;

module.exports = async function () {
  console.log('\nSetting up E2E tests...\n');

  // Define test database path
  const testDbPath = resolve(
    process.cwd(),
    'libs/infra/database/prisma/test.db'
  );
  const databaseUrl = `file:${testDbPath}`;

  // Set environment variable GLOBALLY for all processes
  process.env.DATABASE_URL = databaseUrl;
  process.env.NODE_ENV = 'test';

  // Remove existing test database if it exists
  if (existsSync(testDbPath)) {
    console.log('Removing existing test database...');
    unlinkSync(testDbPath);
  }

  // Also remove journal file if exists
  const journalPath = `${testDbPath}-journal`;
  if (existsSync(journalPath)) {
    unlinkSync(journalPath);
  }

  // Create test database and run migrations
  console.log('Creating test database and running migrations...');
  console.log('DATABASE_URL:', databaseUrl);

  try {
    execSync('cd libs/infra/database && npx prisma migrate deploy', {
      env: {
        ...process.env,
        DATABASE_URL: databaseUrl,
      },
      stdio: 'inherit',
    });
    console.log('✓ Test database ready!\n');
  } catch (error) {
    console.error('Failed to setup test database:', error);
    throw error;
  }

  // Verify test.db was created
  if (existsSync(testDbPath)) {
    console.log('✓ test.db file created successfully');
  } else {
    throw new Error('test.db was not created!');
  }

  // Start the server with test database
  console.log('Starting API Gateway server with test database...\n');

  const serverProcess = spawn('node', ['dist/apps/api-gateway/main.js'], {
    env: {
      ...process.env,
      DATABASE_URL: databaseUrl,
      NODE_ENV: 'test',
    },
    detached: true,
    stdio: 'ignore',
  });

  serverProcess.unref();
  (globalThis as { __SERVER_PID__?: number }).__SERVER_PID__ =
    serverProcess.pid;
  const host = process.env.HOST ?? 'localhost';
  const port = process.env.PORT ? Number(process.env.PORT) : 3000;

  console.log(`Waiting for server at ${host}:${port}...\n`);
  await waitForPortOpen(port, { host });

  console.log('✓ Server is ready!\n');

  globalThis.__TEARDOWN_MESSAGE__ = '\nTearing down...\n';
};

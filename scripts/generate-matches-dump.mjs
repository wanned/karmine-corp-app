import { spawn } from 'node:child_process';
import fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dumpCreatorPath = path.resolve(
  __dirname,
  '../src/lib/karmine-corp-api/adapters/dump-creator/dump-creator.ts'
);

fs.readdirSync(path.resolve(__dirname, '../assets')).forEach((file) => {
  if (file.startsWith('matches-dump')) {
    fs.unlinkSync(path.resolve(__dirname, '../assets', file));
  }
});

const child = spawn(
  `node`,
  ['--import', 'tsx', dumpCreatorPath, '--dump-path', '../assets/matches-dump'],
  {
    cwd: __dirname,
  }
);

child.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

child.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

child.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
  process.exit(code);
});

///<reference types="node"/>

const process = require('process');
import { dedupePathsMap } from './map';
import { dedupePathsRecord } from './record';

const ITER = process.argv[2] || 10_000;
const MAP = true;
const RECORD = true;
const paths: string[] = [];

const distDirectory = '/some/very/deep/path/on/the/filesystem/dist';
for (let i = 0; i < 100; i++) {
  paths.push(`${distDirectory}/lib-${i}`);
  paths.push(`${distDirectory}/lib-${i}/lib/${i}`);
  paths.push(`${distDirectory}/lib-${i}-${i}`);
}

function milliseconds([seconds, nseconds]: [number, number]) {
  return seconds * 1_000 + nseconds / 1_000_000;
}

function benchmark(fn: typeof dedupePathsMap) {
  let deduped = 0;
  const now = milliseconds(process.hrtime());
  for (let i = 0; i < ITER; i++) {
    deduped = fn(paths).length;
  }
  const time = milliseconds(process.hrtime()) - now;
  console.log([
    fn.name, `${paths.length}`, `${deduped}`, time, time / paths.length / ITER, time / deduped / ITER
  ].join(' :: '));
  return time;
}

const map = MAP && benchmark(dedupePathsMap);
const record = RECORD && benchmark(dedupePathsRecord);

if (MAP && RECORD) {
  console.log((((map - record) / record) * 100).toFixed(2) + '%');
}

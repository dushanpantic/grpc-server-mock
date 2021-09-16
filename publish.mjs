#!/usr/bin/env zx

const packageName = (await $`cat package.json | grep name`)
  .stdout
  .split(',')[0]
  .match(new RegExp('".*": "(.*)"'))[1];
const localVersion = (await $`cat package.json | grep version`)
  .stdout
  .match(new RegExp('".*": "(.*)"'))[1];


const isPublished = await($`npm view ${packageName} versions -json`)
  .then((response) => JSON.parse(response.stdout).includes(localVersion))
  .catch(() => false);


const branch = await $`git branch --show-current`.stdout;

if(branch === 'master') {
  await $`npm publish`
} else {
  await $`npm publish --dry-run`
}

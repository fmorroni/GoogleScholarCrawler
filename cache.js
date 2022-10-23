import fs from 'fs/promises';

let dir = './.cache/';

export async function createCacheDir() {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (err) {
    throw new Error('Couldn\'t create .cache directory.');
  }
}

export async function cacheJSON(fileName, obj) {
  try {
    let file = dir + fileName + '.json';
    obj = JSON.stringify(obj, null, 2);
    await fs.writeFile(file, obj);
  } catch (err) {
    throw new Error('Couldn\'t cache ' + fileName);
  }
}

export async function readCache(fileName) {
  try {
    let file = dir + fileName + '.json';
    await fs.access(file);
    let asdf = await fs.readFile(file, { encoding: 'utf-8' });
    console.log(JSON.parse(asdf))
  } catch (err) {
    console.error(err);
    throw new Error(`Couldn\'t access file "${fileName}".`);
  }
}

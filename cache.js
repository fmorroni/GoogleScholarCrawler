import fs from 'fs/promises';

let dir = './.cache/';

async function createCacheDir() {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (err) {
    throw new Error('Couldn\'t create .cache directory.');
  }
}

async function cacheJSON(fileName, obj) {
  try {
    let file = dir + fileName + '.json';
    obj = JSON.stringify(obj, null, 2);
    await fs.writeFile(file, obj);
  } catch (err) {
    throw new Error('Couldn\'t cache ' + fileName);
  }
}

async function readCache(fileName) {
  let file = dir + fileName + '.json';
  try {
    await fs.access(file);
    let obj = await fs.readFile(file, { encoding: 'utf-8' });
    try {
      obj = JSON.parse(obj);
    } catch (err) {
      console.log('In "' + file + '" format not json.');
      let newFile = dir + fileName + '.wrong_format';
      console.log('Contents moved to ' + newFile);
      await fs.writeFile(newFile, obj);
      await fs.writeFile(file, '');
      return null;
    }
    return obj;
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log('No cache for ', file);
      console.log('Creating ' + file + '...');
      await fs.writeFile(file, '');
      return null;
    } else {
      Promise.reject(err);
    }
  }
}

export default {
  createCacheDir: createCacheDir,
  cacheJSON: cacheJSON,
  readCache: readCache,
}

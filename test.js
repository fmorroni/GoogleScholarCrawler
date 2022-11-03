import getUserId from './getUserId.js';
import getUserIDsFromInstitution from './getUserIDsFromInstitution.js';
import { institutionURL, fail, userCacheDataFileName } from './globals.js';
import cache from './cache.js'
import getArticlesFromURLs from './getArticlesFromURLs.js';
import fs from 'fs/promises';
import articlesToCSV from './articlesToCSV.js'

(async function() {
 await articlesToCSV('2020.json', '2020.csv');
})()

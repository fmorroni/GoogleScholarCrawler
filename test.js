import getUserId from './getUserId.js';
import getUserIDsFromInstitution from './getUserIDsFromInstitution.js';
import { institutionURL, fail, userCacheDataFileName } from './globals.js';
import cache from './cache.js'
import getArticlesFromURLs from './getArticlesFromURLs.js';

(async function() {
  console.log(await getUserId('carlos gustavo lopez pombo'));
})()

// readCache('test3')

/*
let username = 'carlos gustavo lopez pombo';
getUserId(username)
  .then(res => {
    console.log(res);
  })
  .catch(err => console.error(err));
*/

// getUserIDsFromInstitution(institutionURL)
//   .then(IDs => {
//     console.log(IDs);
//   });

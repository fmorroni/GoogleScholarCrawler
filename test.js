import getUserId from './getUserId.js';
import getUserIDsFromInstitution from './getUserIDsFromInstitution.js';
import { institutionURL, fail, userCacheDataFileName } from './globals.js';
import cache from './cache.js'
import getArticlesFromURLs from './getArticlesFromURLs.js';

(async function() {
  let userCacheData = await cache.readCache(userCacheDataFileName);
  // console.log(userCacheData);
  // console.log('user ids: ' + userCacheData.userIDs);
  for (let i = 0; i < userCacheData.userProfiles.length; ++i) {
    console.log('User id: ', userCacheData.userProfiles[i].id === userCacheData.userIDs[i]);
  }
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

import getArticleURLs from './getArticleURLs.js';
import getArticlesFromURLs from "./getArticlesFromURLs.js";
import getUserIDsFromInstitution from "./getUserIDsFromInstitution.js"
import UserParser from "./userParser.js";
import { institutionURL, userCacheDataFileName, parsedArticlesDir } from './globals.js';
import fs from 'fs/promises';
import cache from './cache.js'

/* Researcher names for testing
  Marcelo F. Frías (137 articles)
  Silvyo Ergatis (2 articles)
  carlos gustavo lopez pombo (54 articles)
  Juan Pablo Galeotti (77 articles)
*/

async function main(years = []) {
  let articlesCacheData;
  let fileName = years.length === 0 ? 'allArticles' : years.join('-');
  let articleURLs = [];
  let data = { userProfiles: [], parsedArticles: [] };
  try {
    cache.createCacheDir();

    let userCacheData = await cache.readCache(userCacheDataFileName);
    let userIDs;
    if (!userCacheData) {
      let userParser = new UserParser();
      userIDs = await getUserIDsFromInstitution(institutionURL);
      for (let userId of userIDs) {
        console.log('Parsing new user', userId);
        await userParser.parseUserProfile(userId);
        let user = userParser.getProfile();
        console.log(user.name);
        data.userProfiles.push(user);
      }
      cache.cacheJSON(userCacheDataFileName, { userIDs: userIDs, userProfiles: data.userProfiles })
        .catch(err => console.log(err));
    } else {
      console.log('Using cached user data.');
      userIDs = userCacheData.userIDs;
      data.userProfiles = userCacheData.userProfiles;
    }

    articlesCacheData = await cache.readCache(fileName);
    if (!articlesCacheData) {
      console.log('Searching for articles from years: ', years);
      let articleIDsNoRepeat = [];

      for (let i = 0; i < userIDs.length; ++i) {
        console.log(`Getting ${data.userProfiles[i].name}'s article links, ${userIDs.length - i} users remaining...`);
        let { articleURLs: currentUserArticleURLs, articleHashes } = await getArticleURLs(userIDs[i], years);
        console.log('Found ' + currentUserArticleURLs.length + ' articles from user.');
        currentUserArticleURLs = currentUserArticleURLs.filter((url, index) => {
          if (articleIDsNoRepeat.includes(articleHashes[index])) {
            return false;
          } else {
            articleIDsNoRepeat.push(articleHashes[index]);
            return true;
          }
        });
        // console.log('Non repeated articles', articleURLs)
        articleURLs.push(...currentUserArticleURLs);
      }
    } else {
      articleURLs = articlesCacheData.articleURLs;
      data.parsedArticles = articlesCacheData.parsedArticles;
    }
  } catch (err) {
    throw new Error(err);
  } // If an error occurs up to this point I'm not gonna bother caching anything, just rerun the program.

  try {
    console.log('Preparing to parse ' + articleURLs.length + ' articles...');
    data.parsedArticles = data.parsedArticles.concat(await getArticlesFromURLs(articleURLs));
  } catch (dataUpToError) {
    console.log('Error caught. Caching results up to the error...');
    // This values will get cached in the next try-catch block.
    data.parsedArticles = data.parsedArticles.concat(dataUpToError.parsedArticles);
    articleURLs = dataUpToError.unparsedURLs;
  }

  try {
    await cache.cacheJSON(fileName, { parsedArticles: data.parsedArticles, articleURLs: articleURLs });
    await fs.mkdir(parsedArticlesDir, { recursive: true });
    await fs.writeFile(parsedArticlesDir + '/' + fileName + '.json', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(err);
    console.log(JSON.stringify(data, null, 2));
  }
}

let args = process.argv.slice(2);
let years = [];
for (let arg of args) {
  arg = parseInt(arg);
  if (1800 <= arg && arg <= 2200) {
    if (!years.includes(arg)) years.push(arg);
  } else {
    throw new Error("Enter valid year values.")
  }
}

main(years);

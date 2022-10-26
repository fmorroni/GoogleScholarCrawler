import getArticleURLs from './getArticleURLs.js';
import getArticlesFromURLs from "./getArticlesFromURLs.js";
import getUserIDsFromInstitution from "./getUserIDsFromInstitution.js"
import UserParser from "./userParser.js";
import { institutionURL, userCacheDataFileName } from './globals.js';
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
  let data = { userProfiles: [], articleURLs: [], parsedArticles: [] };
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
        console.log(`Getting ${data.userProfiles[i].name}'s article links, ${userIDs.length - i} remaining...`);
        let { urls: articleURLs, ids: articleIDs } = await getArticleURLs(userId, years);
        // console.log('All articles', articleURLs, articleIDs);
        articleURLs = articleURLs.filter((url, index) => {
          if (articleIDsNoRepeat.includes(articleIDs[index])) {
            return false;
          } else {
            articleIDsNoRepeat.push(articleIDs[index]);
            return true;
          }
        });
        // console.log('Non repeated articles', articleURLs)
        data.articleURLs.push(...articleURLs);
      }
    } else {
      data.articleURLs = articlesCacheData.articleURLs;
      data.parsedArticles = articlesCacheData.parsedArticles;
    }
  } catch (err) {
    throw new Error(err);
  } // If an error occurs up to this point I'm not gonna bother caching anything, just rerun the program.

  try {
    console.log('Preparing to parse ' + data.articleURLs.length + ' articles...');
    data.parsedArticles.concat(await getArticlesFromURLs(data.articleURLs));
    console.log('Articles: ', parsedArticles);
    fs.writeFile('./articles/' + fileName, JSON.stringify(data, null, 2))
      .catch(err => console.error(err));
  } catch (dataUpToError) {
    console.log('Error caught. Caching results up to the error...');
    data.parsedArticles = data.parsedArticles.concat(dataUpToError.parsedArticles);
    data.articleURLs = dataUpToError.unparsedURLs;
    await cache.cacheJSON(fileName, data);
  }
}

main([2020]);

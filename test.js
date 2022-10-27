import getUserId from './getUserId.js';
import getUserIDsFromInstitution from './getUserIDsFromInstitution.js';
import { institutionURL, fail, userCacheDataFileName } from './globals.js';
import cache from './cache.js'
import getArticlesFromURLs from './getArticlesFromURLs.js';
import fs from 'fs/promises';

(async function() {
  try {
    let fileName = 'test', parsedArticleDir = './testDir';
    let data = { articleURLs: [], parsedArticles: [] };
    data.articleURLs = [
      "https://scholar.google.com//citations?view_op=view_citation&hl=en&oe=ASCII&user=q19rcJoAAAAJ&pagesize=100&citation_for_view=q19rcJoAAAAJ:roLk4NBRz8UC",
      "https://scholar.google.com//citations?view_op=view_citation&hl=en&oe=ASCII&user=TWJ9eoQAAAAJ&pagesize=100&citation_for_view=TWJ9eoQAAAAJ:2osOgNQ5qMEC",
    ];
    console.log('Preparing to parse ' + data.articleURLs.length + ' articles...');
    data.parsedArticles = data.parsedArticles.concat(await getArticlesFromURLs(data.articleURLs));
    console.log(data);

    cache.cacheJSON(fileName, { parsedArticles: data.parsedArticles, articleURLs: data.articleURLs })
      .then(() => fs.mkdir(parsedArticleDir, { recursive: true }))
      .then(() => fs.writeFile(parsedArticleDir + '/' + fileName, JSON.stringify(data, null, 2)))
      .catch(err => {
        console.error(err);
        console.log(JSON.stringify(data, null, 2));
      });

  } catch (dataUpToError) {
    console.log('Error caught. Caching results up to the error...');
    data.parsedArticles = data.parsedArticles.concat(dataUpToError.parsedArticles);
    data.articleURLs = dataUpToError.unparsedURLs;
    await cache.cacheJSON(fileName, { parsedArticles: data.parsedArticles, articleURLs: data.articleURLs });
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

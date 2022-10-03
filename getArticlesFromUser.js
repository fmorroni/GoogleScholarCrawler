import { ArticleParser } from './articleParser.js';
import getArticleURLs from './getArticlesURL.js';
import { randDelay } from './delay.js';
import createLog from './createLog.js';

async function getArticlesFromUser(username) {
  try {
    let articleURLs = await getArticleURLs(username);
    const batchSize = 2;
    let articles = [];
    while (articleURLs.length) {
      let articleBatch = await parseArticleBatch(articleURLs.splice(0, batchSize));
      articles = articles.concat(articleBatch);
      console.log('Number of articles parsed: ', articles.length);
    }

    createLog('./logs', articles, 'json');

    return Promise.resolve(articles);
  } catch (error) {
    return Promise.reject(error);
  }
}

async function parseArticleBatch(articleURLs) {
  let promises = [];
  for (let link of articleURLs) {
    let articleParser = new ArticleParser();
    promises.push(articleParser.generateArticle(link));
  }

  // The timeout here will make sure every batch takes at least $delay ms to complete.
  // This is done to (hopefully) avoid triggering google scholar's bot detection.
  let promisedArticles = await Promise.allSettled([...promises, randDelay(20, 60)]);
  let delay = Math.floor(promisedArticles.pop().value);
  console.log("Batch delay: ", delay);
  let articles = [];
  promisedArticles.forEach(article => {
    (article.status === 'fulfilled') ? articles.push(article.value) : articles.push(article.reason);
  });

  return articles;
}

/* Researcher names for testing
  Marcelo F. Frías (137 articles)
  Silvyo Ergatis (2 articles)
  carlos gustavo lopez pombo (54 articles)
  Juan Pablo Galeotti (77 articles)
*/
let articles;
getArticlesFromUser('carlos gustavo lopez pombo')
  .then(promisedArticles => {
    articles = promisedArticles;
    console.log('Articles: ', articles);
  })
  .catch(error => console.error(error));


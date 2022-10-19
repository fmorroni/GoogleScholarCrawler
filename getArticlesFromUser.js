import { ArticleParser } from './articleParser.js';
import { randDelay } from './delay.js';
import { bigDelay } from './globals.js';

export default async function getArticlesFromUser(articleURLs) {
  try {
    const batchSize = 1;
    let articles = [];
    while (articleURLs.length) {
      let articleBatch = await parseArticleBatch(articleURLs.splice(0, batchSize));
      articles = articles.concat(articleBatch);
      console.log('Number of articles parsed: ', articles.length);
    }

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
  let promisedArticles = await Promise.allSettled([...promises, randDelay(...bigDelay)]);
  let delay = Math.floor(promisedArticles.pop().value)/1000;
  console.log("Batch delay: ", delay);
  let articles = [];
  promisedArticles.forEach(article => {
    (article.status === 'fulfilled') ? articles.push(article.value) : articles.push(article.reason);
  });

  return articles;
}

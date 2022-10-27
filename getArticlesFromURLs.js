import { ArticleParser } from './articleParser.js';
import { randDelay } from './delay.js';
import { bigDelay } from './globals.js';

export default async function getArticlesFromURLs(articleURLs = []) {
  let parsedArticles = [];
  let urlBatch = [];
  try {
    articleURLs = [...articleURLs];
    const batchSize = 1;
    const initialLen = articleURLs.length;
    while (articleURLs.length) {
      urlBatch = articleURLs.splice(0, batchSize);
      let articleBatch = await parseArticleBatch(urlBatch);
      parsedArticles = parsedArticles.concat(articleBatch);
      console.log('Number of articles parsed: ', parsedArticles.length + '/' + initialLen);
    }

    return Promise.resolve(parsedArticles);
  } catch (err) {
    console.error(err);
    let dataUpToError = {parsedArticles: parsedArticles, unparsedURLs: urlBatch.concat(articleURLs)};
    return Promise.reject(dataUpToError);
  }
}

async function parseArticleBatch(articleURLs) {
  try {
    let promises = [];
    for (let url of articleURLs) {
      let articleParser = new ArticleParser();
      promises.push(articleParser.generateArticle(url));
    }

    // The timeout here will make sure every batch takes at least $delay ms to complete.
    // This is done to (hopefully) avoid triggering google scholar's bot detection.
    let promisedArticles = await Promise.all([...promises, randDelay(...bigDelay)]);
    let delay = Math.floor(promisedArticles.pop()) / 1000;
    console.log("Batch delay: ", delay);
    // let articles = [];
    // promisedArticles.forEach(article => {
    //   (article.status === 'fulfilled') ? articles.push(article.value) : articles.push(article.reason);
    // });
    // return articles;

    return promisedArticles;
  } catch (err) {
    return Promise.reject(err);
  }
}

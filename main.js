import getUserId from './getUserId.js';
import getArticleURLs from './getArticleURLs.js';
import getArticlesFromUser from "./getArticlesFromUser.js";
import createLog from './createLog.js';

/* Researcher names for testing
  Marcelo F. Frías (137 articles)
  Silvyo Ergatis (2 articles)
  carlos gustavo lopez pombo (54 articles)
  Juan Pablo Galeotti (77 articles)
*/

async function main(username, years=[]) {
  try {
    let userId = await getUserId(username);
    console.log(username + ': ' + userId);

    let articleURLs = await getArticleURLs(userId, years);
    createLog('./logs', articleURLs, 'json');

    let articles = await getArticlesFromUser(articleURLs);
    createLog('./logs', articles, 'json');
    console.log(articles);
  } catch (error) {
    console.error(error); 
  }
}

main('carlos gustavo lopez pombo', [2019]);

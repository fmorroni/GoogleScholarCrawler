import getUserId from './getUserId.js';
import getArticleURLs from './getArticleURLs.js';
import getArticlesFromURLs from "./getArticlesFromUser.js";
import createLog from './createLog.js';
import { User, UserParser } from "./userParser.js"; 

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

    let data = {};

    let userParser = new UserParser();
    let user = await userParser.parseUserProfile(userId);
    data.userProfile = user;

    let articleURLs = await getArticleURLs(userId, years);
    data.articleURLs = [...articleURLs];

    let articles = await getArticlesFromURLs(articleURLs);
    data.articles = articles;

    await createLog('./logs', data, 'json');
    console.log(articles);
  } catch (error) {
    console.error(error); 
  }
}

main('carlos gustavo lopez pombo', []);

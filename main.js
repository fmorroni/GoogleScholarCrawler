import getUserId from './getUserId.js';
import getArticleURLs from './getArticleURLs.js';
import getArticlesFromURLs from "./getArticlesFromURLs.js";
import getIDsFromInstitution from "./getIDsFromInstitution.js"
import UserParser from "./userParser.js";
import { institutionURL } from './globals.js';
import createLog from './createLog.js';

/* Researcher names for testing
  Marcelo F. Frías (137 articles)
  Silvyo Ergatis (2 articles)
  carlos gustavo lopez pombo (54 articles)
  Juan Pablo Galeotti (77 articles)
*/

async function main(years = []) {
  try {
    console.log('Searching for articles from years: ', years);
    let data = { userProfiles: [], articleURLs: [], parsedArticles: [] };
    let articleNamesNoRepeat = [];

    let userParser = new UserParser();
    for (let userId of await getIDsFromInstitution(institutionURL)) {
      console.log('Parsing new user', userId);
      await userParser.parseUserProfile(userId); // esto como que agrega una request más por user, I don't like that...
      let user = userParser.getProfile();
      console.log(user.name);
      data.userProfiles.push(user);

      console.log('Parsing user article links')
      let { urls: articleURLs, names: articleNames } = await getArticleURLs(userId, years);
      console.log('All articles', articleURLs, articleNames);
      articleURLs = articleURLs.filter((url, index) => {
        if (articleNamesNoRepeat.includes(articleNames[index])) {
          return false;
        } else {
          articleNamesNoRepeat.push(articleNames[index]);
          return true;
        }
      });
      console.log('Non repeated articles', articleURLs)
      data.articleURLs.push(...articleURLs);
    }

    console.log('Complete list of non repeated articles: ', data.articleURLs);
    let articles = await getArticlesFromURLs(data.articleURLs);
    data.articles = articles;

    await createLog('./logs', data, 'json');
    // console.log(articles);
  } catch (error) {
    console.error(error);
  }
}

main([2019]);

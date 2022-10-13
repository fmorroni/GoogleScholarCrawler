import makeRequest from './makeRequest.js';
import { randDelay } from './delay.js';
import { domain, language } from './globals.js'

export default async function getArticleURLs(userId, years = []) {
  try {
    let pageStart = 0;
    // 100 is the maximum google scholar will send for each request.
    let pageSize = 100;
    let articleURLs = [];

    let articlesLeft;
    do {
      // https://scholar.google.com/citations?hl=es&user=DGmfF8QAAAAJ&view_op=list_works&sortby=pubdate
      let requestUrl = `${domain}/citations?user=${userId}&hl=${language}&oi=ao&cstart=${pageStart}&pagesize=${pageSize}`;
      pageStart += pageSize;

      const document = await makeRequest(requestUrl);
      let articleNodes = document.querySelectorAll('form table tbody')[0].querySelectorAll('tr');
      // The above selector finds a "There are no articles in this profile." node when there are no
      // articles left, so articleNodes will never be empty. So I added a querySelector('a') to account
      // for that.
      articlesLeft = Boolean(articleNodes[0].querySelector('a'));
      if (articlesLeft) {
        articleNodes.forEach(ele => {
          let year = parseInt(ele.children[2].textContent);
          if (years.length === 0 || years.includes(year)) {
            articleURLs.push(domain + ele.querySelector('a').href);
          }
        });
      }
      await randDelay(5, 10);
    } while (articlesLeft);

    return Promise.resolve(articleURLs);
  } catch (error) {
    return Promise.reject(error);
  }
}

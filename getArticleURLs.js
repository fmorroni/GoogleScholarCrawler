import makeRequest from './makeRequest.js';
import { randDelay } from './delay.js';
import { domain, language, smallDelay, mediumDelay } from './globals.js'

export default async function getArticleURLs(userId, years = []) {
  try {
    let pageStart = 0;
    // 100 is the maximum google scholar will send for each request.
    let pageSize = 100;
    let articleURLs = [];
    // Had to add this in order to check article repetition between users.
    let articleHashes = [];

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
            articleURLs.push(domain + '/' + ele.children[0].querySelector('a').href);
            let name = ele.children[0].children[0].textContent;
            let authors = ele.children[0].children[1].textContent;
            let totalCitations = ele.children[1].textContent;
            let year = ele.children[2].textContent;
            articleHashes.push(generateHash(name + authors + totalCitations + year));
          }
        });
      }
      await randDelay(...mediumDelay);
    } while (articlesLeft);

    return Promise.resolve({ urls: articleURLs, ids: articleHashes });
  } catch (error) {
    console.log('At getArticleURLs.');
    return Promise.reject(error);
  }
}

// Polynomial rolling hash function.
function generateHash(string) {
  let hash = 0;
  let p = 61, m = 10 ** 9 + 9;
  let p_pow = 1;
  for (let i = 0; i < string.length; i++) {
    hash += string[i].charCodeAt() * p_pow % m;
    p_pow = (p_pow * p) % m;
  }

  return hash;
}

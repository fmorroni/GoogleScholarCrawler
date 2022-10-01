import makeRequest from './makeRequest.js';

export class Article {
  constructor() {
    this.title;
    this.scholarUrl;
    this.externalArticleUrl;
    this.pdfLink;
    this.totalCitations;
  }
}

export class ArticleParser {
  constructor() {
    this.articleDom;
    this.article = new Article();
    this.contentsNodeList;
    this.notFoundMsg = '<Value not found.>';
  }

  async generateArticle(articleUrl) {
    try {
      this.articleDom = await makeRequest(articleUrl);

      this.article.scholarUrl = articleUrl;
      this.parseTitle();
      this.parseArticleLink();
      this.parsePdfLink();

      this.contentsNodeList = this.articleDom.querySelector('div[id*="table"').querySelectorAll(':scope > div');
      this.parseContents();

      return Promise.resolve(this.article);
    } catch (error) {
      //console.error('Error while parsing article at ' + articleUrl, error);
      return Promise.reject(error);
    }
  }

  verify(value, property) {
    return value ? value[property] : this.notFoundMsg;
  }

  parseTitle() {
    let title = this.articleDom.querySelector('div[id*="title"]').lastChild;
    if (!title) title = this.articleDom.querySelector('div[id*="title"]').textContent;

    this.article.title = this.verify(title, 'textContent');
  }

  parseArticleLink() {
    let externalArticleUrl = this.articleDom.querySelector('a[class*="title"]');

    this.article.externalArticleUrl = this.verify(externalArticleUrl, 'href');
  }

  parsePdfLink() {
    let pdfLink = this.articleDom.querySelector('div[class*="title"] > a');

    this.article.pdfLink = this.verify(pdfLink, 'href');
  }

  parseContents() {
    // let specialCases = new Set(['Total citations', 'Scholar articles'])
    for (let node of this.contentsNodeList) {
      let key = this.formatKey(node.children[0].textContent);
      if (!/totalCitations/.test(key) && !/scholar\s?articles/i.test(key)) {
        this.article[key] = node.children[1].textContent;
      } else if (/totalCitations/.test(key)) {
        this.article[key] = parseInt(node.children[1].children[0].textContent.match(/\d+/));
      }
    }
  }

  formatKey(key) {
    key = key.replaceAll(/\s(\w)/g, match => match[1].toUpperCase());
    key = key.replace(/^\w/, match => match[0].toLowerCase());

    return key;
  }
}

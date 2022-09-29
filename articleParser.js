import makeRequest from './makeRequest.js';

export class Article {
  constructor() {
    this.title;
    this.articleLink;
    this.pdfLink;
    this.authors;
    this.publicationDate;
    this.book;
    this.description;
    this.totalCitations;
  }
}

export class ArticleParser {
  constructor() {
    this.articleDom;
    this.contentsNodeList;
    this.isComplete;
    this.notFoundMsg = '<Value not found.>';
  }

  async generateArticle(articleUrl) {
    try {
      this.articleDom = await makeRequest(articleUrl);
      this.isComplete = Boolean(this.articleDom.querySelector('a[class*="title"]'));

      let article = new Article();
      article.title = this.parseTitle();
      if (!this.isComplete) throw (new Error(`\nArticle \n--- ${article.title} ---\nat \n${articleUrl}\n is missing information. Skiping.`));

      article.articleLink = this.parseArticleLink();
      article.pdfLink = this.parsePdfLink();

      this.contentsNodeList = this.articleDom.querySelector('div[id*="table"').querySelectorAll(':scope > div');

      article.authors = this.parseAuthors();

      article.publicationDate = this.parsePublicationDate();
      article.book = this.parseBook();
      article.description = this.parseDescription();
      article.totalCitations = this.parseTotalCitations();

      return Promise.resolve(article);
    } catch (error) {
      //console.error('Error while parsing article at ' + articleUrl, error);
      return Promise.reject(error);
    }
  }

  parseTitle() {
    let title = this.isComplete ?
      this.articleDom.querySelector('a[class*="title"]').textContent :
      this.articleDom.querySelector('div[id*="title"]').textContent;

    if (!title) title = this.notFoundMsg;

    return title;
  }

  parseArticleLink() {
    let articleLink = this.articleDom.querySelector('a[class*="title"]').href;

    if (!articleLink) articleLink = this.notFoundMsg;

    return articleLink;
  }

  parsePdfLink() {
    let pdfLink = this.articleDom.querySelector('div[class*="title"]').children[0].href;

    if (!pdfLink) pdfLink = this.notFoundMsg;

    return pdfLink;
  }

  parseAuthors() {
    let authors = this.contentsNodeList[0].children[1].textContent.split(', ');

    if (!authors) authors = this.notFoundMsg;

    return authors;
  }

  parsePublicationDate() {
    let publicationDate = this.contentsNodeList[1].children[1].textContent;

    if (!publicationDate) publicationDate = this.notFoundMsg;

    return publicationDate;
  }

  parseBook() {
    let book = this.contentsNodeList[2].children[1].textContent;

    if (!book) book = this.notFoundMsg;

    return book;
  }

  parseDescription() {
    let description = this.contentsNodeList[4].children[1].textContent;

    if (!description) description = this.notFoundMsg;

    return description;
  }

  parseTotalCitations() {
    let totalCitations = parseInt(this.contentsNodeList[5].children[1].children[0].textContent.match(/\d+/)[0]);

    if (!totalCitations) totalCitations = this.notFoundMsg;

    return totalCitations;
  }
}

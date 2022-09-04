import makeRequest from './makeRequest.js';

export class Article {
    constructor() {
        this.title;
        this.articleLink;
        this.authors;
        this.publicationDate;
        this.book;
        this.description;
        this.totalCitations;
        this.pdfLink;
    }
}

export class ArticleParser {
    constructor() {
        this.articleDom;
    }

    async generateArticle(articleUrl) {
        this.articleDom = await makeRequest(articleUrl);
        let article = new Article();
        article.title = this.parseTitle();
        article.articleLink = this.parseArticleLink();

        return Promise.resolve(article);
    }

    parseTitle() {
        return this.articleDom.querySelector('a[class*="title"]').textContent;
    }

    parseArticleLink() {
        return this.articleDom.querySelector('a[class*="title"]').href;
    }

    // Other parses would go here.
}

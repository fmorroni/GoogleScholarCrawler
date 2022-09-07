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
        this.isComplete;
    }

    async generateArticle(articleUrl) {
        try {
            this.articleDom = await makeRequest(articleUrl);
            this.isComplete = Boolean(this.articleDom.querySelector('a[class*="title"]'));

            let article = new Article();
            article.title = this.parseTitle();
            if (!this.isComplete) throw (new Error(`\nArticle \n--- ${article.title} ---\nat \n${articleUrl}\n is missing information. Skiping.`));

            article.articleLink = this.parseArticleLink();

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

        return title;
    }

    parseArticleLink() {
        return this.articleDom.querySelector('a[class*="title"]').href;
    }

    // Other parses would go here.
}

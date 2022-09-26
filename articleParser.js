import makeRequest from './makeRequest.js';

export class Article {
    constructor() {
        this.title;
        this.articleLink;
        this.pdfLink;
        // this.authors;
        // this.publicationDate;
        // this.book;
        // this.description;
        // this.totalCitations;
    }
}

export class ArticleParser {
    constructor() {
        this.articleDom;
        this.article;
        this.contentsNodeList;
        this.isComplete;
        this.notFoundMsg = '<Value not found.>';
    }

    async generateArticle(articleUrl) {
        try {
            this.articleDom = await makeRequest(articleUrl);
            // this.isComplete = Boolean(this.articleDom.querySelector('a[class*="title"]'));

            this.article = new Article();
            this.parseTitle();
            //if (!this.isComplete) throw (new Error(`\nArticle \n--- ${article.title} ---\nat \n${articleUrl}\n is missing information. Skiping.`));

            this.parseArticleLink();
            this.parsePdfLink();

            this.contentsNodeList = this.articleDom.querySelector('div[id*="table"').querySelectorAll(':scope > div');
            this.parseContents();

            // article.authors = this.parseAuthors();

            // article.publicationDate = this.parsePublicationDate();
            // article.book = this.parseBook();
            // article.description = this.parseDescription();
            // article.totalCitations = this.parseTotalCitations();

            return Promise.resolve(this.article);
        } catch (error) {
            //console.error('Error while parsing article at ' + articleUrl, error);
            return Promise.reject(error);
        }
    }

    parseTitle() {
        let title = this.articleDom.querySelector('div[id*="title"]').lastChild;
        
        this.article.title = title ? title.textContent : this.notFoundMsg;
    }

    parseArticleLink() {
        let articleLink = this.articleDom.querySelector('a[class*="title"]');

        this.article.articleLink = articleLink ? articleLink.href : this.notFoundMsg;
    }

    parsePdfLink() {
        let pdfLink = this.articleDom.querySelector('div[class*="title"] > a');

        this.article.pdfLink = pdfLink ? pdfLink.href : this.notFoundMsg;
    }

    parseContents() {
        for (let node of this.contentsNodeList) {
            let key = node.children[0].textContent;
            this.article[key] = node.children[1].textContent;
        }
    }

    // parseAuthors() {
    //     let authors = this.contentsNodeList[0].children[1].textContent.split(', ');

    //     if (!authors) authors = this.notFoundMsg;

    //     return authors;
    // }

    // parsePublicationDate() {
    //     let publicationDate = this.contentsNodeList[1].children[1].textContent;

    //     if (!publicationDate) publicationDate = this.notFoundMsg;

    //     return publicationDate;
    // }

    // parseBook() {
    //     let book = this.contentsNodeList[2].children[1].textContent;

    //     if (!book) book = this.notFoundMsg;

    //     return book;
    // }

    // parseDescription() {
    //     let description = this.contentsNodeList[4].children[1].textContent;

    //     if (!description) description = this.notFoundMsg;

    //     return description;
    // }

    //parseTotalCitations() {
    //    let totalCitations = this.contentsNodeList[5].children[1].children[0];

    //    if (!totalCitations) totalCitations = this.notFoundMsg;
    //    //parseInt(totalCitations.textContent.match(/\d+/)[0])

    //    return totalCitations;
    //}
}

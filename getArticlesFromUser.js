import {ArticleParser} from './articleParser.js'
import getArticlesURL from './getArticlesURL.js'

async function getArticlesFromUser(username) {
	try {
		let citationLinks = await getArticlesURL(username);
		const maxParalelRequests = 10;
		let articles = [];
		while (citationLinks.length) {
			console.log('Getting promises...');
			let promises = await getArticlePromises(citationLinks.splice(0, maxParalelRequests));
			console.log('Got promises.');
			console.log('Generating article batch...');
			Promise.all(promises).then(promisedArticles => {
				articles.concat(promisedArticles);
			});
			console.log('Batch generated.');
		}
		console.log('Generated all articles.');
	} catch(error) {
		console.error(error);
	}
}

async function getArticlePromises(citationLinks) {
	let promises = [];
	for (let link of citationLinks) {
			let articleParser = new ArticleParser();
			promises.push(articleParser.generateArticle(link));
	}

	return Promise.resolve(promises);
}

let articles;
getArticlesFromUser('Juan Pablo Galeotti').then(arts => {
	articles = arts;
	console.log(articles);
});


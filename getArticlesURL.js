import makeRequest from './makeRequest.js';
import getUserId from './getUserId.js';

export default async function getArticlesURL(username) {	
	try {
		let userId = await getUserId(username);
		console.log(username + ': ' + userId);
		let domain = 'https://scholar.google.com';
		let pageStart = 0;
		// 100 is the maximum google scholar will send for each request.
		let pageSize = 100;
		let citationLinks = [];

		let articlesLeft;
    do {
        let requestUrl = `${domain}/citations?user=${userId}&cstart=${pageStart}&pagesize=${pageSize}`;
        pageStart += pageSize;

        const document = await makeRequest(requestUrl);
        let citations = document.querySelectorAll('form table tbody')[0].querySelectorAll('tr');
        articlesLeft = Boolean(citations[0].querySelector('a'));
        if (articlesLeft) {
            citations.forEach(ele => citationLinks.push(ele.querySelector('a').href));
        } 
    } while (articlesLeft);

    return Promise.resolve(citationLinks);
    } catch (error) {
        return Promise.reject(error);
    }
}

//let username = 'Marcelo F. Frías';
//if (process.argv.length > 2) {
    //username = process.argv[2];
//}
//
//let citationLinks;
//getArticlesURL(username)
    //.then(response => {
    //citationLinks = response;
    //console.log("Links: ", citationLinks);
    //console.log("Amount of articles: ", citationLinks.length);
    //})
    //.catch(error => console.error(error));

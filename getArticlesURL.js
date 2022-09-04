//import fetch, {Request} from 'node-fetch';
import {Request} from 'node-fetch';
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

        let thereAreArticles = 1;
        do {
            let requestUrl = `${domain}/citations?user=${userId}&cstart=${pageStart}&pagesize=${pageSize}`;
            //console.log(pageStart, requestUrl);
            let myRequest = new Request(requestUrl);
            pageStart += pageSize;

            const document = await makeRequest(myRequest);
            let citations = document.querySelectorAll('form table tbody')[0].querySelectorAll('tr');
            thereAreArticles = Boolean(citations[0].querySelector('a'));
            if (thereAreArticles) {
                citations.forEach(ele => citationLinks.push(domain + ele.querySelector('a').href));
            } 
        } while (thereAreArticles);

        return Promise.resolve(citationLinks);
    } catch (error) {
        return Promise.reject(console.error(new Error('Something went wrong')));
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

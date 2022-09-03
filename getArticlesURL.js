//import fetch, {Request} from 'node-fetch';
import {Request} from 'node-fetch';
import makeRequest from './makeRequest.js';
import getUserId from './getUserId.js';

//let userId = 'xeL-QIoAAAAJ';

async function getCitationURLs(userId) {
    let domain = 'https://scholar.google.com';
    let pageStart = 0;
    // 100 is the maximum google scholar will send for each request.
    let pageSize = 100;
    let citationLinks = [];

    let thereAreArticles = 1;
    do {
        let requestUrl = `${domain}/citations?user=${userId}&cstart=${pageStart}&pagesize=${pageSize}`;
        console.log(pageStart, requestUrl);
        let myRequest = new Request(requestUrl);
        pageStart += pageSize;

        try {
            const document = await makeRequest(myRequest);
            let citations = document.querySelectorAll('form table tbody')[0].querySelectorAll('tr');
            thereAreArticles = Boolean(citations[0].querySelector('a'));
            if (thereAreArticles) {
                citations.forEach(ele => citationLinks.push(domain + ele.querySelector('a').href));
            } 
        } catch (error) {
            console.log('Error in getCitationURLs', error);
            thereAreArticles = false;
        }

    }
    while (thereAreArticles);

    return Promise.resolve(citationLinks);
}

let citationLinks;
getUserId('Marcelo F. Frías').then(userId => {
    getCitationURLs(userId).then(response => {
        citationLinks = response;
        console.log("Links: ", citationLinks);
        console.log("Amount of articles: ", citationLinks.length);
    });
});

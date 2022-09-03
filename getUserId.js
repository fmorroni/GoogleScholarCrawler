import {Request} from 'node-fetch';
import makeRequest from './makeRequest.js';

export default async function getCitationURLs(userId) {
    let domain = 'https://scholar.google.com';
    let requestUrl = `${domain}/citations?view_op=search_authors&mauthors=${userId}`;
    let myRequest = new Request(requestUrl);

    try {
        const document = await makeRequest(myRequest);
        let userId = document.querySelector('a[href*="user"]:not([class])');
        if (userId) {
            return Promise.resolve(userId.href.match(/(?<=user=)[a-zA-zj0-9-]*/)[0]);
        } 
    } catch (error) {
        console.log('No user found.', error);
    }
}

//let userId;
//getCitationURLs('carlos gustavo lopez pombo').then(response => {
    //userId = response;
    //console.log(userId);
//});

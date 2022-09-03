import {Request} from 'node-fetch';
import makeRequest from './makeRequest.js';

export default async function getUserId(userId) {
    let domain = 'https://scholar.google.com';
    let requestUrl = `${domain}/citations?view_op=search_authors&mauthors=${userId}`;
    let myRequest = new Request(requestUrl);

    try {
        const document = await makeRequest(myRequest);
        let userId = document.querySelector('a[href*="user"]:not([class])');
        if (userId) {
            return Promise.resolve(userId.href.match(/(?<=user=)[a-zA-zj0-9-]*/)[0]);
        } else {
            throw new Error('No user found.');
        }
    } catch (error) {
        return Promise.reject(console.error(error));
    }
}

//let userId;
//getUserId('carlos gustavo lopez pombo').then(response => {
    //userId = response;
    //console.log(userId);
//});

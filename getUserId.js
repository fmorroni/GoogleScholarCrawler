import makeRequest from './makeRequest.js';

export default async function getUserId(username) {
  try {
    let domain = 'https://scholar.google.com';
    let requestUrl = `${domain}/citations?hl=${language}&view_op=search_authors&mauthors=${username}&btnG=`;
    const document = await makeRequest(requestUrl);
    let userId = document.querySelector('a[href*="user"]:not([class])');
    if (userId) {
      return Promise.resolve(userId.href.match(/user=([^&]*)/)[1]);
    } else {
      throw (new Error('No user found.'));
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

import makeRequest from './makeRequest.js';

export default async function getUserId(username) {
  try {
    let domain = 'https://scholar.google.com';
    let language = 'en';
    let requestUrl = `${domain}/citations?view_op=search_authors&mauthors=${username}&hl=${language}`;
    const document = await makeRequest(requestUrl);
    let userId = document.querySelector('a[href*="user"]:not([class])');
    if (userId) {
      return Promise.resolve(userId.href.match(/(?<=user=)[a-zA-zj0-9-]*/)[0]);
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

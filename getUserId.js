import makeRequest from './makeRequest.js';
import { domain, language } from './globals.js'

export default async function getUserId(username) {
  try {
    let requestUrl = `${domain}/citations?hl=${language}&view_op=search_authors&mauthors=${username}&btnG=`;
    const document = await makeRequest(requestUrl);
    let userId = document.querySelector('a[href*="user"]:not([class])');
    if (userId) {
      return Promise.resolve(userId.href.match(/user=([^&]*)/)[1]);
    } else {
      throw new Error('No user found.');
    }
  } catch (error) {
    return Promise.reject(console.error(error));
  }
}

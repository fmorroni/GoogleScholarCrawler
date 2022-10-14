import makeRequest from './makeRequest.js';
import { randDelay } from './delay.js';
import { institutionURL } from './globals.js';

export default async function getIDsFromInstitution(institutionURL) {
  try {
    console.log('Waiting for first page...');
    let document = await makeRequest(institutionURL);
    let userIDs = [];
    let nextPageButton = { disabled: false };
    while (!nextPageButton.disabled) {
      let usersInPage = document.querySelectorAll('h3 > a[href*="user"]');

      usersInPage.forEach(user => {
        userIDs.push(user.href.match("user=([^&]*)")[1]);
        console.log(user.href.match("user=([^&]*)")[1]);
      });

      let pageButtons = document.querySelectorAll('button[type="button"]');
      nextPageButton = pageButtons[pageButtons.length - 1];
      if (!nextPageButton.disabled) {
        console.log('Waiting for next page...');
        await randDelay(3, 5);
        document = await makeRequest(getNextPageURL(nextPageButton));
      } else {
        console.log('No more pages.');
      }
    }
    console.log("Number of IDs found: ", userIDs.length);

    return Promise.resolve(userIDs);
  } catch (error) {
    return Promise.reject(error);
  }
}

function getNextPageURL(button) {
  let afterAuthor = button.outerHTML.match(/after_author\\x3d(.*?)\\/)[1];
  let astart = button.outerHTML.match(/astart\\x3d(.*?)'/)[1];
  let nextURL = `${institutionURL}&after_author=${afterAuthor}&astart=${astart}`;
  return nextURL;
}

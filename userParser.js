import makeRequest from './makeRequest.js';
import { domain, language } from './globals.js'

export class User {
  constructor() {
    this.id;
    this.profileUrl;
    this.name;
    this.affiliations = [];
    this.emailDomain;
    this.interests = [];
  }
}

export class UserParser {
  constructor() {
    this.document = null;
    this.user = new User();
    this.contentsNodeList = null;
    this.notFoundMsg = '<Value not found.>';
  }

  async parseUserProfile(userId) {
    try {
      let userProfileUrl = `${domain}/citations?user=${userId}&hl=${language}`;

      this.document = await makeRequest(userProfileUrl);

      this.user.id = userId;
      this.user.profileUrl = userProfileUrl;

      let userData = this.document.querySelectorAll('div[role="main"]')[1].children[0].lastChild.children;
      this.user.name = userData[0].textContent;
      this.user.affiliations = userData[1].textContent.split(', ');
      this.user.emailDomain = userData[2].textContent.match(/at (.*)\s?-?/)[1];
      for (let interest of userData[3].children) {
        this.user.interests.push(interest.textContent);
      }

    } catch (error) {
      //console.error('Error while parsing article at ' + articleUrl, error);
      return Promise.reject(error);
    }
  }

  reset() {
    this.user = new User();
  }

  getProfile() {
    let profile = this.user;
    this.reset();
    return profile;
  }
}

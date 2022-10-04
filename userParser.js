import makeRequest, { language } from './makeRequest.js';

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
    this.document;
    this.user = new User();
    this.contentsNodeList;
    this.notFoundMsg = '<Value not found.>';
  }

  async parseUserProfile(userId) {
    try {
      let domain = 'https://scholar.google.com';
      let userProfileUrl = `${domain}/citations?user=${userId}&hl=${language}`;

      this.document = await makeRequest(userProfileUrl);

      this.user.id = userId;
      this.user.profileUrl = userProfileUrl;

      let userData = this.document.querySelectorAll('div[role="main"]')[1].children[0].lastChild.children;
      this.user.name = userData[0].textContent;
      this.user.affiliations = userData[1].textContent.split(', ');
      this.user.emailDomain = userData[2].textContent.match(/at (.*) -/)[1];
      for (let interest of userData[3].children) {
        this.user.interests.push(interest.textContent);
      }

      return Promise.resolve(this.user);
    } catch (error) {
      //console.error('Error while parsing article at ' + articleUrl, error);
      return Promise.reject(error);
    }
  }
}

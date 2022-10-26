export const language = 'en';

export const domain = 'https://scholar.google.com';

export const institutionID = '16159832269951878529';
export const institutionURL = `${domain}/citations?view_op=view_org&hl=${language}&org=${institutionID}`;

export const smallDelay = [4, 8];
export const mediumDelay = [10, 15];
export const bigDelay = [40, 90];

export const userCacheDataFileName = 'userProfiles';

export let fail = {
  fail: false,
  false: function() { this.fail = false },
  true: function() { this.fail = true },
  toggle: function() { this.fail = !this.fail },
};

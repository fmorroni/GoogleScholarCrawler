export const language = 'en';

export const domain = 'https://scholar.google.com';

export const institutionID = '16159832269951878529';
export const institutionURL = `${domain}/citations?view_op=view_org&hl=${language}&org=${institutionID}`;

export const smallDelay = [3, 5];
export const mediumDelay = [7, 10];
// With [30, 60] got blocked at 43 articles parsed.
export const bigDelay = [40, 90];

export const userCacheDataFileName = 'userProfiles';
export const parsedArticlesDir = './articles';

export let fail = {
  fail: false,
  false: function() { this.fail = false },
  true: function() { this.fail = true },
  toggle: function() { this.fail = !this.fail },
};

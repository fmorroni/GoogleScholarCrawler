import getUserId from "./getUserId.js";
import getIDsFromInstitution from './getIDsFromInstitution.js';
import { domain, language } from './globals.js';

/*
let username = 'carlos gustavo lopez pombo';
getUserId(username)
  .then(res => {
    console.log(res);
  })
  .catch(err => console.error(err));
*/

let URL = `${domain}/citations?view_op=view_org&org=16159832269951878529&hl=${language}&oi=io`;
console.log(URL);

getIDsFromInstitution(`${domain}/citations?view_op=view_org&org=16159832269951878529&hl=${language}&oi=io`)
  .then(IDs => {
    console.log(IDs);
  });

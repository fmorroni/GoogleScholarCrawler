import getUserId from "./getUserId.js";
import getIDsFromInstitution from './getIDsFromInstitution.js';
import { institutionURL } from './globals.js';

/*
let username = 'carlos gustavo lopez pombo';
getUserId(username)
  .then(res => {
    console.log(res);
  })
  .catch(err => console.error(err));
*/

getIDsFromInstitution(institutionURL)
  .then(IDs => {
    console.log(IDs);
  });

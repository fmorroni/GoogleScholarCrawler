import getUserId from "./getUserId.js";

let username = 'carlos gustavo lopez pombo';
getUserId(username)
  .then(res => {
    console.log(res);
  })
  .catch(err => console.error(err));

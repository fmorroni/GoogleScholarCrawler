import fs from 'fs/promises';

export default async function createLog(directory, content, type = 'text') {
  try {
    if (type.toLowerCase() === 'json') {
      content = JSON.stringify(content, null, ' ');
    }
    await fs.writeFile(directory + '/' + getFormatedDate(), content);
  } catch (error) {
    console.error(error);
  }
}

function getFormatedDate() {
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth();
  if (month.toString().length < 2) month = '0' + month;
  let day = date.getDate();
  if (day.toString().length < 2) day = '0' + day;
  let hours = date.getHours();
  if (hours.toString().length < 2) hours = '0' + hours;
  let mins = date.getMinutes();
  if (mins.toString().length < 2) mins = '0' + mins;
  let secs = date.getSeconds();
  if (secs.toString().length < 2) secs = '0' + secs;

  return `${year}-${month}-${day}-${hours}-${mins}-${secs}`;
}

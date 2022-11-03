import fs from 'fs/promises';

export default async function articlesToCSV(fileName, outputFileName) {
  try {
    let parsedArticles = JSON.parse(await fs.readFile('./articles/' + fileName)).parsedArticles;
    let keys = new Set();
    for (const article of parsedArticles) {
      for (const key in article) {
        keys.add(key);
      }
    }
    keys = Array.from(keys);
    let authorKeyIndex = keys.indexOf('authors');
    let separator = '\t';
    let headers = keys.join(separator);
    let rows = [headers];
    for (const article of parsedArticles) {
      let row = '';
      let authors;
      for (const key of keys) {
        if (key !== 'authors') {
          row += article[key] ? article[key] + separator : separator;
        } else {
          authors = article[key].split(', ');
          row += authors.pop() + separator;
        }
      }
      rows.push(row);
      for (const author of authors) {
        row = separator.repeat(authorKeyIndex);
        row += author;
        row += separator.repeat(keys.length - authorKeyIndex - 1);
        rows.push(row);
      }
    }
    await fs.writeFile('./articles/' + outputFileName, rows.join('\n'));
  } catch (err) {
    throw new Error(err);
  }
}

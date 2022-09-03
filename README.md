# GoogleScholarCrawler
Running the command
```
node getArticlesURL.js $authorName
```
returns a list of all the article URLs in the author's Google Scholar profile.

$authorName is searched at https://scholar.google.com/citations?view_op=search_authors. 
If more than one author matches &authorName, then the first one of the list is chosen.
If there is no match then an error is thrown and the program terminates.

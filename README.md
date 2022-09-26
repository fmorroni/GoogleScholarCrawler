# GoogleScholarCrawler
```
getUserId(authorName)
```
Returns author ID by searching for `authorName` at https://scholar.google.com/citations?view_op=search_authors. 
If more than one author matches `authorName`, then the first one of the list is chosen.
If there is no match then an error is thrown.

```
getArticlesURL(authorName)
```
Returns a list of all the article URLs in `authorName`'s profile.

```
getArticlesFromUser(authorName)
```
Returns an array of `Article` objects with all the information of each article in `authorName`'s profile. 

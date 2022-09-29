import fetch, { Request, Headers } from 'node-fetch';
import { JSDOM } from 'jsdom';

export default async function makeRequest(requestUrl) {
  try {
    const myRequest = new Request(requestUrl, { headers: parseHeaders() });
    const response = await fetch(myRequest);
    let document = new JSDOM(await response.text()).window.document;
    if (/(unusual traffic)|(tráfico inusual)/.test(document.body.textContent)) {
      console.log('EMPEZÓ A BLOQUEAR!!!');
      throw (new Error(`Blocked at ${myRequest.url} by google scholar for unusual traffic.`));
    }
    return Promise.resolve(document);
  } catch (error) {
    return Promise.reject(error);
  }
}

function parseHeaders() {
  // Directly copied from a real user request.
  // Without headers Google Scholar was blocking every request I tried to make.
  let requestHeaders = `:authority: scholar.google.com
                            :method: GET
                            :path: /citations?view_op=search_authors&mauthors=asdf&hl=en&oi=drw
                            :scheme: https
                            accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8
                            accept-encoding: gzip, deflate, br
                            accept-language: en-US,en;q=0.5
                            cache-control: max-age=0
                            referer: https://scholar.google.com/scholar?hl=en&as_sdt=0%2C5&q=asdf&btnG=
                            sec-fetch-dest: document
                            sec-fetch-mode: navigate
                            sec-fetch-site: same-origin
                            sec-fetch-user: ?1
                            sec-gpc: 1
                            upgrade-insecure-requests: 1
                            user-agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.102 Safari/537.36`;
  requestHeaders = requestHeaders.trim().split('\n');
  let myHeaders = new Headers();
  if (requestHeaders != '') {
    for (let header of requestHeaders) {
      header = header.trim();
      if (header[0] == ':') {
        header = header.replace(':', '');
      }
      header = header.split(': ');
      myHeaders.append(header[0], header[1]);
    }
  }

  return myHeaders;
}
